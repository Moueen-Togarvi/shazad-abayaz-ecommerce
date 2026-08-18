import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const product = {
	name: 'Double Jacket Chunnat Abaya',
	slug: 'double-jacket-chunnat-abaya',
	description:
		'Double jacket abaya with gathered chest chunnat, button placket, and a tassel drop. 4-piece set: stole, niqab, inner, and outer jacket. Length 54/56, Chest 24.',
	fabricDetails: 'Premium fabric, gathered chest chunnat, button placket with tassel. 4-piece set: stole, niqab, inner, outer jacket.',
	price: '6500',
	salePrice: '5000',
	imageDir: '/products/double-jacket-chunnat-abaya'
};

const color = { color: 'Charcoal Grey', hex: '#3a3a3d', slug: 'charcoal' };

const skuPart = (value) =>
	value
		.trim()
		.toUpperCase()
		.replace(/[^A-Z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

const main = async () => {
	console.log('Adding Double Jacket Chunnat Abaya (single product, single variant)...');

	const variants = [
		{
			color: color.color,
			colorHex: color.hex,
			size: 'Free Size (54/56)',
			stockCount: 5,
			sku: `${skuPart(product.slug)}-CHARCOAL`
		}
	];

	const images = [
		{
			url: `${product.imageDir}/double-jacket-chunnat-${color.slug}.png`,
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
