import {
	ADMIN_SESSION_COOKIE,
	createAdminSessionToken,
	getAdminSessionCookieOptions,
	hashPassword,
	isAdminRole,
	verifyPassword
} from '$lib/server/admin-auth';
import { setAdminFlash } from '$lib/server/admin-flash';
import prisma from '$lib/server/prisma';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => ({
	redirectTo: url.searchParams.get('redirectTo') || '/shahzad-secure-admin-4db067e1'
});

export const actions: Actions = {
	login: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const email = String(data.get('email') || '')
			.trim()
			.toLowerCase();
		const password = String(data.get('password') || '');
		const redirectTo = String(
			data.get('redirectTo') || url.searchParams.get('redirectTo') || '/shahzad-secure-admin-4db067e1'
		);

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required.', email, redirectTo });
		}

		const user = await prisma.user.findUnique({ where: { email } });

		if (!user || user.isBlocked || !isAdminRole(user.role)) {
			return fail(401, { error: 'Admin access denied.', email, redirectTo });
		}

		if (!user.passwordHash) {
			await prisma.user.update({
				where: { id: user.id },
				data: { passwordHash: hashPassword(password) }
			});
		} else if (!verifyPassword(password, user.passwordHash)) {
			return fail(401, { error: 'Invalid email or password.', email, redirectTo });
		}

		cookies.set(
			ADMIN_SESSION_COOKIE,
			createAdminSessionToken({ id: user.id, role: user.role }),
			getAdminSessionCookieOptions()
		);
		setAdminFlash(cookies, 'Logged in successfully.');

		throw redirect(
			303,
			redirectTo.startsWith('/shahzad-secure-admin-4db067e1')
				? redirectTo
				: '/shahzad-secure-admin-4db067e1'
		);
	}
};
