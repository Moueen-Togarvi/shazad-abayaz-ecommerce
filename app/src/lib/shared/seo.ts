export const SITE_NAME = 'Abayiza';
export const SITE_BRAND = 'Abayiza Modest Atelier';
export const SITE_DESCRIPTION =
	'Shop premium Abayiza abayas for modest everyday wear, occasion styling, Eid edits, and soft nida essentials.';
export const SITE_KEYWORDS =
	'abayas, modest fashion, nida abaya, premium abayas, black abaya, eid abaya, Abayiza';
export const SITE_IMAGE = '/image.png';
export const TIKTOK_URL = 'https://www.tiktok.com/@_abayiza_';
export const PRIMARY_WHATSAPP_URL = 'https://wa.me/923116857822';
export const SECONDARY_WHATSAPP_URL = 'https://wa.me/923346657779';

export function cleanOrigin(origin: string) {
	return String(origin || '').replace(/\/+$/, '');
}

export function absoluteUrl(pathOrUrl: string | null | undefined, origin: string) {
	const value = String(pathOrUrl || '').trim();

	if (!value) return cleanOrigin(origin);
	if (/^https?:\/\//i.test(value)) return value;

	return `${cleanOrigin(origin)}${value.startsWith('/') ? value : `/${value}`}`;
}

export function metaDescription(value: string | null | undefined, fallback = SITE_DESCRIPTION) {
	const source = String(value || fallback)
		.replace(/\s+/g, ' ')
		.trim();

	return source.length > 158 ? `${source.slice(0, 155).trim()}...` : source;
}

export function jsonLdScript(data: unknown) {
	return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

export function xmlEscape(value: string | number | Date | null | undefined) {
	return String(value ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export function isoDate(value: Date | string | null | undefined) {
	const date = value ? new Date(value) : new Date();

	return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}
