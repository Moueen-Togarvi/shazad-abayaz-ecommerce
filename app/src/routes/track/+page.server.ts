import prisma from '$lib/server/prisma';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

const serializeOrder = (order: any) => ({
	id: order.id,
	orderNumber: order.orderNumber,
	status: order.status,
	trackingNumber: order.trackingNumber,
	paymentMethod: order.paymentMethod,
	isPaid: order.isPaid,
	totalAmount: Number(order.totalAmount),
	shippingAddress: order.shippingAddress,
	createdAt: order.createdAt,
	items: order.items.map((item: any) => ({
		id: item.id,
		productName: item.productName,
		variantColor: item.variantColor,
		variantSize: item.variantSize,
		quantity: item.quantity,
		priceAtPurchase: Number(item.priceAtPurchase),
		image: item.product?.images?.[0]?.url || ''
	}))
});

export const actions: Actions = {
	track: async ({ request }) => {
		const data = await request.formData();
		const orderNumber = String(data.get('orderNumber') ?? '')
			.trim()
			.replace(/^#/, '');
		const email = String(data.get('email') ?? '')
			.trim()
			.toLowerCase();

		if (!orderNumber || !email) {
			return fail(400, {
				error: 'Order number and email are required.',
				query: { orderNumber, email }
			});
		}

		const order = await prisma.order.findFirst({
			where: {
				AND: [
					{ OR: [{ orderNumber }, { id: orderNumber }] },
					{
						OR: [{ guestEmail: email }, { user: { email } }]
					}
				]
			},
			include: {
				user: true,
				items: {
					include: {
						product: {
							include: {
								images: { orderBy: { displayOrder: 'asc' } }
							}
						}
					}
				}
			}
		});

		if (!order) {
			return fail(404, {
				error: 'No saved order found for those details.',
				query: { orderNumber, email }
			});
		}

		return {
			order: serializeOrder(order),
			query: { orderNumber, email }
		};
	}
};
