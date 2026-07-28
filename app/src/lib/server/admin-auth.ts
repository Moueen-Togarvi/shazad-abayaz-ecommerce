import { env } from '$env/dynamic/private';
import prisma from '$lib/server/prisma';
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

export const ADMIN_SESSION_COOKIE = 'abayiza_admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const sessionSecret = () =>
	env.ADMIN_SESSION_SECRET || env.AUTH_SECRET || env.DATABASE_URL || 'abayiza-local-admin-secret';

const sign = (payload: string) =>
	createHmac('sha256', sessionSecret()).update(payload).digest('base64url');

export const hashPassword = (password: string) => {
	const salt = randomBytes(16).toString('base64url');
	const hash = scryptSync(password, salt, 64).toString('base64url');
	return `scrypt$${salt}$${hash}`;
};

export const verifyPassword = (password: string, storedHash: string | null | undefined) => {
	if (!storedHash?.startsWith('scrypt$')) return false;

	const [, salt, hash] = storedHash.split('$');
	if (!salt || !hash) return false;

	const candidate = scryptSync(password, salt, 64);
	const expected = Buffer.from(hash, 'base64url');

	return candidate.length === expected.length && timingSafeEqual(candidate, expected);
};

export const createAdminSessionToken = (user: { id: string; role: string }) => {
	const payload = JSON.stringify({
		userId: user.id,
		role: user.role,
		exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE
	});
	const encodedPayload = Buffer.from(payload).toString('base64url');
	return `${encodedPayload}.${sign(encodedPayload)}`;
};

export const getAdminSessionCookieOptions = () => ({
	path: '/',
	httpOnly: true,
	sameSite: 'lax' as const,
	secure: env.NODE_ENV === 'production',
	maxAge: SESSION_MAX_AGE
});

export const verifyAdminSessionToken = async (token: string | undefined) => {
	if (!token) return null;

	const [encodedPayload, signature] = token.split('.');
	if (!encodedPayload || !signature || sign(encodedPayload) !== signature) return null;

	let payload: { userId?: string; role?: string; exp?: number };
	try {
		payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
	} catch {
		return null;
	}

	if (!payload.userId || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;

	const user = await prisma.user.findUnique({
		where: { id: payload.userId },
		select: {
			id: true,
			email: true,
			firstName: true,
			lastName: true,
			role: true,
			isBlocked: true
		}
	});

	if (!user || user.isBlocked || !['EDITOR', 'SUPER_ADMIN'].includes(user.role)) return null;

	return user;
};

export const isAdminRole = (role: string | null | undefined) =>
	role === 'EDITOR' || role === 'SUPER_ADMIN';

export const isSuperAdmin = (role: string | null | undefined) => role === 'SUPER_ADMIN';
