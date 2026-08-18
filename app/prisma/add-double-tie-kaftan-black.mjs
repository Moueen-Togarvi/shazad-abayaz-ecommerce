import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const product = {
	name: 'Double Tie Kaftan Abaya - Premium Black',
	slug: 'double-tie-kaftan-abaya-premium-black',
	description:
		'Double tie kaftan abaya, premium black. 4-piece set: stole, niqab, inner slip, and outer kaftan. Length 54/56, Chest 24.',
	fabricDetails: 'Premium fabric, tie-cuff sleeves. 4-piece set: stole, niqab, inner, upper kaftan.',
	price: '5500',
	salePrice: '4500',
	imageDir: '/products/double-tie-kaftan-black'
};

const color = { color: 'Premium Black', hex: '#000000', slug: 'black' };

const skuPart = (value) =>
	value
		.trim()
		.toUpperCase()
		.replace(/[^A-Z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

const main = async () => {
	console.log('Adding Double Tie Kaftan Abaya - Premium Black (single product, single variant)...');

	const variants = [
		{
			color: color.color,
			colorHex: color.hex,
			size: 'Free Size (54/56)',
			stockCount: 5,
			sku: `${skuPart(product.slug)}-BLACK`
		}
	];

	const images = [
		{
			url: `${product.imageDir}/double-tie-kaftan-${color.slug}.png`,
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
