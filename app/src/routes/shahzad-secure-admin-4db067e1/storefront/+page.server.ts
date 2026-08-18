import { setAdminFlash } from '$lib/server/admin-flash';
import { saveBannerImageFile, deleteBannerImageFile } from '$lib/server/banner-image-files';
import prisma from '$lib/server/prisma';
import { serializeStorefrontProduct } from '$lib/server/storefront-fallback';
import {
	defaultStorefrontSettings,
	getSettings,
	saveSettings,
	toLines
} from '$lib/server/store-settings';
import {
	HOME_PAGE_KEY,
	HOME_SECTION_CONFIGS,
	HOME_SECTION_KEYS,
	homeSectionHref,
	isHomeSectionKey
} from '$lib/shared/home-sections';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const productInclude = {
	images: { orderBy: { displayOrder: 'asc' } },
	variants: true,
	collections: true
} as const;

export const load: PageServerLoad = async () => {
	const storefrontSectionProduct = (prisma as any).storefrontSectionProduct;
	const [products, placements, storefrontSettings] = await Promise.all([
		prisma.product.findMany({
			where: { isActive: true },
			include: productInclude,
			orderBy: { name: 'asc' }
		}),
		storefrontSectionProduct?.findMany
			? storefrontSectionProduct.findMany({
					where: {
						pageKey: HOME_PAGE_KEY,
						sectionKey: { in: [...HOME_SECTION_KEYS] },
						product: { isActive: true }
					},
					include: {
						product: {
							include: productInclude
						}
					},
					orderBy: [{ sectionKey: 'asc' }, { displayOrder: 'asc' }, { createdAt: 'asc' }]
				})
			: Promise.resolve([]),
		getSettings(defaultStorefrontSettings)
	]);

	const selectedProductsBySection = new Map<
		string,
		ReturnType<typeof serializeStorefrontProduct>[]
	>();

	for (const placement of placements) {
		const selectedProducts = selectedProductsBySection.get(placement.sectionKey) ?? [];
		selectedProducts.push(serializeStorefrontProduct(placement.product));
		selectedProductsBySection.set(placement.sectionKey, selectedProducts);
	}

	return {
		saleTapeItems: storefrontSettings.sale_tape_items,
		products: products.map(serializeStorefrontProduct),
		sections: HOME_SECTION_CONFIGS.map((section) => ({
			...section,
			viewAllHref: homeSectionHref(section.key),
			products: selectedProductsBySection.get(section.key) ?? []
		})),
		storefrontSettings
	};
};

