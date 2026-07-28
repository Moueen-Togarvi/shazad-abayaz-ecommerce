import { env } from '$env/dynamic/private';
import prisma from '$lib/server/prisma';
import {
	getFallbackProducts,
	isDatabaseUnavailable,
	warnStorefrontFallback
} from '$lib/server/storefront-fallback';
import { HOME_SECTION_CONFIGS, homeSectionHref } from '$lib/shared/home-sections';
import { absoluteUrl, cleanOrigin, isoDate, xmlEscape } from '$lib/shared/seo';
import type { RequestHandler } from './$types';

type SitemapImage = {
	loc: string;
	title?: string | null;
};

type SitemapEntry = {
	loc: string;
	lastmod?: Date | string | null;
	changefreq?: 'daily' | 'weekly' | 'monthly' | 'yearly';
	priority?: string;
	images?: SitemapImage[];
};

const staticEntries: SitemapEntry[] = [
	{ loc: '/', changefreq: 'daily', priority: '1.0' },
	{ loc: '/shop', changefreq: 'daily', priority: '0.95' },
	{ loc: '/collections', changefreq: 'weekly', priority: '0.8' },
	{ loc: '/about', changefreq: 'monthly', priority: '0.7' },
	{ loc: '/contact', changefreq: 'monthly', priority: '0.55' },
	{ loc: '/size-guide', changefreq: 'monthly', priority: '0.65' },
	{ loc: '/lookbook', changefreq: 'weekly', priority: '0.7' },
	{ loc: '/policies/shipping', changefreq: 'monthly', priority: '0.35' },
	{ loc: '/policies/returns', changefreq: 'monthly', priority: '0.35' },
	{ loc: '/policies/privacy', changefreq: 'yearly', priority: '0.25' },
	{ loc: '/policies/terms', changefreq: 'yearly', priority: '0.25' },
	...HOME_SECTION_CONFIGS.map((section) => ({
		loc: homeSectionHref(section.key),
		changefreq: 'weekly' as const,
		priority: '0.82'
	}))
];

function siteOrigin(requestOrigin: string) {
	return cleanOrigin(env.SITE_URL || env.PUBLIC_SITE_URL || env.APP_URL || requestOrigin);
}

function renderUrl(entry: SitemapEntry, origin: string) {
	const imageXml = (entry.images || [])
		.filter((image) => image.loc)
		.map(
			(image) => `<image:image>
		<image:loc>${xmlEscape(absoluteUrl(image.loc, origin))}</image:loc>
		${image.title ? `<image:title>${xmlEscape(image.title)}</image:title>` : ''}
	</image:image>`
		)
		.join('');

	return `<url>
	<loc>${xmlEscape(absoluteUrl(entry.loc, origin))}</loc>
	${entry.lastmod ? `<lastmod>${xmlEscape(isoDate(entry.lastmod))}</lastmod>` : ''}
	${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ''}
	${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
	${imageXml}
</url>`;
}

async function productEntries(origin: string): Promise<SitemapEntry[]> {
	try {
		const products = await prisma.product.findMany({
			where: { isActive: true },
			select: {
				slug: true,
				name: true,
				updatedAt: true,
				images: {
					orderBy: { displayOrder: 'asc' },
					select: {
						url: true,
						altText: true
					}
				}
			},
			orderBy: { updatedAt: 'desc' }
		});

		return products.map((product) => ({
			loc: `/shop/${product.slug}`,
			lastmod: product.updatedAt,
			changefreq: 'weekly',
			priority: '0.9',
			images: product.images.map((image) => ({
				loc: absoluteUrl(image.url, origin),
				title: image.altText || product.name
			}))
		}));
	} catch (error) {
		if (!isDatabaseUnavailable(error)) {
			throw error;
		}

		warnStorefrontFallback('/sitemap.xml', error);

		return getFallbackProducts().map((product) => ({
			loc: `/shop/${product.slug}`,
			lastmod: new Date(),
			changefreq: 'weekly',
			priority: '0.9',
			images: product.images.map((image) => ({
				loc: absoluteUrl(image.url, origin),
				title: image.altText || product.name
			}))
		}));
	}
}

export const GET: RequestHandler = async ({ url }) => {
	const origin = siteOrigin(url.origin);
	const entries = [...staticEntries, ...(await productEntries(origin))];
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.map((entry) => renderUrl(entry, origin)).join('\n')}
</urlset>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
};
