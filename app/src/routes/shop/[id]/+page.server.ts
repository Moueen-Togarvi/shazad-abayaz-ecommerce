import prisma from '$lib/server/prisma';
import {
	getFallbackProduct,
	getFallbackProducts,
	isDatabaseUnavailable,
	serializeStorefrontProduct,
	warnStorefrontFallback
} from '$lib/server/storefront-fallback';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const product = await prisma.product.findUnique({
			where: { slug: params.id },
			include: {
				images: { orderBy: { displayOrder: 'asc' } },
				variants: true,
				collections: true
			}
		});

		if (!product || !product.isActive) {
			throw error(404, 'Product not found');
		}

		const relatedProducts = await prisma.product.findMany({
			where: {
				isActive: true,
				id: { not: product.id },
				collections: {
					some: {
						id: { in: product.collections.map((collection: any) => collection.id) }
					}
				}
			},
			include: {
				images: { orderBy: { displayOrder: 'asc' } },
				variants: true,
				collections: true
			},
			take: 4
		});

		return {
			product: serializeStorefrontProduct(product),
			relatedProducts: relatedProducts.map(serializeStorefrontProduct)
		};
	} catch (error_) {
		if (!isDatabaseUnavailable(error_)) {
			throw error_;
		}

		warnStorefrontFallback(`/shop/${params.id}`, error_);

		const product = getFallbackProduct(params.id);

		if (!product) {
			throw error(404, 'Product not found');
		}

		return {
			product,
			relatedProducts: getFallbackProducts({
				excludeId: product.id,
				matchingCollectionIds: product.collections.map((collection) => collection.id),
				take: 4
			})
		};
	}
};
