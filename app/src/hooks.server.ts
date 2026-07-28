import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '$lib/server/admin-auth';
import { redirect, type Handle } from '@sveltejs/kit';

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

	if (isAdminRoute) {
		response.headers.set('cache-control', 'no-store, max-age=0');
	}

	return response;
};
