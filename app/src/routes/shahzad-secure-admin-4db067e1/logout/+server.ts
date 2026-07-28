import { ADMIN_SESSION_COOKIE } from '$lib/server/admin-auth';
import { setAdminFlash } from '$lib/server/admin-flash';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }) => {
	cookies.delete(ADMIN_SESSION_COOKIE, { path: '/' });
	setAdminFlash(cookies, 'Logged out successfully.');
	throw redirect(303, '/abayiza-secure-admin-7k9x2p/login');
};
