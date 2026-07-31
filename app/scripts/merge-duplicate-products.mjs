// Merges "duplicate" products that only differ by color in the title
// (e.g. "Ayla Nida Abaya - Black", "Ayla Nida Abaya - Blue") into a single
// product with multiple color variants, and deletes the leftover duplicates.
//
// SAFE BY DEFAULT: running with no flags only PRINTS the plan. Nothing is
// written to the database unless you pass --apply.
//
// Usage:
//   node scripts/merge-duplicate-products.mjs              # dry run (default)
//   node scripts/merge-duplicate-products.mjs --dry-run     # same as above, explicit
//   node scripts/merge-duplicate-products.mjs --apply       # actually merge + delete
//
// Requires DATABASE_URL to be set (reads from .env automatically via Prisma).

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const APPLY = process.argv.includes('--apply');

// Known color name -> hex, used to backfill colorHex when we can infer the
// color from the product title. Extend this list if your colors aren't here.
const COLOR_HEX_MAP = {
	black: '#000000',
	white: '#ffffff',
	red: '#ef4444',
	blue: '#3b82f6',
	green: '#22c55e',
	yellow: '#eab308',
	purple: '#a855f7',
	pink: '#ec4899',
	orange: '#f97316',
	gray: '#6b7280',
	grey: '#6b7280',
	cream: '#fbf9f2',
	gold: '#c5a880',
	emerald: '#0f766e',
	navy: '#1e3a8a',
	beige: '#e1c699',
	maroon: '#800000',
	plum: '#dddae8',
	lavender: '#e6e6fa',
	olive: '#808000',
	indigo: '#4b0082',
	ivory: '#fff7ed',
	charcoal: '#374151',
	midnight: '#111827',
	sage: '#8fa99a',
	mocha: '#6f4e37',
	'dusty rose': '#c08497'
};

// Strips a trailing color suffix like " - Black", "- Emerald Green", "(Blue)"
// from a product title, returning { baseName, color } or null if no
// recognizable suffix pattern was found (title is left untouched).
const KNOWN_COLOR_WORDS = Object.keys(COLOR_HEX_MAP)
	.sort((a, b) => b.length - a.length)
	.map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

const suffixPattern = new RegExp(
	`\\s*[-–—(]\\s*((?:${KNOWN_COLOR_WORDS.join('|')})(?:\\s+(?:${KNOWN_COLOR_WORDS.join('|')}))?)\\s*\\)?\\s*$`,
	'i'
);

function splitTitleColor(name) {
	const match = name.match(suffixPattern);
	if (!match) return null;
	const color = match[1].trim();
	const baseName = name.slice(0, match.index).trim();
	if (!baseName) return null;
	return { baseName, color };
}

function toTitleCase(s) {
	return s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
}

function colorHexFor(colorName) {
	return COLOR_HEX_MAP[colorName.toLowerCase().trim()] || null;
}

