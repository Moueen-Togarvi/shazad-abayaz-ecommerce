// Creates (or updates) the single "Cutdana Lace" product with 10 colour
// variants, linking each colour to its own photo from static/products/cutdana-lace/.
//
// These images are served straight from the site's static folder — Cloudinary
// is NOT used here. Admin panel uploads still go to Cloudinary as usual.
//
// SAFE BY DEFAULT: with no flags this only PRINTS what it would do.
//
// Usage:
//   node scripts/seed-cutdana-lace.mjs            # dry run (default)
//   node scripts/seed-cutdana-lace.mjs --apply    # actually write to the database

import { PrismaClient } from '@prisma/client';
import { existsSync } from 'node:fs';
import path from 'node:path';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');

const SLUG = 'cutdana-lace';
const NAME = 'Cutdana Lace Abaya';
const DESCRIPTION = `Cutdana Lace Abaya — a flowing butterfly-cut abaya in premium soft chiffon, finished with a hand-embellished cutdana lace placket and matching tassel detailing.

Includes a matching hijab. Available in ten signature shades.`;

const PRICE = 8500;
const SALE_PRICE = 6800;

// Sizes offered for every colour.
const SIZES = ['S (52)', 'M (54)', 'L (56)', 'XL (58)'];
const STOCK_PER_VARIANT = 5;

// Colour name -> { file, hex }. Hex values are sampled to match the garment.
const COLORS = [
	{ name: 'Camel Tan', file: 'cutdana-lace-camel-tan.png', hex: '#a9805c' },
	{ name: 'Charcoal Graphite', file: 'cutdana-lace-charcoal-graphite.png', hex: '#4a4a4d' },
	{ name: 'Dusty Purple', file: 'cutdana-lace-dusty-purple.png', hex: '#7c6b8f' },
	{ name: 'Mauve Taupe', file: 'cutdana-lace-mauve-taupe.png', hex: '#8e7a76' },
	{ name: 'Navy Blue', file: 'cutdana-lace-navy-blue.png', hex: '#2b3a5c' },
	{ name: 'Raspberry Magenta', file: 'cutdana-lace-raspberry-magenta.png', hex: '#9c3060' },
	{ name: 'Sage Grey', file: 'cutdana-lace-sage-grey.png', hex: '#9aa396' },
	{ name: 'Steel Blue', file: 'cutdana-lace-steel-blue.png', hex: '#5d7b96' },
	{ name: 'Steel Grey', file: 'cutdana-lace-steel-grey.png', hex: '#7b8085' },
	{ name: 'Terracotta Pink', file: 'cutdana-lace-terracotta-pink.png', hex: '#c07f74' }
];

const skuPart = (value) =>
	value
		.trim()
		.toUpperCase()
		.replace(/[^A-Z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

async function main() {
	// Verify every image actually exists on disk before touching the database.
	const staticDir = path.join(process.cwd(), 'static', 'products', 'cutdana-lace');
	const missing = COLORS.filter((c) => !existsSync(path.join(staticDir, c.file)));
	if (missing.length) {
		console.error('Missing image files in static/products/cutdana-lace/:');
		for (const c of missing) console.error(`  - ${c.file}`);
		console.error('\nAborting — no changes made.');
		await prisma.$disconnect();
		process.exit(1);
	}

	let existing;
	try {
		existing = await prisma.product.findUnique({
			where: { slug: SLUG },
			include: { images: true, variants: true }
		});
	} catch (err) {
		console.error('Could not reach the database:\n');
		console.error(`  ${err.message.split('\n').find((line) => line.trim()) || err.message}`);
		console.error('\nCheck DATABASE_URL in your .env and that you have network access to Neon.');
		console.error('Aborting — no changes made.');
		await prisma.$disconnect();
		process.exit(1);
	}

	const variantPlan = COLORS.flatMap((color) =>
		SIZES.map((size) => ({
			color: color.name,
			colorHex: color.hex,
			size,
			stockCount: STOCK_PER_VARIANT,
			sku: `${skuPart(SLUG)}-${skuPart(color.name)}-${skuPart(size)}`
		}))
	);

	const imagePlan = COLORS.map((color, index) => ({
		url: `/products/cutdana-lace/${color.file}`,
		altText: `${NAME} in ${color.name}`,
		color: color.name,
		displayOrder: index
	}));

	console.log(`Product: "${NAME}"  (slug: ${SLUG})`);
	console.log(`  ${existing ? 'EXISTS — will be UPDATED in place' : 'does not exist — will be CREATED'}`);
	console.log(`  Price: ${PRICE}  Sale price: ${SALE_PRICE}`);
	console.log(`  Colours: ${COLORS.length}`);
	for (const c of COLORS) console.log(`    - ${c.name.padEnd(20)} ${c.hex}  ${c.file}`);
	console.log(`  Sizes per colour: ${SIZES.join(', ')}`);
	console.log(`  Total variants: ${variantPlan.length} (${STOCK_PER_VARIANT} stock each)`);
	console.log(`  Images: ${imagePlan.length} (served from /static, NOT Cloudinary)`);

	if (existing) {
		console.log(
			`\n  Note: existing product has ${existing.variants.length} variant(s) and ${existing.images.length} image(s);`
		);
		console.log('  these will be REPLACED with the plan above.');
	}

	if (!APPLY) {
		console.log('\nDRY RUN — nothing was written.');
		console.log('Re-run with --apply to save it:');
		console.log('  node scripts/seed-cutdana-lace.mjs --apply');
		await prisma.$disconnect();
		return;
	}

	console.log('\nWriting to database...');

	await prisma.$transaction(async (tx) => {
		let productId;

		if (existing) {
			await tx.product.update({
				where: { id: existing.id },
				data: {
					name: NAME,
					description: DESCRIPTION,
					price: PRICE,
					salePrice: SALE_PRICE,
					isActive: true
				}
			});
			productId = existing.id;

			await tx.productVariant.deleteMany({ where: { productId } });
			await tx.productImage.deleteMany({ where: { productId } });
		} else {
			const created = await tx.product.create({
				data: {
					name: NAME,
					slug: SLUG,
					description: DESCRIPTION,
					price: PRICE,
					salePrice: SALE_PRICE,
					isActive: true
				}
			});
			productId = created.id;
		}

		await tx.productVariant.createMany({
			data: variantPlan.map((v) => ({ ...v, productId }))
		});
		await tx.productImage.createMany({
			data: imagePlan.map((i) => ({ ...i, productId }))
		});

		console.log(`  Saved product ${productId}`);
	});

	console.log('\nDone. Visit /shop/cutdana-lace to see it.');
	await prisma.$disconnect();
}

main().catch(async (err) => {
	console.error(err);
	await prisma.$disconnect();
	process.exit(1);
});
