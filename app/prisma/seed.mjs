import { PrismaClient } from '@prisma/client';
import { randomBytes, scryptSync } from 'node:crypto';

const prisma = new PrismaClient();

const hashPassword = (password) => {
	const salt = randomBytes(16).toString('base64url');
	const hash = scryptSync(password, salt, 64).toString('base64url');
	return `scrypt$${salt}$${hash}`;
};

const adminPassword =
	process.env.ADMIN_SEED_PASSWORD || `ShahzadAbayas-${randomBytes(6).toString('base64url')}`;

const categories = [
	{
		name: 'Georgette Abayas',
		slug: 'georgette-abayas',
		imageUrl: '/products/georgette-abaya/georgette-abaya-slate-blue.webp'
	}
];

const georgetteColors = [
	{ color: 'Mauve Taupe', slug: 'mauve-taupe' },
	{ color: 'Slate Blue', slug: 'slate-blue' },
	{ color: 'Purple', slug: 'purple' },
	{ color: 'Blush Pink', slug: 'blush-pink' },
	{ color: 'Dusty Blue', slug: 'dusty-blue' },
	{ color: 'Sea Green', slug: 'sea-green' },
	{ color: 'Rose Pink', slug: 'rose-pink' },
	{ color: 'Charcoal Grey', slug: 'charcoal-grey' },
	{ color: 'Powder Blue', slug: 'powder-blue' },
	{ color: 'Magenta', slug: 'magenta' },
	{ color: 'Denim Blue', slug: 'denim-blue' },
	{ color: 'Mocha Brown', slug: 'mocha-brown' }
];

const products = georgetteColors.map(({ color, slug }) => ({
	name: `Stuff Soft Georgette Abaya - ${color}`,
	slug: `stuff-soft-georgette-abaya-${slug}`,
	description:
		'Front open full flair abaya with elastic sleeves, complete with a matching niqab and stole.',
	fabricDetails: 'Soft georgette fabric, front-open flair cut, elastic cuffs.',
	price: '3500',
	salePrice: '2500',
	images: [`/products/georgette-abaya/georgette-abaya-${slug}.webp`],
	collections: ['georgette-abayas'],
	variants: [
		{
			color,
			size: 'Length 54/56, Chest 24/25',
			sku: `SA-GRG-${slug.toUpperCase().replace(/-/g, '')}`,
			stockCount: 10
		}
	]
}));

const clearDatabase = async () => {
	await prisma.review.deleteMany();
	await prisma.reviewPhoto.deleteMany();
	await prisma.orderItem.deleteMany();
	await prisma.order.deleteMany();
	await prisma.address.deleteMany();
	await prisma.coupon.deleteMany();
	await prisma.storefrontSectionProduct.deleteMany();
	await prisma.productImage.deleteMany();
	await prisma.productVariant.deleteMany();
	await prisma.product.deleteMany();
	await prisma.collection.deleteMany();
	await prisma.storeSetting.deleteMany();
	await prisma.user.deleteMany();
};

const seedDatabase = async () => {
	await prisma.collection.createMany({
		data: categories.map((category, index) => ({
			...category,
			description: null,
			isVisible: true,
			displayOrder: index
		}))
	});

	for (const product of products) {
		await prisma.product.create({
			data: {
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

	await prisma.user.create({
		data: {
			email: 'admin@shahzadabayas.com',
			passwordHash: hashPassword(adminPassword),
			firstName: 'Shahzad',
			lastName: 'Admin',
			role: 'SUPER_ADMIN',
			isBlocked: false
		}
	});
};

const main = async () => {
	console.log("Cleaning Shahzad Abaya's database...");
	await clearDatabase();

	console.log('Seeding real production data...');
	await seedDatabase();

	const counts = await Promise.all([
		prisma.collection.count(),
		prisma.product.count(),
		prisma.reviewPhoto.count(),
		prisma.user.count(),
		prisma.order.count()
	]);

	console.log(
		JSON.stringify(
			{
				categories: counts[0],
				products: counts[1],
				reviewPhotos: counts[2],
				users: counts[3],
				orders: counts[4]
			},
			null,
			2
		)
	);
	console.log(`Admin URL: /shahzad-secure-admin-4db067e1/login`);
	console.log(`Admin email: admin@shahzadabayas.com`);
	console.log(`Admin password: ${adminPassword}`);
};

main()
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
