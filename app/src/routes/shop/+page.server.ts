import prisma from '$lib/server/prisma';
import {
	getFallbackCollections,
	getFallbackProducts,
	isDatabaseUnavailable,
	serializeStorefrontProduct,
	warnStorefrontFallback
} from '$lib/server/storefront-fallback';
import type { PageServerLoad } from './$types';

const productInclude = {
	images: { orderBy: { displayOrder: 'asc' } },
	variants: true,
	collections: true
} as const;

const SHOP_PAGE_SIZE = 8;

function requestedPageFrom(url: URL) {
	const requestedPage = Number(url.searchParams.get('page') ?? '1');

	return Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1;
}

function filtersFrom(url: URL) {
	return {
		q: String(url.searchParams.get('q') ?? '').trim(),
		category: String(
			url.searchParams.get('category') ?? url.searchParams.get('collection') ?? ''
		).trim(),
		color: String(url.searchParams.get('color') ?? '').trim(),
		size: String(url.searchParams.get('size') ?? '').trim()
	};
}

function databaseWhere(filters: ReturnType<typeof filtersFrom>) {
	const where: Record<string, any> = { isActive: true };
	const and: Record<string, any>[] = [];

	if (filters.q) {
		where.OR = [
			{ name: { contains: filters.q, mode: 'insensitive' } },
			{ slug: { contains: filters.q, mode: 'insensitive' } },
			{ description: { contains: filters.q, mode: 'insensitive' } },
			{ fabricDetails: { contains: filters.q, mode: 'insensitive' } }
		];
	}
	if (filters.category) where.collections = { some: { slug: filters.category } };
	if (filters.color) and.push({ variants: { some: { color: filters.color } } });
	if (filters.size) and.push({ variants: { some: { size: filters.size } } });
	if (and.length) where.AND = and;

	return where;
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

function buildOptions(products: any[]) {
	const colors = new Set<string>();
	const sizes = new Set<string>();

	for (const product of products) {
		for (const variant of product.variants || []) {
			if (variant.color) colors.add(variant.color);
			if (variant.size) sizes.add(variant.size);
		}
	}

	return {
		colors: Array.from(colors).sort((a, b) => a.localeCompare(b)),
		sizes: Array.from(sizes).sort((a, b) => a.localeCompare(b))
	};
}

function buildPagination(total: number, requestedPage: number) {
	const totalPages = Math.max(1, Math.ceil(total / SHOP_PAGE_SIZE));
	const page = Math.min(requestedPage, totalPages);

	return {
		page,
		pageSize: SHOP_PAGE_SIZE,
		total,
		totalPages,
		hasPrevious: page > 1,
		hasNext: page < totalPages,
		previousPage: Math.max(1, page - 1),
		nextPage: Math.min(totalPages, page + 1)
	};
}

function pageSlice(products: any[], requestedPage: number) {
	const pagination = buildPagination(products.length, requestedPage);

	return {
		pagination,
		products: products.slice(
			(pagination.page - 1) * SHOP_PAGE_SIZE,
			pagination.page * SHOP_PAGE_SIZE
		)
	};
}

export const load: PageServerLoad = async ({ url }) => {
	const filters = filtersFrom(url);
	const requestedPage = requestedPageFrom(url);

	try {
		const where = databaseWhere(filters);
		const [filteredTotal, totalProducts, optionProducts, collections] = await Promise.all([
			prisma.product.count({ where }),
			prisma.product.count({ where: { isActive: true } }),
			prisma.product.findMany({
				where: { isActive: true },
				select: { variants: { select: { color: true, size: true } } }
			}),
			prisma.collection.findMany({
				where: { isVisible: true },
				orderBy: { displayOrder: 'asc' }
			})
		]);
		const pagination = buildPagination(filteredTotal, requestedPage);
		const products = await prisma.product.findMany({
			where,
			include: productInclude,
			orderBy: { createdAt: 'desc' },
			skip: (pagination.page - 1) * SHOP_PAGE_SIZE,
			take: SHOP_PAGE_SIZE
		});
		const options = buildOptions(optionProducts);

		return {
			products: products.map(serializeStorefrontProduct),
			collections,
			colors: options.colors,
			sizes: options.sizes,
			filters,
			pagination,
			totalProducts,
			selectedCollection: filters.category
		};
	} catch (error) {
		if (!isDatabaseUnavailable(error)) {
			throw error;
		}

		warnStorefrontFallback('/shop', error);

		const allProducts = getFallbackProducts();
		const products = allProducts.filter((product) => productMatchesFilters(product, filters));
		const options = buildOptions(allProducts);
		const pagedProducts = pageSlice(products, requestedPage);

		return {
			products: pagedProducts.products,
			collections: getFallbackCollections(),
			colors: options.colors,
			sizes: options.sizes,
			filters,
			pagination: pagedProducts.pagination,
			totalProducts: allProducts.length,
			selectedCollection: filters.category
		};
	}
};
