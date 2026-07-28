import { env } from '$env/dynamic/private';
import type { Cookies } from '@sveltejs/kit';

export type AdminFlashType = 'success' | 'error' | 'info';

export type AdminFlash = {
	type: AdminFlashType;
	message: string;
};

const ADMIN_FLASH_COOKIE = 'abayiza_admin_flash';

const flashCookieOptions = () => ({
	path: '/abayiza-secure-admin-7k9x2p',
	httpOnly: true,
	sameSite: 'lax' as const,
	secure: env.NODE_ENV === 'production',
	maxAge: 60
});

export const setAdminFlash = (
	cookies: Cookies,
	message: string,
	type: AdminFlashType = 'success'
) => {
	const payload = Buffer.from(JSON.stringify({ type, message })).toString('base64url');
	cookies.set(ADMIN_FLASH_COOKIE, payload, flashCookieOptions());
};

export const consumeAdminFlash = (cookies: Cookies): AdminFlash | null => {
	const raw = cookies.get(ADMIN_FLASH_COOKIE);
	if (!raw) return null;

	cookies.delete(ADMIN_FLASH_COOKIE, { path: '/abayiza-secure-admin-7k9x2p' });

	try {
		const flash = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8')) as Partial<AdminFlash>;
		const type = flash.type === 'error' || flash.type === 'info' ? flash.type : 'success';
		const message = String(flash.message || '').trim();

		if (!message) return null;
		return { type, message };
	} catch {
		return null;
	}
};
