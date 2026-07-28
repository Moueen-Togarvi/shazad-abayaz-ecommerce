import { hashPassword, isSuperAdmin } from '$lib/server/admin-auth';
import { setAdminFlash } from '$lib/server/admin-flash';
import prisma from '$lib/server/prisma';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const roles = ['CUSTOMER', 'EDITOR', 'SUPER_ADMIN'];
const getText = (data: FormData, key: string) => String(data.get(key) ?? '').trim();

const requireSuperAdmin = (locals: App.Locals) => {
	if (!isSuperAdmin(locals.adminUser?.role)) {
		return fail(403, { error: 'Only a super admin can manage users.' });
	}
	return null;
};

export const load: PageServerLoad = async ({ url, locals }) => {
	const q = url.searchParams.get('q')?.trim() || '';
	const role = url.searchParams.get('role')?.trim() || '';

	const users = await prisma.user.findMany({
		where: {
			AND: [
				q
					? {
							OR: [
								{ email: { contains: q, mode: 'insensitive' } },
								{ firstName: { contains: q, mode: 'insensitive' } },
								{ lastName: { contains: q, mode: 'insensitive' } }
							]
						}
					: {},
				roles.includes(role) ? { role: role as any } : {}
			]
		},
		include: {
			_count: {
				select: { orders: true }
			}
		},
		orderBy: { createdAt: 'desc' }
	});

	return {
		users: users.map((user) => ({
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			role: user.role,
			isBlocked: user.isBlocked,
			hasPassword: Boolean(user.passwordHash),
			orderCount: user._count.orders,
			createdAt: user.createdAt.toISOString(),
			isCurrentUser: user.id === locals.adminUser?.id
		})),
		filters: { q, role },
		currentAdminRole: locals.adminUser?.role
	};
};

export const actions: Actions = {
	create: async ({ request, locals, cookies }) => {
		const permission = requireSuperAdmin(locals);
		if (permission) return permission;

		const data = await request.formData();
		const email = getText(data, 'email').toLowerCase();
		const firstName = getText(data, 'firstName');
		const lastName = getText(data, 'lastName');
		const role = getText(data, 'role');
		const password = String(data.get('password') ?? '');
		const isBlocked = data.get('isBlocked') === 'on';

		if (!email || !roles.includes(role)) {
			return fail(400, { error: 'Email and valid role are required.' });
		}

		if (password && password.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters.' });
		}

		try {
			await prisma.user.create({
				data: {
					email,
					firstName: firstName || null,
					lastName: lastName || null,
					role: role as any,
					isBlocked,
					passwordHash: password ? hashPassword(password) : null
				}
			});
		} catch {
			return fail(400, { error: 'User could not be created. Email may already exist.' });
		}

		setAdminFlash(cookies, 'User added successfully.');
		throw redirect(303, '/abayiza-secure-admin-7k9x2p/users');
	},

	update: async ({ request, locals, cookies }) => {
		const permission = requireSuperAdmin(locals);
		if (permission) return permission;

		const data = await request.formData();
		const id = getText(data, 'id');
		const firstName = getText(data, 'firstName');
		const lastName = getText(data, 'lastName');
		const role = getText(data, 'role');
		const password = String(data.get('password') ?? '');
		const isBlocked = data.get('isBlocked') === 'on';

		if (!id || !roles.includes(role)) {
			return fail(400, { error: 'User and valid role are required.' });
		}

		if (password && password.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters.' });
		}

		if (id === locals.adminUser?.id && (isBlocked || role !== 'SUPER_ADMIN')) {
			return fail(400, { error: 'You cannot block or demote your own admin account.' });
		}

		await prisma.user.update({
			where: { id },
			data: {
				firstName: firstName || null,
				lastName: lastName || null,
				role: role as any,
				isBlocked,
				...(password ? { passwordHash: hashPassword(password) } : {})
			}
		});

		setAdminFlash(cookies, 'User updated successfully.');
		throw redirect(303, '/abayiza-secure-admin-7k9x2p/users');
	},

	delete: async ({ request, locals, cookies }) => {
		const permission = requireSuperAdmin(locals);
		if (permission) return permission;

		const data = await request.formData();
		const id = getText(data, 'id');

		if (!id) return fail(400, { error: 'User was not found.' });
		if (id === locals.adminUser?.id)
			return fail(400, { error: 'You cannot delete your own account.' });

		try {
			await prisma.user.delete({ where: { id } });
		} catch {
			return fail(400, { error: 'User could not be deleted.' });
		}

		setAdminFlash(cookies, 'User deleted successfully.');
		throw redirect(303, '/abayiza-secure-admin-7k9x2p/users');
	}
};
