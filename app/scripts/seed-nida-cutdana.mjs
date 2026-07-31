// Creates (or updates) the single "Nida Cutdana Abaya" product with 10 colour
// variants. Unlike seed-cutdana-lace.mjs, this script UPLOADS each photo from
// static/products/nida-cutdana/ to Cloudinary (same signed upload flow the
// admin panel uses) and stores the resulting Cloudinary URL — it does not
// serve the images from /static.
//
// Requires CLOUDINARY_URL (and optionally CLOUDINARY_FOLDER) to be set —
// load your .env with Node's --env-file flag (Node 22 supports it natively).
//
// SAFE BY DEFAULT: with no flags this only PRINTS what it would do.
//
// Usage:
//   node --env-file=.env scripts/seed-nida-cutdana.mjs            # dry run (default)
//   node --env-file=.env scripts/seed-nida-cutdana.mjs --apply    # upload + write to DB

import { PrismaClient } from '@prisma/client';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');

const SLUG = 'nida-cutdana-abaya';
const NAME = 'Nida Cutdana Abaya';
const DESCRIPTION = `Nida Cutdana Abaya — a full flared, front-open abaya in premium Nida fabric with full embroidery detailing throughout.

Length: 54/56 | Chest: 24/25. Available in ten signature shades.`;

const PRICE = 5500;
const SALE_PRICE = 4000;

// Only one size is offered for this product.
const SIZE = 'Free Size (54/56)';
const STOCK_PER_VARIANT = 5;

// Colour name -> { file, hex }. Hex values are sampled to match the garment.
const COLORS = [
	{ name: 'Denim Blue', file: 'nida-cutdana-denim-blue.png', hex: '#3b587a' },
	{ name: 'Mauve Purple', file: 'nida-cutdana-mauve-purple.png', hex: '#8a6a8f' },
	{ name: 'Mocha Taupe', file: 'nida-cutdana-mocha-taupe.png', hex: '#8a7266' },
	{ name: 'Muted Mauve', file: 'nida-cutdana-muted-mauve.png', hex: '#a1818a' },
	{ name: 'Orchid Pink', file: 'nida-cutdana-orchid-pink.png', hex: '#c17ba0' },
	{ name: 'Powder Grey', file: 'nida-cutdana-powder-grey.png', hex: '#a8a9ad' },
	{ name: 'Rosewood', file: 'nida-cutdana-rosewood.png', hex: '#7a3b42' },
	{ name: 'Sand Beige', file: 'nida-cutdana-sand-beige.png', hex: '#cbb896' },
	{ name: 'Teal Batwing', file: 'nida-cutdana-teal-batwing.png', hex: '#2f6f6a' },
	{ name: 'Teal Classic', file: 'nida-cutdana-teal-classic.png', hex: '#1f5c57' }
];

