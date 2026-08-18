import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const product = {
	name: 'Malaysian Flyer Butterfly Abaya - White',
	slug: 'malaysian-flyer-butterfly-abaya-white',
	description:
		'Malaysian flyer butterfly-sleeve abaya with an asymmetric ruffled front drape, premium chiffon (shafoon) fabric. White. 4-piece set: inner, upper, stole, and niqab. Length 54/56, Chest 24.',
	fabricDetails: 'Premium chiffon (shafoon), butterfly sleeves, ruffled front drape. 4-piece set: inner, upper, stole, niqab.',
	price: '6500',
	salePrice: '5500',
	imageDir: '/products/malaysian-flyer-butterfly-abaya'
};

const color = { color: 'White', hex: '#f7f5ef', slug: 'white' };

const skuPart = (value) =>
	value
		.trim()
		.toUpperCase()
		.replace(/[^A-Z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

const main = async () => {
	console.log('Adding Malaysian Flyer Butterfly Abaya - White (single product, single variant)...');

	const variants = [
		{
			color: color.color,
			colorHex: color.hex,
			size: 'Free Size (54/56)',
			stockCount: 5,
			sku: `${skuPart(product.slug)}-WHITE`
		}
	];

	const images = [
		{
			url: `${product.imageDir}/malaysian-flyer-${color.slug}.png`,
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
