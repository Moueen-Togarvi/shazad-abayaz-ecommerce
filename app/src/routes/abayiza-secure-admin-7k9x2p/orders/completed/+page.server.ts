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
		where: { status: 'DELIVERED' },
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
		orderBy: { updatedAt: 'desc' }
	});

	return {
		filters,
		orders: orders
			.filter((order) => orderMatchesFilters(order, filters))
			.map((order) => serializeOrder(order))
	};
};
