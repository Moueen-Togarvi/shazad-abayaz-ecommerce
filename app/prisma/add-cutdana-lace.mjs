import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const category = {
	name: 'Handmade Cutdana Lace Abayas',
	slug: 'handmade-cutdana-lace-abayas',
	imageUrl: '/products/cutdana-lace/cutdana-lace-sage-grey.png'
};

const items = [
	{ color: 'Raspberry Magenta', slug: 'raspberry-magenta' },
	{ color: 'Terracotta Pink', slug: 'terracotta-pink' },
	{ color: 'Navy Blue', slug: 'navy-blue' },
	{ color: 'Steel Blue', slug: 'steel-blue' },
	{ color: 'Camel Tan', slug: 'camel-tan' },
	{ color: 'Sage Grey', slug: 'sage-grey' },
	{ color: 'Dusty Purple', slug: 'dusty-purple' },
	{ color: 'Charcoal Graphite', slug: 'charcoal-graphite' },
	{ color: 'Steel Grey', slug: 'steel-grey' },
	{ color: 'Mauve Taupe', slug: 'mauve-taupe' }
];

const products = items.map(({ color, slug }) => ({
	name: `Stuff Original Premium Nida Fabric Abaya - ${color}`,
	slug: `stuff-original-premium-nida-fabric-abaya-${slug}`,
	description: 'Full flair front-open abaya in original premium Nida fabric with handmade cutdana lace.',
	fabricDetails: 'Original premium Nida fabric, handmade cutdana lace trim, front-open flair cut.',
	price: '6500',
	salePrice: '5200',
	images: [`/products/cutdana-lace/cutdana-lace-${slug}.png`],
	collections: [category.slug],
	variants: [
		{
			color,
			size: 'Length 54/56, Chest 24',
			sku: `SA-CDL-${slug.toUpperCase().replace(/-/g, '')}`,
			stockCount: 10
		}
	]
}));

const main = async () => {
	console.log('Adding Handmade Cutdana Lace Abayas category and products...');

	await prisma.collection.upsert({
		where: { slug: category.slug },
		update: { imageUrl: category.imageUrl },
		create: {
			...category,
			description: null,
			isVisible: true,
			displayOrder: 2
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
