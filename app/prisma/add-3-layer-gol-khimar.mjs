import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const product = {
	name: '3 Layer Gol Khimar',
	slug: '3-layer-gol-khimar',
	description:
		'3 layer gol khimar with a tiered ruffled hem and draped cowl neckline, stitched in premium chiffon.',
	fabricDetails: 'Premium chiffon, 3-layer tiered hem, draped cowl neckline with tie closure.',
	price: '3750',
	salePrice: '3000',
	imageDir: '/products/3-layer-gol-khimar'
};

const colors = [
	{ color: 'Camel Tan', hex: '#b98a5a', slug: 'camel-tan' },
	{ color: 'Terracotta Pink', hex: '#d17a6b', slug: 'terracotta-pink' },
	{ color: 'Navy Blue', hex: '#2c3868', slug: 'navy-blue' },
	{ color: 'Purple', hex: '#9b6ba8', slug: 'purple' },
	{ color: 'Lavender Grey', hex: '#a7a3b8', slug: 'lavender-grey' },
	{ color: 'Ivory White', hex: '#f5f2ea', slug: 'ivory-white' },
	{ color: 'Mocha Brown', hex: '#5a4a4a', slug: 'mocha-brown' },
	{ color: 'Black', hex: '#000000', slug: 'black' },
	{ color: 'Teal', hex: '#2e7d74', slug: 'teal' },
	{ color: 'Magenta Pink', hex: '#a13458', slug: 'magenta-pink' }
];

const skuPart = (value) =>
	value
		.trim()
		.toUpperCase()
		.replace(/[^A-Z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

const main = async () => {
	console.log('Adding 3 Layer Gol Khimar (single product, colour variants)...');

	const variants = colors.map(({ color, hex }) => ({
		color,
		colorHex: hex,
		size: 'One Size',
		stockCount: 5,
		sku: `${skuPart(product.slug)}-${skuPart(color)}`
	}));

	const images = colors.map(({ color, slug }, index) => ({
		url: `${product.imageDir}/gol-khimar-${slug}.png`,
		altText: `${product.name} in ${color}`,
		color,
		displayOrder: index
	}));

	await prisma.product.upsert({
		where: { slug: product.slug },
		update: {},
		create: {
			name: product.name,
			slug: product.slug,
			description: product.description,
			fabricDetails: product.fabricDetails,
			price: product.price,
			salePrice: product.salePrice,
			isActive: true,
			images: { create: images },
			variants: { create: variants }
		}
	});

	const counts = await Promise.all([prisma.product.count(), prisma.productVariant.count()]);
	console.log(JSON.stringify({ products: counts[0], variants: counts[1] }, null, 2));
};

main()
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
