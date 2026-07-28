import { env } from '$env/dynamic/private';
import { cleanOrigin } from '$lib/shared/seo';
import type { RequestHandler } from './$types';

function siteOrigin(requestOrigin: string) {
	return cleanOrigin(env.SITE_URL || env.PUBLIC_SITE_URL || env.APP_URL || requestOrigin);
}

export const GET: RequestHandler = async ({ url }) => {
	const origin = siteOrigin(url.origin);
	const body = `User-agent: *
Allow: /
Disallow: /abayiza-secure-admin-7k9x2p/
Disallow: /account
Disallow: /cart
Disallow: /checkout
Disallow: /login
Disallow: /track
Disallow: /wishlist
Disallow: /search

Sitemap: ${origin}/sitemap.xml
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
};