const skuPart = (value) =>
	value
		.trim()
		.toUpperCase()
		.replace(/[^A-Z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

// --- Minimal standalone Cloudinary client (mirrors src/lib/server/cloudinary-media.ts) ---

const cloudinaryUrlConfig = () => {
	const raw = process.env.CLOUDINARY_URL?.trim();
	if (!raw) return null;
	try {
		const parsed = new URL(raw);
		return {
			cloudName: parsed.hostname,
			apiKey: decodeURIComponent(parsed.username),
			apiSecret: decodeURIComponent(parsed.password)
		};
	} catch {
		return null;
	}
};

const cloudName = () => process.env.CLOUDINARY_CLOUD_NAME?.trim() || cloudinaryUrlConfig()?.cloudName;
const apiKey = () => process.env.CLOUDINARY_API_KEY?.trim() || cloudinaryUrlConfig()?.apiKey;
const apiSecret = () => process.env.CLOUDINARY_API_SECRET?.trim() || cloudinaryUrlConfig()?.apiSecret;
const baseFolder = () => process.env.CLOUDINARY_FOLDER?.trim() || 'shahzad-abayas';

const isCloudinaryConfigured = () => Boolean(cloudName() && apiKey() && apiSecret());

const signParams = (params) => {
	const payload = Object.keys(params)
		.sort()
		.map((key) => `${key}=${params[key]}`)
		.join('&');
	return createHash('sha1').update(`${payload}${apiSecret()}`).digest('hex');
};

async function uploadFileToCloudinary(filePath, folder) {
	const timestamp = Math.floor(Date.now() / 1000);
	const targetFolder = `${baseFolder()}/${folder}`.replace(/^\/+|\/+$/g, '');
	const params = { folder: targetFolder, timestamp };

	const bytes = await readFile(filePath);
	const body = new FormData();
	body.set('file', new Blob([bytes], { type: 'image/png' }), path.basename(filePath));
	body.set('api_key', apiKey() || '');
	body.set('folder', targetFolder);
	body.set('timestamp', String(timestamp));
	body.set('signature', signParams(params));

	const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName()}/image/upload`, {
		method: 'POST',
		body
	});
	const json = await response.json();

	if (!response.ok || !json.secure_url) {
		throw new Error(json.error?.message || `Cloudinary upload failed for ${filePath}`);
	}

	return json.secure_url;
}

// --- Main ---

async function main() {
	const staticDir = path.join(process.cwd(), 'static', 'products', 'nida-cutdana');
	const missing = COLORS.filter((c) => !existsSync(path.join(staticDir, c.file)));
	if (missing.length) {
		console.error('Missing image files in static/products/nida-cutdana/:');
		for (const c of missing) console.error(`  - ${c.file}`);
		console.error('\nAborting — no changes made.');
		await prisma.$disconnect();
		process.exit(1);
	}

	if (!isCloudinaryConfigured()) {
		console.error('Cloudinary is not configured (CLOUDINARY_URL missing).');
		console.error('Run with: node --env-file=.env scripts/seed-nida-cutdana.mjs [--apply]');
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
		console.error('\nCheck DATABASE_URL and network access to Neon.');
		console.error('Aborting — no changes made.');
		await prisma.$disconnect();
		process.exit(1);
	}

	const variantPlan = COLORS.map((color) => ({
		color: color.name,
		colorHex: color.hex,
		size: SIZE,
		stockCount: STOCK_PER_VARIANT,
		sku: `${skuPart(SLUG)}-${skuPart(color.name)}`
	}));

	console.log(`Product: "${NAME}"  (slug: ${SLUG})`);
	console.log(`  ${existing ? 'EXISTS — will be UPDATED in place' : 'does not exist — will be CREATED'}`);
	console.log(`  Price: ${PRICE}  Sale price: ${SALE_PRICE}`);
	console.log(`  Size: ${SIZE}`);
	console.log(`  Colours: ${COLORS.length}`);
	for (const c of COLORS) console.log(`    - ${c.name.padEnd(16)} ${c.hex}  ${c.file}`);
	console.log(`  Total variants: ${variantPlan.length} (${STOCK_PER_VARIANT} stock each)`);
	console.log(`  Images: ${COLORS.length} — will be UPLOADED to Cloudinary (folder: ${baseFolder()}/products)`);

	if (existing) {
		console.log(
			`\n  Note: existing product has ${existing.variants.length} variant(s) and ${existing.images.length} image(s);`
		);
		console.log('  these will be REPLACED with the plan above.');
	}

	if (!APPLY) {
		console.log('\nDRY RUN — nothing was uploaded or written.');
		console.log('Re-run with --apply to save it:');
		console.log('  node --env-file=.env scripts/seed-nida-cutdana.mjs --apply');
		await prisma.$disconnect();
		return;
	}

	console.log('\nUploading images to Cloudinary...');
	const imagePlan = [];
	for (const [index, color] of COLORS.entries()) {
		process.stdout.write(`  Uploading ${color.file}... `);
		const url = await uploadFileToCloudinary(path.join(staticDir, color.file), 'products');
		console.log('done');
		imagePlan.push({
			url,
			altText: `${NAME} in ${color.name}`,
			color: color.name,
			displayOrder: index
		});
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

	console.log(`\nDone. Visit /shop/${SLUG} to see it.`);
	await prisma.$disconnect();
}

main().catch(async (err) => {
	console.error(err);
	await prisma.$disconnect();
	process.exit(1);
});