async function main() {
	const products = await prisma.product.findMany({
		include: {
			images: { orderBy: { displayOrder: 'asc' } },
			variants: true,
			collections: true
		},
		orderBy: { createdAt: 'asc' }
	});

	const groups = new Map(); // baseName (lowercased) -> { baseName, items: [{ product, color }] }

	for (const product of products) {
		const split = splitTitleColor(product.name);
		if (!split) continue;
		const key = split.baseName.toLowerCase();
		if (!groups.has(key)) groups.set(key, { baseName: split.baseName, items: [] });
		groups.get(key).items.push({ product, color: toTitleCase(split.color) });
	}

	const mergeable = [...groups.values()].filter((g) => g.items.length > 1);

	if (mergeable.length === 0) {
		console.log(
			'No duplicate-by-color product groups found (looked for titles like "X - Black", "X - Blue").'
		);
		console.log(
			'If your products are named differently, tell Claude the exact naming pattern so the script can be adjusted.'
		);
		await prisma.$disconnect();
		return;
	}

	console.log(`Found ${mergeable.length} group(s) of duplicate products:\n`);

	for (const group of mergeable) {
		// Keep the oldest product as the "primary" — it keeps its id/slug/URL.
		const [primary, ...rest] = group.items;
		console.log(`Group: "${group.baseName}"`);
        console.log(
			`  KEEP    -> [${primary.product.id}] "${primary.product.name}" (slug: ${primary.product.slug}) as color "${primary.color}"`
		);
		for (const item of rest) {
			console.log(
				`  MERGE+DELETE -> [${item.product.id}] "${item.product.name}" (slug: ${item.product.slug}) as color "${item.color}"`
			);
		}
		const totalVariants = group.items.reduce((n, i) => n + i.product.variants.length, 0);
		const totalImages = group.items.reduce((n, i) => n + i.product.images.length, 0);
		console.log(
			`  -> Result: 1 product "${group.baseName}" with ${totalVariants} variant(s) across ${group.items.length} color(s), ${totalImages} image(s) total.\n`
		);
	}

	if (!APPLY) {
		console.log('DRY RUN — no changes were made.');
		console.log('Re-run with --apply once this plan looks correct:');
		console.log('  node scripts/merge-duplicate-products.mjs --apply');
		await prisma.$disconnect();
		return;
	}

	console.log('Applying merges...\n');

	for (const group of mergeable) {
		const [primary, ...rest] = group.items;

		await prisma.$transaction(async (tx) => {
			// Rename the primary product to the shared base name.
			await tx.product.update({
				where: { id: primary.product.id },
				data: { name: group.baseName }
			});

			// Tag primary's own variants with its inferred color if they
			// don't already have a meaningful color (i.e. size-only variants
			// keep "Default"; explicit color variants keep their own color).
			for (const variant of primary.product.variants) {
				if (!variant.color || variant.color.toLowerCase() === 'default') {
					await tx.productVariant.update({
						where: { id: variant.id },
						data: {
							color: primary.color,
							colorHex: variant.colorHex || colorHexFor(primary.color)
						}
					});
				} else if (!variant.colorHex) {
					const hex = colorHexFor(variant.color);
					if (hex) {
						await tx.productVariant.update({ where: { id: variant.id }, data: { colorHex: hex } });
					}
				}
			}

			let nextImageOrder =
				primary.product.images.reduce((max, img) => Math.max(max, img.displayOrder), -1) + 1;

			for (const item of rest) {
				const inferredHex = colorHexFor(item.color);

				// Move variants over, re-tagging color for this duplicate's variants.
				for (const variant of item.product.variants) {
					const isSizeOnly = !variant.color || variant.color.toLowerCase() === 'default';
					await tx.productVariant.update({
						where: { id: variant.id },
						data: {
							productId: primary.product.id,
							color: isSizeOnly ? item.color : variant.color,
							colorHex: variant.colorHex || (isSizeOnly ? inferredHex : colorHexFor(variant.color))
						}
					});
				}

				// Move images over, keeping ordering after the primary's own images.
				for (const image of item.product.images) {
					await tx.productImage.update({
						where: { id: image.id },
						data: { productId: primary.product.id, displayOrder: nextImageOrder++ }
					});
				}

				// Merge collection associations (avoid duplicates).
				const existingCollectionIds = new Set(
					(
						await tx.product.findUnique({
							where: { id: primary.product.id },
							select: { collections: { select: { id: true } } }
						})
					).collections.map((c) => c.id)
				);
				const newCollectionIds = item.product.collections
					.map((c) => c.id)
					.filter((id) => !existingCollectionIds.has(id));
				if (newCollectionIds.length) {
					await tx.product.update({
						where: { id: primary.product.id },
						data: { collections: { connect: newCollectionIds.map((id) => ({ id })) } }
					});
				}

				// Re-point reviews, wishlists, order items, and storefront section
				// entries to the primary product before deleting the duplicate,
				// so we don't lose historical/customer data.
				await tx.review.updateMany({
					where: { productId: item.product.id },
					data: { productId: primary.product.id }
				});
				await tx.orderItem.updateMany({
					where: { productId: item.product.id },
					data: { productId: primary.product.id }
				});

				// Re-point wishlist entries via the relation API (safe regardless
				// of the underlying implicit join table's column names).
				const wishlistedUsers = await tx.product.findUnique({
					where: { id: item.product.id },
					select: { wishlistedBy: { select: { id: true } } }
				});
				if (wishlistedUsers?.wishlistedBy.length) {
					await tx.product.update({
						where: { id: primary.product.id },
						data: {
							wishlistedBy: { connect: wishlistedUsers.wishlistedBy.map((u) => ({ id: u.id })) }
						}
					});
				}

				// Storefront section placements: drop the duplicate's rows if the
				// primary already has one for the same page/section (unique
				// constraint), otherwise repoint them.
				const sectionRows = await tx.storefrontSectionProduct.findMany({
					where: { productId: item.product.id }
				});
				for (const row of sectionRows) {
					const clash = await tx.storefrontSectionProduct.findFirst({
						where: {
							pageKey: row.pageKey,
							sectionKey: row.sectionKey,
							productId: primary.product.id
						}
					});
					if (clash) {
						await tx.storefrontSectionProduct.delete({ where: { id: row.id } });
					} else {
						await tx.storefrontSectionProduct.update({
							where: { id: row.id },
							data: { productId: primary.product.id }
						});
					}
				}

				// Now safe to delete the duplicate product (its variants/images
				// were already moved, so cascade delete has nothing left to touch).
				await tx.product.delete({ where: { id: item.product.id } });

				console.log(`  Merged "${item.product.name}" into "${group.baseName}" and deleted it.`);
			}
		});
	}

	console.log('\nDone. All duplicate groups merged.');
	await prisma.$disconnect();
}

main().catch(async (err) => {
	console.error(err);
	await prisma.$disconnect();
	process.exit(1);
});
