import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const product = {
	name: 'Chest Chunnat Abaya',
	slug: 'chest-chunnat-abaya',
	description:
		'Front-button abaya in premium Nida fabric with gathered chest chunnat detailing and a tie belt. Length 54/56, Chest 24/25.',
	fabricDetails: 'Premium Nida fabric, gathered chest chunnat, front button-through placket, tie belt.',
	price: '4500',
	salePrice: '3500',
	imageDir: '/products/chest-chunnat-abaya'
};

const colors = [
	{ color: 'Chocolate Brown', hex: '#5a4033', slug: 'chocolate-brown' },
	{ color: 'Black', hex: '#000000', slug: 'black' },
	{ color: 'Rosewood', hex: '#a1636a', slug: 'rosewood' },
	{ color: 'Mocha Taupe', hex: '#8a7263', slug: 'mocha-taupe' },
	{ color: 'Wine Maroon', hex: '#5e1f30', slug: 'wine-maroon' },
	{ color: 'Steel Grey', hex: '#6f7180', slug: 'steel-grey' }
];

const skuPart = (value) =>
	value
		.trim()
		.toUpperCase()
		.replace(/[^A-Z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

const main = async () => {
	console.log('Adding Chest Chunnat Abaya (single product, colour variants)...');

	const variants = colors.map(({ color, hex }) => ({
		color,
		colorHex: hex,
		size: 'Free Size (54/56)',
		stockCount: 5,
		sku: `${skuPart(product.slug)}-${skuPart(color)}`
	}));

	const images = colors.map(({ color, slug }, index) => ({
		url: `${product.imageDir}/chest-chunnat-${slug}.png`,
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
