import { isSuperAdmin, verifyPassword } from '$lib/server/admin-auth';
import { setAdminFlash } from '$lib/server/admin-flash';
import prisma from '$lib/server/prisma';
import { orderMatchesFilters, serializeOrder } from '$lib/server/order-serialization';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const requireSuperAdmin = (locals: App.Locals) => {
	if (!isSuperAdmin(locals.adminUser?.role)) {
		return fail(403, { error: 'Only a super admin can delete all orders.' });
	}
	return null;
};

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
	const totalOrderCount = await prisma.order.count();

	return {
		orders: serializedOrders,
		filters,
		totalOrderCount
	};
};

export const actions: Actions = {
	deleteAll: async ({ request, locals, cookies }) => {
		const permission = requireSuperAdmin(locals);
		if (permission) return permission;

		const data = await request.formData();
		const password = String(data.get('password') ?? '');

		if (!password) {
			return fail(400, { error: 'Password is required to delete all orders.' });
		}

		const user = await prisma.user.findUnique({ where: { id: locals.adminUser!.id } });
		if (!user || !verifyPassword(password, user.passwordHash)) {
			return fail(401, { error: 'Incorrect password. Orders were not deleted.' });
		}

		const { count } = await prisma.order.deleteMany({});

		setAdminFlash(cookies, `${count} order${count === 1 ? '' : 's'} permanently deleted.`);
		throw redirect(303, '/shahzad-secure-admin-4db067e1/orders');
	}
};
