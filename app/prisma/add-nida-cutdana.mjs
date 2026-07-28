import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const category = { name: 'Nida Cutdana Abayas', slug: 'nida-cutdana-abayas' };

const items = [
	{ color: 'Teal (Classic Sleeve)', slug: 'teal-classic' },
	{ color: 'Teal (Batwing Sleeve)', slug: 'teal-batwing' },
	{ color: 'Mauve Purple', slug: 'mauve-purple' },
	{ color: 'Orchid Pink', slug: 'orchid-pink' },
	{ color: 'Rosewood', slug: 'rosewood' },
	{ color: 'Muted Mauve', slug: 'muted-mauve' },
	{ color: 'Powder Grey', slug: 'powder-grey' },
	{ color: 'Mocha Taupe', slug: 'mocha-taupe' },
	{ color: 'Denim Blue', slug: 'denim-blue' },
	{ color: 'Sand Beige', slug: 'sand-beige' }
];

const products = items.map(({ color, slug }) => ({
	name: `Original Premium Nida Cutdana Abaya - ${color}`,
	slug: `original-premium-nida-cutdana-abaya-${slug}`,
	description:
		'Full flair front-open abaya in original premium Nida fabric with handmade cutdana lace embroidery.',
	fabricDetails: 'Premium Nida fabric, handmade cutdana lace embroidery, front-open flair cut.',
	price: '6500',
	salePrice: '5200',
	images: [`/products/nida-cutdana/nida-cutdana-${slug}.png`],
	collections: [category.slug],
	variants: [
		{
			color,
			size: 'Length 54/56, Chest 24',
			sku: `SA-NCD-${slug.toUpperCase().replace(/-/g, '')}`,
			stockCount: 10
		}
	]
}));

const main = async () => {
	console.log('Adding Nida Cutdana Abayas category and products...');

	await prisma.collection.upsert({
		where: { slug: category.slug },
		update: {},
		create: {
			...category,
			description: null,
			imageUrl: null,
			isVisible: true,
			displayOrder: 1
		}
	});

	for (const product of products) {
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
				images: {
					create: product.images.map((url, index) => ({
						url,
						altText: product.name,
						displayOrder: index
					}))
				},
				variants: {
					create: product.variants
				},
				collections: {
					connect: product.collections.map((slug) => ({ slug }))
				}
			}
		});
	}

	const counts = await Promise.all([prisma.collection.count(), prisma.product.count()]);
	console.log(JSON.stringify({ categories: counts[0], products: counts[1] }, null, 2));
};

main()
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
