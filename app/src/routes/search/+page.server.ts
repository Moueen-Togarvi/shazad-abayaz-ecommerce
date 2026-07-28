import prisma from '$lib/server/prisma';
import {
	getFallbackCollections,
	isDatabaseUnavailable,
	searchFallbackProducts,
	serializeStorefrontProduct,
	warnStorefrontFallback
} from '$lib/server/storefront-fallback';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const query = url.searchParams.get('q')?.trim() ?? '';

	try {
		const products =
			query.length >= 2
				? await prisma.product.findMany({
						where: {
							isActive: true,
							OR: [
								{ name: { contains: query, mode: 'insensitive' } },
								{ description: { contains: query, mode: 'insensitive' } },
								{
									collections: {
										some: { name: { contains: query, mode: 'insensitive' } }
									}
								}
							]
						},
						include: {
							images: { orderBy: { displayOrder: 'asc' } },
							collections: true,
							variants: true
						},
						orderBy: { createdAt: 'desc' }
					})
				: [];

		const collections = await prisma.collection.findMany({
			where: { isVisible: true },
			orderBy: { displayOrder: 'asc' },
			take: 8
		});

		return {
			query,
			products: products.map(serializeStorefrontProduct),
			collections
		};
	} catch (error) {
		if (!isDatabaseUnavailable(error)) {
			throw error;
		}

		warnStorefrontFallback('/search', error);

		return {
			query,
			products: searchFallbackProducts(query),
			collections: getFallbackCollections({ take: 8 })
		};
	}
};
