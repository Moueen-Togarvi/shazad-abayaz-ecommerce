import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const product = {
	name: 'Double Jacket Abaya with Original DMC Stones',
	slug: 'double-jacket-abaya-dmc-stones',
	description:
		'Double jacket abaya with original DMC stones handwork, stitched in premium TikTok fabric. Length 54/56, Chest 24.',
	fabricDetails: 'TikTok fabric, original DMC stones embellishment, double jacket cut.',
	price: '6500',
	salePrice: '5500',
	imageDir: '/products/dmc-stones-abaya'
};

const colors = [
	{ color: 'Mauve Rose', hex: '#a56a72', slug: 'mauve-rose' },
	{ color: 'Sand Beige', hex: '#cbb896', slug: 'sand-beige' },
	{ color: 'Black', hex: '#000000', slug: 'black' },
	{ color: 'Sage Green', hex: '#8fa88f', slug: 'sage-green' },
	{ color: 'Mint Green', hex: '#c3d6c8', slug: 'mint-green' },
	{ color: 'Navy Blue', hex: '#33507a', slug: 'navy-blue' },
	{ color: 'Plum Purple', hex: '#6e5675', slug: 'plum-purple' },
	{ color: 'Powder Blue', hex: '#c3d0dc', slug: 'powder-blue' },
	{ color: 'Mocha Brown', hex: '#7a6656', slug: 'mocha-brown' },
	{ color: 'Lilac', hex: '#c3b8db', slug: 'lilac' }
];

const skuPart = (value) =>
	value
		.trim()
		.toUpperCase()
		.replace(/[^A-Z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

const main = async () => {
	console.log('Adding Double Jacket Abaya with DMC Stones (single product, colour variants)...');

	const variants = colors.map(({ color, hex }) => ({
		color,
		colorHex: hex,
		size: 'Free Size (54/56)',
		stockCount: 5,
		sku: `${skuPart(product.slug)}-${skuPart(color)}`
	}));

	const images = colors.map(({ color, slug }, index) => ({
		url: `${product.imageDir}/dmc-stones-${slug}.png`,
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
