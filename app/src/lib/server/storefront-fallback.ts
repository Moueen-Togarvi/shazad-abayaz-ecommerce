type StorefrontCollectionBase = {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	imageUrl: string | null;
	isVisible: boolean;
	displayOrder: number;
};

type StorefrontCollection = StorefrontCollectionBase & {
	_count?: {
		products: number;
	};
};

type StorefrontImage = {
	id: string;
	url: string;
	altText: string | null;
	displayOrder: number;
};

type StorefrontVariant = {
	id: string;
	color: string;
	size: string;
	stockCount: number;
	sku: string;
};

export type StorefrontProduct = {
	id: string;
	name: string;
	slug: string;
	description: string;
	fabricDetails: string | null;
	price: number;
	salePrice: number | null;
	metaTitle: string | null;
	metaDescription: string | null;
	isActive: boolean;
	images: StorefrontImage[];
	variants: StorefrontVariant[];
	collections: StorefrontCollection[];
};

type FallbackProductOptions = {
	collectionSlug?: string | null;
	excludeId?: string;
	matchingCollectionIds?: string[];
	take?: number;
};

const fallbackCollectionSeed: StorefrontCollectionBase[] = [
	{
		id: 'fallback-collection-nida-essentials',
		name: 'Nida Essentials',
		slug: 'nida-essentials',
		description: null,
		imageUrl: '/ChatGPT%20Image%20May%2025,%202026,%2006_25_42%20PM.png',
		isVisible: true,
		displayOrder: 0
	},
	{
		id: 'fallback-collection-occasion',
		name: 'Occasion',
		slug: 'occasion',
		description: null,
		imageUrl: '/abaya22.png',
		isVisible: true,
		displayOrder: 1
	},
	{
		id: 'fallback-collection-daily-wear',
		name: 'Daily Wear',
		slug: 'daily-wear',
		description: null,
		imageUrl: '/abaya11.png',
		isVisible: true,
		displayOrder: 2
	},
	{
		id: 'fallback-collection-premium-nida',
		name: 'Premium Nida',
		slug: 'premium-nida',
		description: null,
		imageUrl: '/ChatGPT%20Image%20May%2025,%202026,%2006_25_42%20PM.png',
		isVisible: true,
		displayOrder: 3
	},
	{
		id: 'fallback-collection-eid-edit',
		name: 'Eid Edit',
		slug: 'eid-edit',
		description: null,
		imageUrl: '/ChatGPT%20Image%20May%2025,%202026,%2006_25_51%20PM.png',
		isVisible: true,
		displayOrder: 4
	}
];

const fallbackDemoNames = [
	'Haya Soft Nida Abaya',
	'Noor Everyday Abaya',
	'Zahra Layered Abaya',
	'Amani Front Open Abaya',
	'Layla Occasion Abaya',
	'Safa Premium Nida Abaya',
	'Maryam Pleated Abaya',
	'Rida Classic Black Abaya',
	'Mina Flow Abaya',
	'Amal Pearl Sleeve Abaya',
	'Yasmin Minimal Abaya',
	'Sahar Chiffon Layer Abaya',
	'Inaya Daily Abaya',
	'Noura Eid Abaya',
	'Areeba Button Abaya',
	'Meher Modest Abaya',
	'Zoya Bell Sleeve Abaya',
	'Hiba Soft Drape Abaya',
	'Maira Essential Abaya',
	'Aleena Wrap Abaya',
	'Dua Midnight Abaya',
	'Iqra Luxe Abaya',
	'Reem Everyday Abaya',
	'Saira Cloud Nida Abaya',
	'Hoor Occasion Layer Abaya',
	'Anaya Signature Abaya',
	'Fiza Travel Abaya',
	'Javeria Grace Abaya',
	'Kiran Soft Fall Abaya',
	'Lina Premium Black Abaya'
];

const fallbackDemoImages = [
	'/abaya11.png',
	'/abaya22.png',
	'/ChatGPT%20Image%20May%2025,%202026,%2006_25_42%20PM.png',
	'/ChatGPT%20Image%20May%2025,%202026,%2006_25_51%20PM.png',
	'/ChatGPT%20Image%20May%2025,%202026,%2006_25_13%20PM.png',
	'/ChatGPT%20Image%20May%2025,%202026,%2006_07_28%20PM.png',
	'/ChatGPT%20Image%20May%2025,%202026,%2006_25_25%20PM.png'
];

