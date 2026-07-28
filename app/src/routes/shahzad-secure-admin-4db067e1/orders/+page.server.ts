import prisma from '$lib/server/prisma';
import { orderMatchesFilters, serializeOrder } from '$lib/server/order-serialization';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const filters = {
		date: url.searchParams.get('date') || '',
		email: url.searchParams.get('email') || '',
		phone: url.searchParams.get('phone') || '',
		name: url.searchParams.get('name') || '',
		city: url.searchParams.get('city') || ''
	};

	const orders = await prisma.order.findMany({
		where: {
			status: { notIn: ['DELIVERED', 'CANCELLED'] }
		},
		include: {
			user: {
				select: {
					id: true,
					email: true,
					firstName: true,
					lastName: true
				}
			},
			items: true
		},
		orderBy: { createdAt: 'desc' }
	});

	const filteredOrders = orders.filter((order) => orderMatchesFilters(order, filters));
	const serializedOrders = filteredOrders.map((order) => serializeOrder(order));

	return {
		orders: serializedOrders,
		filters
	};
};
