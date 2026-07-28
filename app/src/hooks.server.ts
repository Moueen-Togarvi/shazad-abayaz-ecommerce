import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '$lib/server/admin-auth';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname;
	const isAdminRoute = pathname.startsWith('/abayiza-secure-admin-7k9x2p');
	const isAdminAuthRoute =
		pathname === '/abayiza-secure-admin-7k9x2p/login' ||
		pathname === '/abayiza-secure-admin-7k9x2p/logout';

	if (isAdminRoute) {
		event.locals.adminUser = await verifyAdminSessionToken(event.cookies.get(ADMIN_SESSION_COOKIE));

		if (!event.locals.adminUser && !isAdminAuthRoute) {
			throw redirect(
				303,
				`/abayiza-secure-admin-7k9x2p/login?redirectTo=${encodeURIComponent(pathname + event.url.search)}`
			);
		}

		if (event.locals.adminUser && pathname === '/abayiza-secure-admin-7k9x2p/login') {
			throw redirect(303, '/abayiza-secure-admin-7k9x2p');
		}
	}

	const response = await resolve(event);

	if (isAdminRoute) {
		response.headers.set('cache-control', 'no-store, max-age=0');
	}

	return response;
};
