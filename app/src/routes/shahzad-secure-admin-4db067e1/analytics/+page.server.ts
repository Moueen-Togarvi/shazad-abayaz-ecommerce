import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [orders, customers, products, categories, orderItems] = await Promise.all([
		prisma.order.findMany({
			orderBy: { createdAt: 'desc' }
		}),
		prisma.user.count({ where: { role: 'CUSTOMER' } }),
		prisma.product.count(),
		prisma.collection.count(),
		prisma.orderItem.findMany()
	]);

	const revenue = orders.reduce(
		(total: number, order: any) => total + Number(order.totalAmount),
		0
	);
	const averageOrderValue = orders.length ? revenue / orders.length : 0;
	const productMap = new Map<string, { name: string; units: number; revenue: number }>();

	for (const item of orderItems as Array<any>) {
		const existing = productMap.get(item.productName) || {
			name: item.productName,
			units: 0,
			revenue: 0
		};
		existing.units += item.quantity;
		existing.revenue += Number(item.priceAtPurchase) * item.quantity;
		productMap.set(item.productName, existing);
	}

	return {
		kpis: {
			revenue,
			orders: orders.length,
			customers,
			averageOrderValue,
			products,
			categories
		},
		topProducts: Array.from(productMap.values())
			.sort((a, b) => b.revenue - a.revenue)
			.slice(0, 6),
		recentOrders: orders.slice(0, 8).map((order: any) => ({
			id: order.id,
			orderNumber: order.orderNumber,
			status: order.status,
			totalAmount: Number(order.totalAmount),
			createdAt: order.createdAt
		}))
	};
};
