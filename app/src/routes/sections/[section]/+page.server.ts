import prisma from '$lib/server/prisma';
import {
	getFallbackProducts,
	isDatabaseUnavailable,
	serializeStorefrontProduct,
	warnStorefrontFallback
} from '$lib/server/storefront-fallback';
import {
	HOME_PAGE_KEY,
	HOME_SECTION_PAGE_SIZE,
	getHomeSectionConfig,
	homeSectionHref
} from '$lib/shared/home-sections';
import { error as kitError } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const productInclude = {
	images: { orderBy: { displayOrder: 'asc' } },
	variants: true,
	collections: true
} as const;

function requestedPageFrom(url: URL) {
	const requestedPage = Number(url.searchParams.get('page') ?? '1');

	return Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1;
}

function filtersFrom(url: URL) {
	return {
		q: String(url.searchParams.get('q') ?? '').trim(),
		category: String(url.searchParams.get('category') ?? '').trim(),
		color: String(url.searchParams.get('color') ?? '').trim(),
		size: String(url.searchParams.get('size') ?? '').trim()
	};
}

function buildPagination(total: number, requestedPage: number) {
	const totalPages = Math.max(1, Math.ceil(total / HOME_SECTION_PAGE_SIZE));
	const page = Math.min(requestedPage, totalPages);

	return {
		page,
		pageSize: HOME_SECTION_PAGE_SIZE,
		total,
		totalPages,
		hasPrevious: page > 1,
		hasNext: page < totalPages,
		previousPage: Math.max(1, page - 1),
		nextPage: Math.min(totalPages, page + 1)
	};
}

function productMatchesFilters(product: any, filters: ReturnType<typeof filtersFrom>) {
	const query = filters.q.toLowerCase();
	const matchesQuery =
		!query ||
		[product.name, product.slug, product.description, product.fabricDetails]
			.filter(Boolean)
			.some((value) => String(value).toLowerCase().includes(query));
	const matchesCategory =
		!filters.category ||
		product.collections?.some((collection: any) => collection.slug === filters.category);
	const matchesColor =
		!filters.color || product.variants?.some((variant: any) => variant.color === filters.color);
	const matchesSize =
		!filters.size || product.variants?.some((variant: any) => variant.size === filters.size);

	return matchesQuery && matchesCategory && matchesColor && matchesSize;
}

function buildFilterOptions(products: any[]) {
	const categoryMap = new Map<string, string>();
	const colors = new Set<string>();
	const sizes = new Set<string>();

	for (const product of products) {
		for (const collection of product.collections || []) {
			if (collection.slug && collection.name) {
				categoryMap.set(collection.slug, collection.name);
			}
		}

		for (const variant of product.variants || []) {
			if (variant.color) colors.add(variant.color);
			if (variant.size) sizes.add(variant.size);
		}
	}

	return {
		categories: Array.from(categoryMap.entries())
			.map(([slug, name]) => ({ slug, name }))
			.sort((a, b) => a.name.localeCompare(b.name)),
		colors: Array.from(colors).sort((a, b) => a.localeCompare(b)),
		sizes: Array.from(sizes).sort((a, b) => a.localeCompare(b))
	};
}

function pageSlice(products: any[], requestedPage: number) {
	const pagination = buildPagination(products.length, requestedPage);

	return {
		pagination,
		products: products.slice(
			(pagination.page - 1) * HOME_SECTION_PAGE_SIZE,
			pagination.page * HOME_SECTION_PAGE_SIZE
		)
	};
}

export const load: PageServerLoad = async ({ params, url }) => {
	const section = getHomeSectionConfig(params.section);

	if (!section) {
		throw kitError(404, 'Section not found');
	}

	const requestedPage = requestedPageFrom(url);
	const filters = filtersFrom(url);

	try {
		const storefrontSectionProduct = (prisma as any).storefrontSectionProduct;
		const selectedPlacements = storefrontSectionProduct?.findMany
			? await storefrontSectionProduct.findMany({
					where: {
						pageKey: HOME_PAGE_KEY,
						sectionKey: section.key,
						product: { isActive: true }
					},
					include: {
						product: {
							include: productInclude
						}
					},
					orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }]
				})
			: [];
		const selectedProducts = selectedPlacements.map((placement: any) =>
			serializeStorefrontProduct(placement.product)
		);

		if (selectedProducts.length > 0) {
			const filteredProducts = selectedProducts.filter((product: any) =>
				productMatchesFilters(product, filters)
			);
			const { products, pagination } = pageSlice(filteredProducts, requestedPage);

			return {
				section: {
					...section,
					href: homeSectionHref(section.key)
				},
				products,
				pagination,
				filters,
				filterOptions: buildFilterOptions(selectedProducts),
				usesFallback: false
			};
		}

		const allProducts = (
			await prisma.product.findMany({
				where: { isActive: true },
				include: productInclude,
				orderBy: { createdAt: 'desc' }
			})
		).map(serializeStorefrontProduct);
		const filteredProducts = allProducts.filter((product: any) =>
			productMatchesFilters(product, filters)
		);
		const { products, pagination } = pageSlice(filteredProducts, requestedPage);

		return {
			section: {
				...section,
				href: homeSectionHref(section.key)
			},
			products,
			pagination,
			filters,
			filterOptions: buildFilterOptions(allProducts),
			usesFallback: true
		};
	} catch (error) {
		if (!isDatabaseUnavailable(error)) {
			throw error;
		}

		warnStorefrontFallback(homeSectionHref(section.key), error);

		const fallbackProducts = getFallbackProducts();
		const filteredProducts = fallbackProducts.filter((product) =>
			productMatchesFilters(product, filters)
		);
		const { products, pagination } = pageSlice(filteredProducts, requestedPage);

		return {
			section: {
				...section,
				href: homeSectionHref(section.key)
			},
			products,
			pagination,
			filters,
			filterOptions: buildFilterOptions(fallbackProducts),
			usesFallback: true
		};
	}
};
