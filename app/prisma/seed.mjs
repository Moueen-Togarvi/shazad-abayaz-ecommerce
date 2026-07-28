import { PrismaClient } from '@prisma/client';
import { randomBytes, scryptSync } from 'node:crypto';

const prisma = new PrismaClient();

const image = (path) => path.replaceAll(' ', '%20');

const hashPassword = (password) => {
	const salt = randomBytes(16).toString('base64url');
	const hash = scryptSync(password, salt, 64).toString('base64url');
	return `scrypt$${salt}$${hash}`;
};

const adminPassword =
	process.env.ADMIN_SEED_PASSWORD || `Abayiza-${randomBytes(6).toString('base64url')}`;

const categories = [
	{
		name: 'Nida Essentials',
		slug: 'nida-essentials'
	},
	{
		name: 'Occasion',
		slug: 'occasion'
	}
];

const products = [
	{
		name: 'Haya Everyday Abaya',
		slug: 'haya-everyday-abaya',
		description:
			'Simple everyday abaya with clean finishing, modest coverage, and a light comfortable feel.',
		fabricDetails: 'Nida blend, relaxed fit, easy daily care.',
		price: '7200',
		salePrice: null,
		images: ['/abaya11.png'],
		collections: ['nida-essentials'],
		variants: [
			{ color: 'Black', size: 'S (52)', sku: 'ABY-HAYA-BLK-S', stockCount: 8 },
			{ color: 'Black', size: 'M (54)', sku: 'ABY-HAYA-BLK-M', stockCount: 8 }
		]
	},
	{
		name: 'Emerald Layered Abaya',
		slug: 'emerald-layered-abaya',
		description:
			'Emerald layered abaya with airy chiffon movement and a composed evening silhouette.',
		fabricDetails: 'Layered chiffon with soft inner lining.',
		price: '10800',
		salePrice: '9720',
		images: ['/abaya22.png'],
		collections: ['occasion'],
		variants: [
			{ color: 'Emerald', size: 'S (52)', sku: 'ABY-EMLYR-EMR-S', stockCount: 6 },
			{ color: 'Emerald', size: 'M (54)', sku: 'ABY-EMLYR-EMR-M', stockCount: 6 }
		]
	}
];

const reviewPhoto = {
	url: image('/ChatGPT Image May 25, 2026, 06_25_30 PM.png'),
	displayOrder: 0,
	isVisible: true
};

const clearDatabase = async () => {
	await prisma.review.deleteMany();
	await prisma.reviewPhoto.deleteMany();
	await prisma.orderItem.deleteMany();
	await prisma.order.deleteMany();
	await prisma.address.deleteMany();
	await prisma.coupon.deleteMany();
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
			imageUrl: null,
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

	await prisma.reviewPhoto.create({ data: reviewPhoto });

	await prisma.user.create({
		data: {
			email: 'admin@abayiza.com',
			passwordHash: hashPassword(adminPassword),
			firstName: 'Abayiza',
			lastName: 'Admin',
			role: 'SUPER_ADMIN',
			isBlocked: false
		}
	});
};

const main = async () => {
	console.log('Cleaning Abayiza database...');
	await clearDatabase();

	console.log('Seeding minimal production data...');
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
	console.log(`Admin URL: /abayiza-secure-admin-7k9x2p/login`);
	console.log(`Admin email: admin@abayiza.com`);
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
