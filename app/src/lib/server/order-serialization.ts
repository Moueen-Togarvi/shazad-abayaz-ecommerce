const toNumber = (value: unknown) => Number(value ?? 0);

export const getShippingAddress = (order: any) =>
	(order.shippingAddress && typeof order.shippingAddress === 'object'
		? order.shippingAddress
		: {}) as Record<string, unknown>;

export const getOrderCustomerName = (order: any) => {
	const address = getShippingAddress(order);
	const userName = `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim();
	const addressName = `${address.firstName || ''} ${address.lastName || ''}`.trim();

	return userName || addressName || 'Guest';
};

export const getOrderEmail = (order: any) => order.user?.email || order.guestEmail || '';

export const getOrderPhone = (order: any) => String(getShippingAddress(order).phone || '');

export const getOrderCity = (order: any) => String(getShippingAddress(order).city || '');

export const serializeOrder = (order: any) => ({
	id: order.id,
	orderNumber: order.orderNumber,
	userId: order.userId,
	user: order.user
		? {
				id: order.user.id,
				email: order.user.email,
				firstName: order.user.firstName,
				lastName: order.user.lastName
			}
		: null,
	guestEmail: order.guestEmail,
	status: order.status,
	trackingNumber: order.trackingNumber,
	paymentMethod: order.paymentMethod,
	isPaid: order.isPaid,
	subtotal: toNumber(order.subtotal),
	shippingCost: toNumber(order.shippingCost),
	discountTotal: toNumber(order.discountTotal),
	totalAmount: toNumber(order.totalAmount),
	total: toNumber(order.totalAmount),
	shippingAddress: getShippingAddress(order),
	billingAddress: order.billingAddress || null,
	couponCode: order.couponCode,
	adminNotes: order.adminNotes,
	createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt,
	updatedAt: order.updatedAt instanceof Date ? order.updatedAt.toISOString() : order.updatedAt,
	customerName: getOrderCustomerName(order),
	customerEmail: getOrderEmail(order),
	customerPhone: getOrderPhone(order),
	customerCity: getOrderCity(order),
	items: (order.items || []).map((item: any) => ({
		id: item.id,
		orderId: item.orderId,
		productId: item.productId,
		productName: item.productName,
		variantColor: item.variantColor,
		variantSize: item.variantSize,
		quantity: item.quantity,
		priceAtPurchase: toNumber(item.priceAtPurchase),
		lineTotal: toNumber(item.priceAtPurchase) * Number(item.quantity || 0),
		image: item.product?.images?.[0]?.url || '',
		product: item.product
			? {
					id: item.product.id,
					name: item.product.name,
					slug: item.product.slug,
					price: toNumber(item.product.price),
					salePrice: item.product.salePrice ? toNumber(item.product.salePrice) : null
				}
			: null
	}))
});

export const orderMatchesFilters = (
	order: any,
	filters: { date?: string; email?: string; phone?: string; name?: string; city?: string }
) => {
	const serialized = serializeOrder(order);
	const normalized = {
		email: String(filters.email || '')
			.trim()
			.toLowerCase(),
		phone: String(filters.phone || '')
			.trim()
			.toLowerCase(),
		name: String(filters.name || '')
			.trim()
			.toLowerCase(),
		city: String(filters.city || '')
			.trim()
			.toLowerCase()
	};

	if (filters.date && serialized.createdAt?.slice(0, 10) !== filters.date) return false;
	if (
		normalized.email &&
		!String(serialized.customerEmail).toLowerCase().includes(normalized.email)
	)
		return false;
	if (
		normalized.phone &&
		!String(serialized.customerPhone).toLowerCase().includes(normalized.phone)
	)
		return false;
	if (normalized.name && !String(serialized.customerName).toLowerCase().includes(normalized.name))
		return false;
	if (normalized.city && !String(serialized.customerCity).toLowerCase().includes(normalized.city))
		return false;

	return true;
};
