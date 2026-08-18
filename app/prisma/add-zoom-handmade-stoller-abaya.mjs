import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const product = {
	name: 'Original Zoom Fabric Handmade Abaya with Stoller',
	slug: 'original-zoom-fabric-handmade-abaya-with-stoller',
	description:
		'Original Zoom fabric abaya with intricate handmade beadwork, comes with a matching stoller. Length 54/56, Chest 24.',
	fabricDetails: 'Original Zoom fabric, intricate handmade beadwork, includes matching stoller.',
	price: '7800',
	salePrice: '6200',
	imageDir: '/products/zoom-handmade-stoller-abaya'
};

const designs = [
	{ color: 'Floral Trail', hex: '#4a4c52', slug: 'floral-trail' },
	{ color: 'Star Trail', hex: '#4a4c52', slug: 'star-trail' },
	{ color: 'Floral Bloom', hex: '#4a4c52', slug: 'floral-bloom' }
];

const skuPart = (value) =>
	value
		.trim()
		.toUpperCase()
		.replace(/[^A-Z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

const main = async () => {
	console.log('Adding Original Zoom Fabric Handmade Abaya with Stoller (single product, design variants)...');

	const variants = designs.map(({ color, hex }) => ({
		color,
		colorHex: hex,
		size: 'Free Size (54/56)',
		stockCount: 5,
		sku: `${skuPart(product.slug)}-${skuPart(color)}`
	}));

	const images = designs.map(({ color, slug }, index) => ({
		url: `${product.imageDir}/zoom-handmade-${slug}.png`,
		altText: `${product.name} - ${color} design`,
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
