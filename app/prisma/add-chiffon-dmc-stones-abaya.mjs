import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const product = {
	name: 'Double Upper Chiffon Abaya with DMC Stones',
	slug: 'double-upper-chiffon-abaya-dmc-stones',
	description:
		'Double upper chiffon abaya with original DMC stones handwork along the front panel and cuffs. Length 54/56, Chest 24.',
	fabricDetails: 'Chiffon fabric, original DMC stones embellishment, double upper layered cut.',
	price: '6200',
	salePrice: '4800',
	imageDir: '/products/chiffon-dmc-stones-abaya'
};

const colors = [
	{ color: 'Sage Green', hex: '#7f9b93', slug: 'sage-green' },
	{ color: 'Dusty Lavender', hex: '#a394b5', slug: 'dusty-lavender' },
	{ color: 'Berry Pink', hex: '#b15877', slug: 'berry-pink' },
	{ color: 'Mauve Beige', hex: '#d4c2bb', slug: 'mauve-beige' },
	{ color: 'Cobalt Blue', hex: '#4a5fa5', slug: 'cobalt-blue' },
	{ color: 'Silver Grey', hex: '#b7b6b4', slug: 'silver-grey' }
];

const skuPart = (value) =>
	value
		.trim()
		.toUpperCase()
		.replace(/[^A-Z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

const main = async () => {
	console.log('Adding Double Upper Chiffon Abaya with DMC Stones (single product, colour variants)...');

	const variants = colors.map(({ color, hex }) => ({
		color,
		colorHex: hex,
		size: 'Free Size (54/56)',
		stockCount: 5,
		sku: `${skuPart(product.slug)}-${skuPart(color)}`
	}));

	const images = colors.map(({ color, slug }, index) => ({
		url: `${product.imageDir}/chiffon-dmc-${slug}.png`,
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
