import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const colors = [
	'Teal (Classic Sleeve)',
	'Teal (Batwing Sleeve)',
	'Mauve Purple',
	'Orchid Pink',
	'Rosewood',
	'Muted Mauve',
	'Powder Grey',
	'Mocha Taupe',
	'Denim Blue',
	'Sand Beige'
];

const main = async () => {
	console.log('Updating Nida Cutdana products with corrected name, price, and size...');

	for (const color of colors) {
		const slugSuffix = color
			.toLowerCase()
			.replace(/\s*\(.*?\)\s*/g, (match) => '-' + match.trim().replace(/[()]/g, '').replace(/\s+/g, '-'))
			.replace(/\s+/g, '-');

		const product = await prisma.product.findFirst({
			where: { name: { contains: color, mode: 'insensitive' }, slug: { contains: 'nida-cutdana' } }
		});

		if (!product) {
			console.warn(`Not found for color: ${color}`);
			continue;
		}

		await prisma.product.update({
			where: { id: product.id },
			data: {
				name: `Stuff Nida Fabric - Full Flair 220 - ${color}`,
				description:
					'Full flair 220 front-open abaya in Stuff Nida fabric with full embroidery detailing.',
				fabricDetails: 'Stuff Nida fabric, full flair 220 cut, full embroidery, front-open style.',
				price: '5500',
				salePrice: '4000'
			}
		});

		await prisma.productVariant.updateMany({
			where: { productId: product.id },
			data: { size: 'Length 54/56, Chest 24/25' }
		});

		console.log(`Updated: ${color}`);
	}
};

main()
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
