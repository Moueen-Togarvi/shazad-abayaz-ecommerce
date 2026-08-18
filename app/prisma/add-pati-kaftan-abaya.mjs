import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const product = {
	name: 'Pati Kaftan Abaya',
	slug: 'pati-kaftan-abaya',
	description:
		'Pati kaftan abaya with hand-beaded vine embroidery and a jewelled neckline trim, finished with a tassel drop. Upper layer in high multi chiffon over an inner Nida fabric base. Chest 24.',
	fabricDetails: 'Upper: high multi chiffon. Inner: Nida fabric. Beaded vine embroidery, jewelled neckline trim, tassel drop.',
	price: '7200',
	salePrice: '6000',
	imageDir: '/products/pati-kaftan-abaya'
};

const colors = [
	{ color: 'Teal', hex: '#3d7d74', slug: 'teal' },
	{ color: 'Mauve Rose', hex: '#a9647a', slug: 'mauve-rose' },
	{ color: 'Slate Blue', hex: '#5c7590', slug: 'slate-blue' },
	{ color: 'Steel Grey', hex: '#8a8d9a', slug: 'steel-grey' },
	{ color: 'Dusty Purple', hex: '#8a7791', slug: 'dusty-purple' },
	{ color: 'Taupe Brown', hex: '#8a7568', slug: 'taupe-brown' },
	{ color: 'Denim Blue', hex: '#4c6187', slug: 'denim-blue' },
	{ color: 'Sage Green', hex: '#8fa189', slug: 'sage-green' },
	{ color: 'Dusty Mauve', hex: '#9a7d94', slug: 'dusty-mauve' }
];

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
	console.log('Adding Pati Kaftan Abaya (single product, colour + size variants)...');

	const variants = colors.flatMap(({ color, hex }) =>
		sizes.map(({ label, suffix }) => ({
			color,
			colorHex: hex,
			size: label,
			stockCount: 5,
			sku: `${skuPart(product.slug)}-${skuPart(color)}-${suffix}`
		}))
	);

	const images = colors.map(({ color, slug }, index) => ({
		url: `${product.imageDir}/pati-kaftan-${slug}.png`,
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
