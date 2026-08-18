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

const ADMIN_ROOT = '/shahzad-secure-admin-4db067e1';
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const DUMMY_PASSWORD_HASH = hashPassword('invalid-admin-password-placeholder');
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

const safeRedirectTo = (value: string) =>
	value === ADMIN_ROOT || value.startsWith(`${ADMIN_ROOT}/`) ? value : ADMIN_ROOT;

const rateLimitKey = (ip: string) => ip;

const isRateLimited = (key: string) => {
	const now = Date.now();
	const attempt = loginAttempts.get(key);
	if (!attempt || attempt.resetAt <= now) {
		loginAttempts.delete(key);
		return false;
	}
	return attempt.count >= MAX_LOGIN_ATTEMPTS;
};

const recordFailedLogin = (key: string) => {
	const now = Date.now();
	const attempt = loginAttempts.get(key);
	if (!attempt || attempt.resetAt <= now) {
		loginAttempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
	} else {
		attempt.count += 1;
	}

	if (loginAttempts.size > 5_000) {
		for (const [storedKey, storedAttempt] of loginAttempts) {
			if (storedAttempt.resetAt <= now) loginAttempts.delete(storedKey);
		}
	}
};

export const load: PageServerLoad = async ({ url }) => ({
	redirectTo: safeRedirectTo(url.searchParams.get('redirectTo') || ADMIN_ROOT)
});

export const actions: Actions = {
	login: async ({ request, cookies, url, getClientAddress }) => {
		const data = await request.formData();
		const email = String(data.get('email') || '')
			.trim()
			.toLowerCase();
		const password = String(data.get('password') || '');
		const redirectTo = safeRedirectTo(
			String(data.get('redirectTo') || url.searchParams.get('redirectTo') || ADMIN_ROOT)
		);
		const attemptKey = rateLimitKey(getClientAddress());

		if (!email || email.length > 254 || !password || password.length > 256) {
			return fail(400, { error: 'Email and password are required.', email, redirectTo });
		}

		if (isRateLimited(attemptKey)) {
			return fail(429, {
				error: 'Too many login attempts. Please try again in 15 minutes.',
				email,
				redirectTo
			});
		}

		const user = await prisma.user.findUnique({ where: { email } });
		const passwordMatches = verifyPassword(password, user?.passwordHash || DUMMY_PASSWORD_HASH);

		if (
			!user ||
			user.isBlocked ||
			!isAdminRole(user.role) ||
			!passwordMatches
		) {
			recordFailedLogin(attemptKey);
			return fail(401, { error: 'Invalid email or password.', email, redirectTo });
		}
		loginAttempts.delete(attemptKey);

		cookies.set(
			ADMIN_SESSION_COOKIE,
			createAdminSessionToken({ id: user.id, role: user.role }),
			getAdminSessionCookieOptions()
		);
		setAdminFlash(cookies, 'Logged in successfully.');

		throw redirect(303, redirectTo);
	}
};
