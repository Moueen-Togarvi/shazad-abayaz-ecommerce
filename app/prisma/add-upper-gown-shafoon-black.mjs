import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const product = {
	name: 'Upper Gown Premium Chiffon Abaya - Pure Black',
	slug: 'upper-gown-premium-chiffon-abaya-black',
	description:
		'Upper gown style abaya in premium chiffon (shafoon) with a jewelled trim along the front placket and cuffs. Pure black. Chest 24.',
	fabricDetails: 'Premium chiffon (shafoon), jewelled trim on front placket and cuffs.',
	price: '6500',
	salePrice: '5200',
	imageDir: '/products/upper-gown-shafoon-black'
};

const color = { color: 'Pure Black', hex: '#000000', slug: 'black' };

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
	console.log('Adding Upper Gown Premium Chiffon Abaya - Pure Black (single product, size variants)...');

	const variants = sizes.map(({ label, suffix }) => ({
		color: color.color,
		colorHex: color.hex,
		size: label,
		stockCount: 5,
		sku: `${skuPart(product.slug)}-${suffix}`
	}));

	const images = [
		{
			url: `${product.imageDir}/upper-gown-${color.slug}.png`,
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
