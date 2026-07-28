import prisma from '$lib/server/prisma';
import { serializeOrder } from '$lib/server/order-serialization';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const orderId = url.searchParams.get('order');
	if (!orderId) return { order: null };

	const order = await prisma.order.findUnique({
		where: { id: orderId },
		include: {
			user: {
				select: {
					id: true,
					email: true,
					firstName: true,
					lastName: true
				}
			},
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

	if (!order) return { order: null };

	return {
		order: serializeOrder(order)
	};
};
