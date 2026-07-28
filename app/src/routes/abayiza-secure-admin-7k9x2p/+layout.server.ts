import { consumeAdminFlash } from '$lib/server/admin-flash';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies }) => ({
	adminUser: locals.adminUser,
	flash: consumeAdminFlash(cookies)
});