export const actions: Actions = {
	saveBanners: async ({ request, cookies }) => {
		const data = await request.formData();
		const getText = (key: string) => String(data.get(key) ?? '').trim();
		const bannerSection = String(data.get('bannerSection') ?? '').trim();

		let slide1_image = getText('slide1_image');
		let slide2_image = getText('slide2_image');
		let slide3_image = getText('slide3_image');
		let flash_sale_image = getText('flash_sale_image');

		const remove_slide1 = data.get('remove_slide1_image') === 'on';
		const remove_slide2 = data.get('remove_slide2_image') === 'on';
		const remove_slide3 = data.get('remove_slide3_image') === 'on';
		const remove_flash_sale = data.get('remove_flash_sale_image') === 'on';

		try {
			if (bannerSection === 'slide1') {
				const upload = await saveBannerImageFile(data.get('slide1_image_file'));
				if (upload) {
					if (slide1_image) await deleteBannerImageFile(slide1_image);
					slide1_image = upload;
				} else if (remove_slide1) {
					if (slide1_image) await deleteBannerImageFile(slide1_image);
					slide1_image = '';
				}
			}

			if (bannerSection === 'slide2') {
				const upload = await saveBannerImageFile(data.get('slide2_image_file'));
				if (upload) {
					if (slide2_image) await deleteBannerImageFile(slide2_image);
					slide2_image = upload;
				} else if (remove_slide2) {
					if (slide2_image) await deleteBannerImageFile(slide2_image);
					slide2_image = '';
				}
			}

			if (bannerSection === 'slide3') {
				const upload = await saveBannerImageFile(data.get('slide3_image_file'));
				if (upload) {
					if (slide3_image) await deleteBannerImageFile(slide3_image);
					slide3_image = upload;
				} else if (remove_slide3) {
					if (slide3_image) await deleteBannerImageFile(slide3_image);
					slide3_image = '';
				}
			}

			if (bannerSection === 'flashSale') {
				const upload = await saveBannerImageFile(data.get('flash_sale_image_file'));
				if (upload) {
					if (flash_sale_image) await deleteBannerImageFile(flash_sale_image);
					flash_sale_image = upload;
				} else if (remove_flash_sale) {
					if (flash_sale_image) await deleteBannerImageFile(flash_sale_image);
					flash_sale_image = '';
				}
			}
		} catch (err: any) {
			return fail(400, { error: err.message || 'Failed to upload images.' });
		}

		let settings: Record<string, string>;

		if (bannerSection === 'slide1') {
			settings = {
				slide1_image
			};
		} else if (bannerSection === 'slide2') {
			settings = {
				slide2_image
			};
		} else if (bannerSection === 'slide3') {
			settings = {
				slide3_image
			};
		} else {
			settings = {
				flash_sale_enabled: data.get('flash_sale_enabled') === 'on' ? 'true' : 'false',
				flash_sale_title: getText('flash_sale_title'),
				flash_sale_subtitle: getText('flash_sale_subtitle'),
				flash_sale_description: getText('flash_sale_description'),
				flash_sale_image,
				flash_sale_hours: getText('flash_sale_hours') || '2',
				flash_sale_minutes: getText('flash_sale_minutes') || '14',
				flash_sale_seconds: getText('flash_sale_seconds') || '30',
				flash_sale_cta_label: getText('flash_sale_cta_label'),
				flash_sale_cta_link: getText('flash_sale_cta_link')
			};
		}

		await saveSettings(settings);

		const bannerLabels: Record<string, string> = {
			slide1: 'Slide 1 banner',
			slide2: 'Slide 2 banner',
			slide3: 'Slide 3 banner',
			flashSale: 'Flash sale section'
		};

		setAdminFlash(
			cookies,
			`${bannerLabels[bannerSection] ?? 'Storefront banner'} updated successfully.`
		);
		throw redirect(303, '/shahzad-secure-admin-4db067e1/storefront');
	},

	saveSaleTape: async ({ request, cookies }) => {
		const data = await request.formData();
		const rawItems = String(data.get('saleTapeItems') ?? '');
		const items = toLines(rawItems).slice(0, 8);

		if (!items.length) {
			return fail(400, {
				error: 'Sale tape needs at least one text item.',
				saleTapeItems: rawItems
			});
		}

		await saveSettings({
			sale_tape_items: items.join('\n')
		});

		setAdminFlash(cookies, 'Sale tape text updated successfully.');
		throw redirect(303, '/shahzad-secure-admin-4db067e1/storefront');
	},

	saveHero: async ({ request, cookies }) => {
		const data = await request.formData();
		const rawPhrases = String(data.get('hero_headline_phrases') ?? '');
		const phrases = toLines(rawPhrases);

		if (!phrases.length) {
			return fail(400, {
				error: 'Hero typewriter needs at least one phrase.',
				hero_headline_phrases: rawPhrases
			});
		}

		await saveSettings({
			hero_headline_phrases: phrases.join('\n')
		});

		setAdminFlash(cookies, 'Hero typewriter phrases updated successfully.');
		throw redirect(303, '/shahzad-secure-admin-4db067e1/storefront');
	},

	saveSection: async ({ request, cookies }) => {
		const data = await request.formData();
		const sectionKey = String(data.get('sectionKey') ?? '');

		if (!isHomeSectionKey(sectionKey)) {
			return fail(400, { error: 'Unknown storefront section.' });
		}

		if (!(prisma as any).storefrontSectionProduct) {
			return fail(500, {
				error:
					'Storefront section controls need the regenerated Prisma client. Restart the dev server and try again.'
			});
		}

		const productIds = Array.from(
			new Set(
				data
					.getAll('productIds')
					.map((value) => String(value).trim())
					.filter(Boolean)
			)
		);

		const activeProducts = productIds.length
			? await prisma.product.findMany({
					where: {
						id: { in: productIds },
						isActive: true
					},
					select: { id: true }
				})
			: [];
		const activeProductIds = new Set(activeProducts.map((product) => product.id));
		const validProductIds = productIds.filter((id) => activeProductIds.has(id));

		await prisma.$transaction(async (tx) => {
			await tx.storefrontSectionProduct.deleteMany({
				where: {
					pageKey: HOME_PAGE_KEY,
					sectionKey
				}
			});

			if (validProductIds.length) {
				await tx.storefrontSectionProduct.createMany({
					data: validProductIds.map((productId, displayOrder) => ({
						pageKey: HOME_PAGE_KEY,
						sectionKey,
						productId,
						displayOrder
					}))
				});
			}
		});

		const section = HOME_SECTION_CONFIGS.find((item) => item.key === sectionKey);
		setAdminFlash(cookies, `${section?.title ?? 'Storefront section'} updated successfully.`);
		throw redirect(303, '/shahzad-secure-admin-4db067e1/storefront');
	}
};
