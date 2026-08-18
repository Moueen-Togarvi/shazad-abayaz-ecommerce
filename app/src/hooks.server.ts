import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '$lib/server/admin-auth';
import { env } from '$env/dynamic/private';
import { redirect, type Handle } from '@sveltejs/kit';

const PRIVATE_PATHS = [
	'/account',
	'/cart',
	'/checkout',
	'/login',
	'/register',
	'/track',
	'/wishlist',
	'/shahzad-secure-admin-4db067e1'
];

const isPrivatePath = (pathname: string) =>
	PRIVATE_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

export const handle: Handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname;
	const isAdminRoute = pathname.startsWith('/shahzad-secure-admin-4db067e1');
	const isAdminAuthRoute =
		pathname === '/shahzad-secure-admin-4db067e1/login' ||
		pathname === '/shahzad-secure-admin-4db067e1/logout';

	if (isAdminRoute) {
		event.locals.adminUser = await verifyAdminSessionToken(event.cookies.get(ADMIN_SESSION_COOKIE));

		if (!event.locals.adminUser && !isAdminAuthRoute) {
			throw redirect(
				303,
				`/shahzad-secure-admin-4db067e1/login?redirectTo=${encodeURIComponent(pathname + event.url.search)}`
			);
		}

		if (event.locals.adminUser && pathname === '/shahzad-secure-admin-4db067e1/login') {
			throw redirect(303, '/shahzad-secure-admin-4db067e1');
		}
	}

	const response = await resolve(event);

	if (isAdminRoute || isPrivatePath(pathname)) {
		response.headers.set('cache-control', 'no-store, max-age=0');
	}

	response.headers.set('x-content-type-options', 'nosniff');
	response.headers.set('x-frame-options', 'DENY');
	response.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
	response.headers.set('permissions-policy', 'camera=(), microphone=(), geolocation=()');
	response.headers.set(
		'content-security-policy',
		"base-uri 'self'; frame-ancestors 'none'; form-action 'self'"
	);

	if (env.NODE_ENV === 'production' && event.url.protocol === 'https:') {
		response.headers.set('strict-transport-security', 'max-age=31536000; includeSubDomains');
	}

	return response;
};
