import prisma from '$lib/server/prisma';
import {
	getFallbackCollections,
	getFallbackProducts,
	getFallbackReviewPhotos,
	isDatabaseUnavailable,
	serializeStorefrontProduct,
	warnStorefrontFallback
} from '$lib/server/storefront-fallback';
import {
	defaultStorefrontSettings,
	getPublicStorefrontSettings,
	publicStorefrontSettingsFromValues
} from '$lib/server/store-settings';
import {
	HOME_PAGE_KEY,
	HOME_SECTION_CONFIGS,
	HOME_SECTION_KEYS,
	homeSectionHref
} from '$lib/shared/home-sections';
import type { PageServerLoad } from './$types';

const productInclude = {
	images: { orderBy: { displayOrder: 'asc' } },
	variants: true,
	collections: true
} as const;

const buildHomeSections = (
	fallbackProducts: any[],
	fallbackTotal: number,
	selectedProductsBySection = new Map<string, any[]>()
) =>
	Object.fromEntries(
		HOME_SECTION_CONFIGS.map((section) => {
			const selectedProducts = selectedProductsBySection.get(section.key) ?? [];
			const sourceProducts = selectedProducts.length ? selectedProducts : fallbackProducts;
			const total = selectedProducts.length ? selectedProducts.length : fallbackTotal;

			return [
				section.key,
				{
					...section,
					products: sourceProducts.slice(0, section.homepageLimit),
					total,
					viewAllHref: homeSectionHref(section.key),
					usesFallback: selectedProducts.length === 0
				}
			];
		})
	);

export const load: PageServerLoad = async () => {
	try {
		const storefrontSectionProduct = (prisma as any).storefrontSectionProduct;
		const [products, productCount, collections, reviewPhotos, placements, storefrontSettings] =
			await Promise.all([
				prisma.product.findMany({
					where: { isActive: true },
					include: productInclude,
					orderBy: { createdAt: 'desc' },
					take: 12
				}),
				prisma.product.count({ where: { isActive: true } }),
				prisma.collection.findMany({
					where: { isVisible: true },
					orderBy: { displayOrder: 'asc' },
					include: {
						_count: {
							select: { products: true }
						}
					}
				}),
				prisma.reviewPhoto.findMany({
					where: { isVisible: true },
					orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }]
				}),
				storefrontSectionProduct?.findMany
					? storefrontSectionProduct.findMany({
							where: {
								pageKey: HOME_PAGE_KEY,
								sectionKey: { in: [...HOME_SECTION_KEYS] },
								product: { isActive: true }
							},
							include: {
								product: {
									include: productInclude
								}
							},
							orderBy: [{ sectionKey: 'asc' }, { displayOrder: 'asc' }, { createdAt: 'asc' }]
						})
					: Promise.resolve([]),
				getPublicStorefrontSettings()
			]);

		const serializedProducts = products.map(serializeStorefrontProduct);
		const selectedProductsBySection = new Map<string, any[]>();

		for (const placement of placements) {
			const selectedProducts = selectedProductsBySection.get(placement.sectionKey) ?? [];
			selectedProducts.push(serializeStorefrontProduct(placement.product));
			selectedProductsBySection.set(placement.sectionKey, selectedProducts);
		}

		return {
			products: serializedProducts,
			homeSections: buildHomeSections(serializedProducts, productCount, selectedProductsBySection),
			collections,
			reviewPhotos: reviewPhotos.map((photo) => ({
				id: photo.id,
				url: photo.url
			})),
			storefrontSettings
		};
	} catch (error) {
		if (!isDatabaseUnavailable(error)) {
			throw error;
		}

		warnStorefrontFallback('/', error);

		const fallbackProducts = getFallbackProducts();

		return {
			products: fallbackProducts.slice(0, 12),
			homeSections: buildHomeSections(fallbackProducts, fallbackProducts.length),
			collections: getFallbackCollections(),
			reviewPhotos: getFallbackReviewPhotos(),
			storefrontSettings: publicStorefrontSettingsFromValues(defaultStorefrontSettings)
		};
	}
};
