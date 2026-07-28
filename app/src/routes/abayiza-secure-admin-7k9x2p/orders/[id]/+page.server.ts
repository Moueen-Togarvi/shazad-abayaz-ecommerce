import { setAdminFlash } from '$lib/server/admin-flash';
import prisma from '$lib/server/prisma';
import { serializeOrder } from '$lib/server/order-serialization';
import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const order = await prisma.order.findUnique({
		where: { id: params.id },
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

	if (!order) {
		throw error(404, 'Order not found');
	}

	const missingProductNames = order.items
		.filter((item) => !item.product)
		.map((item) => item.productName)
		.filter(Boolean);

	if (missingProductNames.length) {
		const fallbackProducts = await prisma.product.findMany({
			where: { name: { in: [...new Set(missingProductNames)] } },
			include: {
				images: { orderBy: { displayOrder: 'asc' } }
			}
		});
		const productsByName = new Map(fallbackProducts.map((product) => [product.name, product]));

		for (const item of order.items as any[]) {
			if (!item.product) {
				item.product = productsByName.get(item.productName) || null;
			}
		}
	}

	return {
		order: serializeOrder(order)
	};
};

export const actions: Actions = {
	updateStatus: async ({ request, params, cookies }) => {
		const data = await request.formData();
		const status = String(data.get('status') || '').trim();
		const allowedStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

		if (!allowedStatuses.includes(status)) {
			return fail(400, { error: 'Invalid order status.' });
		}

		await prisma.order.update({
			where: { id: params.id },
			data: {
				status: status as any,
				isPaid: status === 'DELIVERED' ? true : status === 'CANCELLED' ? false : undefined
			}
		});

		if (status === 'DELIVERED') {
			setAdminFlash(cookies, 'Order marked as complete.');
			throw redirect(303, '/abayiza-secure-admin-7k9x2p/orders/completed');
		}

		if (status === 'CANCELLED') {
			setAdminFlash(cookies, 'Order cancelled successfully.');
			throw redirect(303, '/abayiza-secure-admin-7k9x2p/orders/cancelled');
		}

		setAdminFlash(cookies, 'Order status updated successfully.');
		throw redirect(303, `/abayiza-secure-admin-7k9x2p/orders/${params.id}`);
	}
};
