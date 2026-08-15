import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const product = {
	name: 'Hurram Sultan Abaya',
	slug: 'hurram-sultan-abaya',
	description:
		'Hurram Sultan Abaya in premium Manjan fabric with cascading crystal fringe across the shoulders and layered chain detailing.',
	fabricDetails: 'Manjan fabric, crystal fringe shoulder embellishment, layered chain drape.',
	price: '6500',
	salePrice: '5500',
	imageDir: '/products/hurram-sultan-abaya'
};

const colors = [
	{ color: 'Camel Gold', hex: '#b5792f', slug: 'camel-gold' },
	{ color: 'Beige Taupe', hex: '#ab9270', slug: 'beige-taupe' },
	{ color: 'Navy Blue', hex: '#33447e', slug: 'navy-blue' },
	{ color: 'Dusty Mauve', hex: '#c1728a', slug: 'dusty-mauve' },
	{ color: 'Black', hex: '#000000', slug: 'black' }
];

const skuPart = (value) =>
	value
		.trim()
		.toUpperCase()
		.replace(/[^A-Z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

const main = async () => {
	console.log('Adding Hurram Sultan Abaya (single product, colour variants)...');

	const variants = colors.map(({ color, hex }) => ({
		color,
		colorHex: hex,
		size: 'Free Size (54/56)',
		stockCount: 5,
		sku: `${skuPart(product.slug)}-${skuPart(color)}`
	}));

	const images = colors.map(({ color, slug }, index) => ({
		url: `${product.imageDir}/hurram-sultan-${slug}.png`,
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
