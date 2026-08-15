import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const product = {
	name: '3 Step Abaya with Full Flyer',
	slug: '3-step-abaya-full-flyer',
	description:
		'3 step abaya with full flyer tiered sleeves and skirt, front button placket and tie belt, stitched in premium imported chiffon. Length 54/56, Chest 24.',
	fabricDetails: 'Premium imported chiffon, 3-tier flyer sleeves and skirt, front button placket, tie belt.',
	price: '7500',
	salePrice: '5500',
	imageDir: '/products/3-step-full-flyer-abaya'
};

const colors = [
	{ color: 'Steel Grey', hex: '#7c8188', slug: 'steel-grey' },
	{ color: 'Lavender Grey', hex: '#9d97ab', slug: 'lavender-grey' },
	{ color: 'Dusty Purple', hex: '#82708f', slug: 'dusty-purple' },
	{ color: 'Terracotta Rose', hex: '#c47b6c', slug: 'terracotta-rose' },
	{ color: 'Camel Tan', hex: '#c8a172', slug: 'camel-tan' },
	{ color: 'Mocha Mauve', hex: '#8d7370', slug: 'mocha-mauve' },
	{ color: 'Denim Blue', hex: '#3d5488', slug: 'denim-blue' }
];

const skuPart = (value) =>
	value
		.trim()
		.toUpperCase()
		.replace(/[^A-Z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

const main = async () => {
	console.log('Adding 3 Step Abaya with Full Flyer (single product, colour variants)...');

	const variants = colors.map(({ color, hex }) => ({
		color,
		colorHex: hex,
		size: 'Free Size (54/56)',
		stockCount: 5,
		sku: `${skuPart(product.slug)}-${skuPart(color)}`
	}));

	const images = colors.map(({ color, slug }, index) => ({
		url: `${product.imageDir}/3step-flyer-${slug}.png`,
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