const fallbackDemoColors = ['Black', 'Emerald', 'Sage', 'Ivory', 'Navy', 'Charcoal', 'Olive'];

function slugifyFallback(value: string) {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

function createFallbackDemoProducts(): StorefrontProduct[] {
	return fallbackDemoNames.map((name, index) => {
		const number = String(index + 1).padStart(2, '0');
		const color = fallbackDemoColors[index % fallbackDemoColors.length];
		const primaryCollection = fallbackCollectionSeed[index % fallbackCollectionSeed.length];
		const secondaryCollection = fallbackCollectionSeed[(index + 2) % fallbackCollectionSeed.length];
		const price = 6900 + index * 280;

		return {
			id: `fallback-demo-product-${number}`,
			name,
			slug: `demo-${slugifyFallback(name)}`,
			description: `${name} with premium modest drape, clean finishing, and a comfortable fit for daily and occasion styling.`,
			fabricDetails: 'Soft nida blend with graceful fall and easy care finish.',
			price,
			salePrice: index % 4 === 0 ? Math.round(price * 0.9) : null,
			metaTitle: null,
			metaDescription: null,
			isActive: true,
			images: [
				{
					id: `fallback-demo-image-${number}`,
					url: fallbackDemoImages[index % fallbackDemoImages.length],
					altText: name,
					displayOrder: 0
				}
			],
			variants: [
				{
					id: `fallback-demo-variant-${number}-s`,
					color,
					size: 'S (52)',
					sku: `FALLBACK-${number}-${color.toUpperCase()}-S`,
					stockCount: 8 + (index % 9)
				},
				{
					id: `fallback-demo-variant-${number}-m`,
					color,
					size: 'M (54)',
					sku: `FALLBACK-${number}-${color.toUpperCase()}-M`,
					stockCount: 10 + (index % 7)
				}
			],
			collections: [primaryCollection, secondaryCollection]
		};
	});
}

const fallbackProductSeed: StorefrontProduct[] = [
	{
		id: 'fallback-product-haya-everyday-abaya',
		name: 'Haya Everyday Abaya',
		slug: 'haya-everyday-abaya',
		description:
			'Simple everyday abaya with clean finishing, modest coverage, and a light comfortable feel.',
		fabricDetails: 'Nida blend, relaxed fit, easy daily care.',
		price: 7200,
		salePrice: null,
		metaTitle: null,
		metaDescription: null,
		isActive: true,
		images: [
			{
				id: 'fallback-image-haya-1',
				url: '/abaya11.png',
				altText: 'Haya Everyday Abaya',
				displayOrder: 0
			}
		],
		variants: [
			{
				id: 'fallback-variant-haya-black-s',
				color: 'Black',
				size: 'S (52)',
				sku: 'ABY-HAYA-BLK-S',
				stockCount: 8
			},
			{
				id: 'fallback-variant-haya-black-m',
				color: 'Black',
				size: 'M (54)',
				sku: 'ABY-HAYA-BLK-M',
				stockCount: 8
			}
		],
		collections: [fallbackCollectionSeed[0]]
	},
	{
		id: 'fallback-product-emerald-layered-abaya',
		name: 'Emerald Layered Abaya',
		slug: 'emerald-layered-abaya',
		description:
			'Emerald layered abaya with airy chiffon movement and a composed evening silhouette.',
		fabricDetails: 'Layered chiffon with soft inner lining.',
		price: 10800,
		salePrice: 9720,
		metaTitle: null,
		metaDescription: null,
		isActive: true,
		images: [
			{
				id: 'fallback-image-emerald-1',
				url: '/abaya22.png',
				altText: 'Emerald Layered Abaya',
				displayOrder: 0
			}
		],
		variants: [
			{
				id: 'fallback-variant-emerald-s',
				color: 'Emerald',
				size: 'S (52)',
				sku: 'ABY-EMLYR-EMR-S',
				stockCount: 6
			},
			{
				id: 'fallback-variant-emerald-m',
				color: 'Emerald',
				size: 'M (54)',
				sku: 'ABY-EMLYR-EMR-M',
				stockCount: 6
			}
		],
		collections: [fallbackCollectionSeed[1]]
	},
	...createFallbackDemoProducts()
];

const fallbackReviewPhotos = [
	{
		id: 'fallback-review-photo-1',
		url: '/ChatGPT%20Image%20May%2025,%202026,%2006_25_30%20PM.png'
	}
];

function productCountForCollection(slug: string) {
	return fallbackProductSeed.filter((product) =>
		product.collections.some((collection) => collection.slug === slug)
	).length;
}

function copyCollection(collection: StorefrontCollectionBase): StorefrontCollection {
	return {
		...collection,
		_count: {
			products: productCountForCollection(collection.slug)
		}
	};
}

function copyProduct(product: StorefrontProduct): StorefrontProduct {
	return {
		...product,
		images: product.images.map((image) => ({ ...image })),
		variants: product.variants.map((variant) => ({ ...variant })),
		collections: product.collections.map(copyCollection)
	};
}

export function serializeStorefrontProduct<
	T extends { price: unknown; salePrice?: unknown | null }
>(product: T) {
	return {
		...product,
		price: Number(product.price),
		salePrice: product.salePrice ? Number(product.salePrice) : null
	};
}

export function getFallbackCollections(options: { sortByName?: boolean; take?: number } = {}) {
	const collections = fallbackCollectionSeed.map(copyCollection);
	const sorted = options.sortByName
		? collections.sort((a, b) => a.name.localeCompare(b.name))
		: collections.sort((a, b) => a.displayOrder - b.displayOrder);

	return typeof options.take === 'number' ? sorted.slice(0, options.take) : sorted;
}

export function getFallbackProducts(options: FallbackProductOptions = {}) {
	let products = fallbackProductSeed.map(copyProduct).filter((product) => product.isActive);

	if (options.collectionSlug) {
		products = products.filter((product) =>
			product.collections.some((collection) => collection.slug === options.collectionSlug)
		);
	}

	if (options.excludeId) {
		products = products.filter((product) => product.id !== options.excludeId);
	}

	if (options.matchingCollectionIds?.length) {
		const collectionIds = new Set(options.matchingCollectionIds);
		products = products.filter((product) =>
			product.collections.some((collection) => collectionIds.has(collection.id))
		);
	}

	return typeof options.take === 'number' ? products.slice(0, options.take) : products;
}

export function getFallbackProduct(slug: string) {
	return getFallbackProducts().find((product) => product.slug === slug) ?? null;
}

export function getFallbackReviewPhotos() {
	return fallbackReviewPhotos.map((photo) => ({ ...photo }));
}

export function getFallbackColors(products: StorefrontProduct[]) {
	return Array.from(
		new Set(products.flatMap((product) => product.variants.map((variant) => variant.color)))
	).filter(Boolean);
}

export function searchFallbackProducts(query: string) {
	const normalizedQuery = query.trim().toLowerCase();

	if (normalizedQuery.length < 2) {
		return [];
	}

	return getFallbackProducts().filter((product) =>
		[
			product.name,
			product.description,
			product.fabricDetails,
			...product.collections.map((collection) => collection.name)
		]
			.filter(Boolean)
			.some((value) => String(value).toLowerCase().includes(normalizedQuery))
	);
}

export function isDatabaseUnavailable(error: unknown) {
	const candidate = error as { code?: unknown; message?: unknown };

	if (candidate?.code === 'P1001') {
		return true;
	}

	return (
		typeof candidate?.message === 'string' &&
		(candidate.message.includes("Can't reach database server") ||
			candidate.message.includes('Server has closed the connection'))
	);
}

export function warnStorefrontFallback(route: string, error: unknown) {
	const message =
		error instanceof Error
			? error.message
					.split('\n')
					.map((line) => line.trim())
					.find(Boolean)
			: String(error);

	console.warn(`[storefront] ${route}: database unavailable; using fallback catalog. ${message}`);
}
