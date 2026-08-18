import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const product = {
	name: 'Front Open Zip Abaya with Cutdana Lace - Full Flyer',
	slug: 'front-open-zip-abaya-cutdana-lace-full-flyer',
	description:
		'Front open zip abaya with cutdana lace trim down the front placket and full flyer sleeves. Gown only. Chest 24.',
	fabricDetails: 'Premium fabric, front zip closure, cutdana lace trim, full flyer sleeves. Gown only.',
	price: '5500',
	salePrice: '4800',
	imageDir: '/products/front-zip-cutdana-abaya'
};

const color = { color: 'Charcoal Grey', hex: '#4a4a4d', slug: 'charcoal' };

const sizes = [
	{ label: 'M (54)', suffix: '54' },
	{ label: 'L (56)', suffix: '56' },
	{ label: 'XL (58)', suffix: '58' }
];

const skuPart = (value) =>
	value
		.trim()
		.toUpperCase()
		.replace(/[^A-Z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

const main = async () => {
	console.log('Adding Front Open Zip Abaya with Cutdana Lace (single product, size variants)...');

	const variants = sizes.map(({ label, suffix }) => ({
		color: color.color,
		colorHex: color.hex,
		size: label,
		stockCount: 5,
		sku: `${skuPart(product.slug)}-${suffix}`
	}));

	const images = [
		{
			url: `${product.imageDir}/front-zip-cutdana-${color.slug}.png`,
			altText: `${product.name}`,
			color: color.color,
			displayOrder: 0
		}
	];

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
