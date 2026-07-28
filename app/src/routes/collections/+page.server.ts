import prisma from '$lib/server/prisma';
import {
	getFallbackCollections,
	isDatabaseUnavailable,
	warnStorefrontFallback
} from '$lib/server/storefront-fallback';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const collections = await prisma.collection.findMany({
			where: { isVisible: true },
			orderBy: { name: 'asc' },
			include: {
				_count: {
					select: { products: true }
				}
			}
		});

		return {
			collections
		};
	} catch (error) {
		if (!isDatabaseUnavailable(error)) {
			throw error;
		}

		warnStorefrontFallback('/collections', error);

		return {
			collections: getFallbackCollections({ sortByName: true })
		};
	}
};
