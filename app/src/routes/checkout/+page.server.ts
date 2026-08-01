import prisma from '$lib/server/prisma';
import { sendOrderNotifications } from '$lib/server/order-notifications';
import { fail, redirect } from '@sveltejs/kit';
import { randomBytes } from 'node:crypto';
import type { Actions } from './$types';

type CheckoutCartItem = {
	id?: string;
	productId?: string;
	variantId?: string;
	name?: string;
	price?: number;
	quantity?: number;
	color?: string;
	size?: string;
	image?: string;
};

type ValidatedCheckoutItem = {
	productId: string;
	variantId: string;
	name: string;
	price: number;
	quantity: number;
	color: string | null;
	size: string | null;
	image: string | null;
};

const getText = (data: FormData, key: string) => String(data.get(key) ?? '').trim();

const parseCartItems = (value: string): CheckoutCartItem[] => {
	const parsed = JSON.parse(value);
	if (!Array.isArray(parsed)) return [];
	return parsed;
};

const getCodShippingCharge = (quantity: number) => {
	if (quantity <= 1) return 300;
	if (quantity === 2) return 400;
	if (quantity <= 4) return 500;
	if (quantity <= 7) return 700;
	return 700;
};

const orderNumberCandidate = () => {
	const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
	return `ABY-${date}-${randomBytes(2).toString('hex').toUpperCase()}`;
};

const createOrderNumber = async () => {
	for (let attempt = 0; attempt < 8; attempt += 1) {
		const orderNumber = orderNumberCandidate();
		const existing = await prisma.order.findUnique({ where: { orderNumber } });
		if (!existing) return orderNumber;
	}

	return `ABY-${Date.now()}`;
};

