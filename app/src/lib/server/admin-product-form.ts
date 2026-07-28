export type ParsedProductVariant = {
	color: string;
	size: string;
	stockCount: number;
	sku: string;
};

export type ParsedProductForm = {
	name: string;
	slug: string;
	description: string;
	price: number;
	salePrice: number | null;
	isActive: boolean;
	productStatus: 'ACTIVE' | 'DRAFT' | 'OUT_OF_STOCK';
	collectionIds: string[];
	variants: ParsedProductVariant[];
};

export const toProductSlug = (value: string) =>
	value
		.trim()
		.toLowerCase()
		.replace(/&/g, 'and')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

const skuPart = (value: string) =>
	value
		.trim()
		.toUpperCase()
		.replace(/[^A-Z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 14);

const getValue = (values: FormDataEntryValue[], index: number) =>
	String(values[index] ?? '').trim();

const getPrice = (value: FormDataEntryValue | null) => {
	const raw = String(value ?? '').trim();
	return raw ? Number(raw) : Number.NaN;
};

const getOptionalPrice = (value: FormDataEntryValue | null) => {
	const raw = String(value ?? '').trim();
	return raw ? Number(raw) : null;
};

export const parseProductForm = (data: FormData): ParsedProductForm => {
	const name = String(data.get('name') ?? '').trim();
	const requestedSlug = String(data.get('slug') ?? '').trim();
	const slug = toProductSlug(requestedSlug || name);
	const description = String(data.get('description') ?? '').trim();
	const price = getPrice(data.get('price'));
	const salePrice = getOptionalPrice(data.get('salePrice'));
	const submittedStatus = String(data.get('productStatus') ?? '').trim();
	const productStatus =
		submittedStatus === 'OUT_OF_STOCK' ||
		submittedStatus === 'DRAFT' ||
		submittedStatus === 'ACTIVE'
			? submittedStatus
			: data.get('isActive') === 'false'
				? 'DRAFT'
				: 'ACTIVE';
	const isActive = productStatus !== 'DRAFT';
	const collectionIds = data
		.getAll('collectionIds')
		.map((value) => String(value).trim())
		.filter(Boolean);

	const variantTypes = data.getAll('variantType');
	const variantColors = data.getAll('variantColor');
	const variantSizes = data.getAll('variantSize');
	const variantStocks = data.getAll('variantStock');
	const variantSkus = data.getAll('variantSku');

	const parsedVariants = variantTypes
		.map((typeValue, index) => {
			const type = String(typeValue) === 'color' ? 'color' : 'size';
			const color = type === 'color' ? getValue(variantColors, index) || 'Black' : 'Default';
			const size = type === 'size' ? getValue(variantSizes, index) || 'One Size' : 'One Size';
			const stockCountValue = Number(getValue(variantStocks, index) || 0);
			const stockCount = Number.isFinite(stockCountValue)
				? Math.max(0, Math.trunc(stockCountValue))
				: 0;
			const sku =
				getValue(variantSkus, index) ||
				`${skuPart(slug) || 'PRODUCT'}-${skuPart(type === 'color' ? color : size) || 'VAR'}-${index + 1}`;

			return {
				color,
				size,
				stockCount,
				sku
			};
		})
		.filter((variant) => variant.color || variant.size);
	const variants =
		productStatus === 'OUT_OF_STOCK'
			? parsedVariants.map((variant) => ({ ...variant, stockCount: 0 }))
			: parsedVariants;

	return {
		name,
		slug,
		description,
		price,
		salePrice,
		isActive,
		productStatus,
		collectionIds,
		variants:
			variants.length > 0
				? variants
				: [
						{
							color: 'Default',
							size: 'One Size',
							stockCount: 0,
							sku: `${skuPart(slug) || 'PRODUCT'}-DEFAULT-1`
						}
					]
	};
};

export const validateProductForm = (product: ParsedProductForm) => {
	if (!product.name || !product.slug) return 'Product title is required.';
	if (!Number.isFinite(product.price) || product.price < 0) return 'Valid price is required.';
	if (
		product.salePrice !== null &&
		(!Number.isFinite(product.salePrice) || product.salePrice < 0)
	) {
		return 'Valid discount price is required.';
	}

	const seenSkus = new Set<string>();
	for (const variant of product.variants) {
		if (!variant.sku) return 'Every variant needs a SKU.';
		if (seenSkus.has(variant.sku)) return 'Variant SKUs must be unique.';
		seenSkus.add(variant.sku);
	}

	return null;
};
