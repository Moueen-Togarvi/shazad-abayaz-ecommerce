import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const customers = await prisma.user.findMany({
		include: {
			orders: true
		},
		orderBy: { createdAt: 'desc' }
	});

	const serializedCustomers = customers.map((c: any) => {
		const totalSpent = c.orders.reduce(
			(acc: number, order: any) => acc + Number(order.totalAmount),
			0
		);
		return {
			id: c.id,
			firstName: c.firstName,
			lastName: c.lastName,
			email: c.email,
			orderCount: c.orders.length,
			totalSpent
		};
	});

	return {
		customers: serializedCustomers
	};
};