export const actions: Actions = {
	placeOrder: async ({ request, url }) => {
		const data = await request.formData();

		let cartItems: CheckoutCartItem[];
		try {
			cartItems = parseCartItems(getText(data, 'cartJson'));
		} catch (error) {
			return fail(400, { error: 'Cart data is invalid. Please refresh checkout and try again.' });
		}

		const normalizedItems = cartItems
			.map((item) => ({
				productId: String(item.productId ?? '').trim(),
				variantId: String(item.variantId || item.id || '').trim(),
				name: String(item.name ?? '').trim(),
				price: Number(item.price ?? 0),
				quantity: Math.max(1, Math.trunc(Number(item.quantity ?? 1))),
				color: item.color ? String(item.color) : null,
				size: item.size ? String(item.size) : null,
				image: item.image ? String(item.image) : undefined
			}))
			.filter(
				(item) => item.name && Number.isFinite(item.price) && item.price >= 0 && item.quantity > 0
			);

		if (normalizedItems.length === 0) {
			return fail(400, { error: 'Your cart is empty. Add a product before placing an order.' });
		}

		const email = getText(data, 'email');
		const firstName = getText(data, 'firstName');
		const lastName = getText(data, 'lastName');
		const addressLine1 = getText(data, 'addressLine1');
		const addressLine2 = getText(data, 'addressLine2');
		const city = getText(data, 'city');
		const postalCode = getText(data, 'postalCode');
		const phone = getText(data, 'phone');
		const shippingMethod = 'STANDARD';
		const paymentMethod = getText(data, 'paymentMethod') === 'ADVANCE' ? 'ADVANCE' : 'COD';

		if (!email || !firstName || !lastName || !addressLine1 || !city || !postalCode || !phone) {
			return fail(400, {
				error:
					'Please complete all required fields: email, address, city, postal code, and mobile number.'
			});
		}

		const productIds = [...new Set(normalizedItems.map((item) => item.productId).filter(Boolean))];
		const products = productIds.length
			? await prisma.product.findMany({
					where: { id: { in: productIds } },
					include: {
						variants: true,
						images: { orderBy: { displayOrder: 'asc' } }
					}
				})
			: [];
		const productById = new Map(products.map((product) => [product.id, product]));
		const validatedItems: ValidatedCheckoutItem[] = [];

		for (const item of normalizedItems) {
			const product = productById.get(item.productId);

			if (!product || !product.isActive) {
				return fail(400, { error: `${item.name || 'A product'} is no longer available.` });
			}

			const variant =
				product.variants.find((candidate) => candidate.id === item.variantId) ||
				product.variants.find(
					(candidate) => candidate.color === item.color && candidate.size === item.size
				) ||
				product.variants.find((candidate) => candidate.stockCount > 0) ||
				product.variants[0];

			if (!variant || variant.stockCount <= 0) {
				return fail(409, { error: `${product.name} is out of stock. Please remove it from cart.` });
			}

			if (variant.stockCount < item.quantity) {
				return fail(409, {
					error: `${product.name} has only ${variant.stockCount} item${variant.stockCount === 1 ? '' : 's'} left.`
				});
			}

			validatedItems.push({
				productId: product.id,
				variantId: variant.id,
				name: product.name,
				price: Number(product.salePrice ?? product.price),
				quantity: item.quantity,
				color: variant.color,
				size: variant.size,
				image:
					product.images.find((image) => image.color === variant.color)?.url ||
					product.images.find((image) => image.url === item.image)?.url ||
					product.images[0]?.url ||
					null
			});
		}

		const subtotal = validatedItems.reduce((total, item) => total + item.price * item.quantity, 0);
		const totalPieces = validatedItems.reduce((total, item) => total + item.quantity, 0);
		const shippingCost = paymentMethod === 'ADVANCE' ? 0 : getCodShippingCharge(totalPieces);
		const discountTotal = 0;
		const totalAmount = subtotal + shippingCost - discountTotal;
		const orderNumber = await createOrderNumber();

		const shippingAddress = {
			firstName,
			lastName,
			addressLine1,
			addressLine2,
			city,
			postalCode,
			phone,
			country: 'Pakistan'
		};

		let order: { id: string; orderNumber: string };

		try {
			order = await prisma.$transaction(async (tx) => {
				for (const item of validatedItems) {
					const stockUpdate = await tx.productVariant.updateMany({
						where: {
							id: item.variantId,
							stockCount: { gte: item.quantity }
						},
						data: {
							stockCount: { decrement: item.quantity }
						}
					});

					if (stockUpdate.count === 0) {
						throw new Error(`OUT_OF_STOCK:${item.name}`);
					}
				}

				return tx.order.create({
					data: {
						orderNumber,
						guestEmail: email,
						status: 'PENDING',
						paymentMethod,
						isPaid: false,
						subtotal,
						shippingCost,
						discountTotal,
						totalAmount,
						shippingAddress,
						adminNotes: null,
						items: {
							create: validatedItems.map((item) => ({
								productId: item.productId,
								productName: item.name,
								variantColor: item.color,
								variantSize: item.size,
								variantImage: item.image,
								quantity: item.quantity,
								priceAtPurchase: item.price
							}))
						}
					},
					select: { id: true, orderNumber: true }
				});
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : '';
			if (message.startsWith('OUT_OF_STOCK:')) {
				return fail(409, {
					error: `${message.replace('OUT_OF_STOCK:', '')} is out of stock. Please remove it from cart.`
				});
			}

			return fail(500, { error: 'Order could not be placed. Please try again.' });
		}

		await sendOrderNotifications({
			id: order.id,
			orderNumber: order.orderNumber,
			guestEmail: email,
			totalAmount,
			subtotal,
			shippingCost,
			discountTotal,
			paymentMethod,
			shippingAddress,
			siteUrl: url.origin,
			items: validatedItems.map((item) => ({
				productName: item.name,
				variantColor: item.color,
				variantSize: item.size,
				quantity: item.quantity,
				priceAtPurchase: item.price
			}))
		});

		throw redirect(303, `/checkout/success?order=${order.id}`);
	}
};
