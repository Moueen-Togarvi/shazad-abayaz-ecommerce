import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const product = {
	name: 'Zoom Fabric Light Handmade Work Abaya',
	slug: 'zoom-fabric-light-handmade-work-abaya',
	description:
		'Open-front abaya in premium Zoom fabric with light handmade beadwork trim along the front placket and cuffs. Length 54/56, Chest 24.',
	fabricDetails: 'Zoom fabric, light handmade beadwork trim on front placket and cuffs.',
	price: '6200',
	salePrice: '4800',
	imageDir: '/products/zoom-fabric-handmade-abaya'
};

const colors = [
	{ color: 'Slate Blue', hex: '#3f7396', slug: 'slate-blue' },
	{ color: 'Purple', hex: '#5b2d78', slug: 'purple' },
	{ color: 'Plum Wine', hex: '#5a1f45', slug: 'plum-wine' }
];

const skuPart = (value) =>
	value
		.trim()
		.toUpperCase()
		.replace(/[^A-Z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

const main = async () => {
	console.log('Adding Zoom Fabric Light Handmade Work Abaya (single product, colour variants)...');

	const variants = colors.map(({ color, hex }) => ({
		color,
		colorHex: hex,
		size: 'Free Size (54/56)',
		stockCount: 5,
		sku: `${skuPart(product.slug)}-${skuPart(color)}`
	}));

	const images = colors.map(({ color, slug }, index) => ({
		url: `${product.imageDir}/zoom-handmade-${slug}.png`,
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
