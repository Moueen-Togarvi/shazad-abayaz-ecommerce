import prisma from '$lib/server/prisma';
import {
	getFallbackProducts,
	isDatabaseUnavailable,
	serializeStorefrontProduct,
	warnStorefrontFallback
} from '$lib/server/storefront-fallback';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const products = await prisma.product.findMany({
			where: { isActive: true },
			include: {
				images: { orderBy: { displayOrder: 'asc' } },
				collections: true
			},
			orderBy: { createdAt: 'desc' },
			take: 8
		});

		return {
			products: products.map(serializeStorefrontProduct)
		};
	} catch (error) {
		if (!isDatabaseUnavailable(error)) {
			throw error;
		}

		warnStorefrontFallback('/lookbook', error);

		return {
			products: getFallbackProducts({ take: 8 })
		};
	}
};
