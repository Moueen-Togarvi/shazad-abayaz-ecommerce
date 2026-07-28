import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const customer = await prisma.user.findUnique({
		where: { id: params.id },
		include: {
			orders: { orderBy: { createdAt: 'desc' } },
			addresses: true
		}
	});

	if (!customer) {
		throw error(404, 'Customer not found');
	}

	const orders = customer.orders.map((order: any) => ({
		id: order.id,
		orderNumber: order.orderNumber,
		status: order.status,
		totalAmount: Number(order.totalAmount),
		createdAt: order.createdAt
	}));
	const totalSpent = orders.reduce((total: number, order: any) => total + order.totalAmount, 0);

	return {
		customer: {
			...customer,
			orders,
			totalSpent,
			averageOrderValue: orders.length ? totalSpent / orders.length : 0
		}
	};
};
