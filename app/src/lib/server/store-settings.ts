import prisma from '$lib/server/prisma';

type SettingValues = Record<string, string>;

export const defaultStoreSettings: SettingValues = {
	store_name: 'Abayiza',
	store_contact_email: 'contact@abayiza.com',
	sender_email: 'noreply@abayiza.com',
	support_phone: '923116857822',
	support_phone_secondary: '923346657779',
	whatsapp_catalog: 'https://wa.me/c/923116857822',
	whatsapp_order_number: '923116857822',
	whatsapp_order_number_secondary: '923346657779',
	timezone: 'Asia/Karachi',
	unit_system: 'metric',
	store_currency: 'PKR',
	default_country: 'Pakistan',
	free_shipping_threshold: '15000',
	cod_enabled: 'true',
	jazzcash_status: 'coming_soon',
	return_policy_days: '14',
	shipping_note: 'Free delivery over Rs. 15,000',
	order_notify_email: '',
	resend_from_email: ''
};

export const defaultStorefrontSettings: SettingValues = {
	hero_eyebrow: 'New Season Edit',
	hero_headline_phrases:
		'Premium Abayas\nLuxury Abayas\nNida Essentials\nModest Layers\nEid Sale Abayiza',
	hero_subheading:
		'Clean Nida silhouettes with soft movement, refined finishing, and everyday grace.',
	hero_primary_label: 'Shop Collection',
	hero_primary_href: '/shop',
	hero_secondary_label: 'View Lookbook',
	hero_secondary_href: '/lookbook',
	hero_images:
		'/ChatGPT%20Image%20May%2025,%202026,%2006_25_42%20PM.png\n/ChatGPT%20Image%20May%2025,%202026,%2006_25_51%20PM.png\n/ChatGPT%20Image%20May%2025,%202026,%2006_25_13%20PM.png\n/ChatGPT%20Image%20May%2025,%202026,%2006_07_28%20PM.png\n/ChatGPT%20Image%20May%2025,%202026,%2006_25_25%20PM.png',
	sale_tape_enabled: 'true',
	sale_tape_items: 'EID SALE\n30% OFF\nABAYIZA',
	sale_tape_speed: '18',
	show_featured_collections: 'true',
	show_ethos: 'true',
	show_new_arrivals: 'true',
	show_promise: 'true',
	show_most_loved: 'true',
	show_inventory: 'true',

	// Slide 1
	slide1_title: 'Premium Nida Essentials',
	slide1_tagline: 'EVERYDAY COMFORT',
	slide1_description:
		'Double-stitched durability and flowy silhouettes in authentic premium Nida fabric. Styled for standard modest daily wear.',
	slide1_link: '/shop?category=nida-essentials',
	slide1_image: '/abaya_banner_nida.png',
	slide1_promo: '40% OFF',

	// Slide 2
	slide2_title: 'Luxury Occasion Wear',
	slide2_tagline: 'ELEGANT LAYERS',
	slide2_description:
		'Featuring intricate hand-stitched beadwork and premium drapes on soft premium flowy georgette edits.',
	slide2_link: '/shop?category=occasion',
	slide2_image: '/abaya_banner_occasion.png',
	slide2_promo: '50% OFF',

	// Slide 3
	slide3_title: 'Eid Signature Edit',
	slide3_tagline: 'LIMITED EMBROIDERY',
	slide3_description:
		'Sophisticated dark cuts with delicate gold-lace details, designed to leave a quiet, modest presence.',
	slide3_link: '/shop?category=eid-edit',
	slide3_image: '/abaya_banner_eid.png',
	slide3_promo: '30% OFF',

	// Flash Sale
	flash_sale_enabled: 'true',
	flash_sale_title: 'FLASH SALE',
	flash_sale_subtitle: 'Ends Soon!',
	flash_sale_description: 'UP TO 70% OFF SELECTED ITEMS',
	flash_sale_image: '/abaya_banner_occasion.png',
	flash_sale_hours: '2',
	flash_sale_minutes: '14',
	flash_sale_seconds: '30',
	flash_sale_cta_label: 'Shop The Sale',
	flash_sale_cta_link: '/shop?on-sale=true'
};

const descriptions: Record<string, string> = {
	store_name: 'Store display name',
	store_contact_email: 'Public contact email',
	sender_email: 'Default sender email',
	support_phone: 'Customer support phone',
	support_phone_secondary: 'Secondary customer support phone',
	whatsapp_catalog: 'WhatsApp catalog URL',
	whatsapp_order_number: 'WhatsApp order support number',
	whatsapp_order_number_secondary: 'Secondary WhatsApp order support number',
	timezone: 'Store timezone',
	unit_system: 'Store measurement unit system',
	store_currency: 'Store currency',
	default_country: 'Default checkout country',
	free_shipping_threshold: 'Free shipping threshold',
	cod_enabled: 'Cash on delivery status',
	jazzcash_status: 'JazzCash availability status',
	return_policy_days: 'Return policy window in days',
	shipping_note: 'Shipping note shown by the store',
	order_notify_email: 'Admin order notification email',
	resend_from_email: 'Resend sender email',
	hero_eyebrow: 'Home hero eyebrow',
	hero_headline_phrases: 'Home hero typewriter phrases',
	hero_subheading: 'Home hero subheading',
	hero_primary_label: 'Home hero primary button label',
	hero_primary_href: 'Home hero primary button URL',
	hero_secondary_label: 'Home hero secondary button label',
	hero_secondary_href: 'Home hero secondary button URL',
	hero_images: 'Home hero slide image URLs',
	sale_tape_enabled: 'Home sale tape visibility',
	sale_tape_items: 'Home sale tape items',
	sale_tape_speed: 'Home sale tape animation speed',
	show_featured_collections: 'Home featured collections visibility',
	show_ethos: 'Home ethos section visibility',
	show_new_arrivals: 'Home new arrivals visibility',
	show_promise: 'Home promise section visibility',
	show_most_loved: 'Home most loved visibility',
	show_inventory: 'Home inventory section visibility',

	slide1_title: 'Slide 1 Title',
	slide1_tagline: 'Slide 1 Tagline',
	slide1_description: 'Slide 1 Description',
	slide1_link: 'Slide 1 Link URL',
	slide1_image: 'Slide 1 Image URL',
	slide1_promo: 'Slide 1 Promo Badge',

	slide2_title: 'Slide 2 Title',
	slide2_tagline: 'Slide 2 Tagline',
	slide2_description: 'Slide 2 Description',
	slide2_link: 'Slide 2 Link URL',
	slide2_image: 'Slide 2 Image URL',
	slide2_promo: 'Slide 2 Promo Badge',

	slide3_title: 'Slide 3 Title',
	slide3_tagline: 'Slide 3 Tagline',
	slide3_description: 'Slide 3 Description',
	slide3_link: 'Slide 3 Link URL',
	slide3_image: 'Slide 3 Image URL',
	slide3_promo: 'Slide 3 Promo Badge',

	flash_sale_enabled: 'Flash Sale Visibility',
	flash_sale_title: 'Flash Sale Title',
	flash_sale_subtitle: 'Flash Sale Cursive Subtitle',
	flash_sale_description: 'Flash Sale Offer Description',
	flash_sale_image: 'Flash Sale Model Image URL',
	flash_sale_hours: 'Flash Sale Timer Hours',
	flash_sale_minutes: 'Flash Sale Timer Minutes',
	flash_sale_seconds: 'Flash Sale Timer Seconds',
	flash_sale_cta_label: 'Flash Sale Button Text',
	flash_sale_cta_link: 'Flash Sale Button URL'
};

export const getSettings = async (defaults: SettingValues) => {
	const keys = Object.keys(defaults);
	const rows = await prisma.storeSetting.findMany({
		where: { key: { in: keys } }
	});
	const values = { ...defaults };

	for (const row of rows) {
		values[row.key] = row.value;
	}

	return values;
};

export const saveSettings = async (values: SettingValues) => {
	await prisma.$transaction(
		Object.entries(values).map(([key, value]) =>
			prisma.storeSetting.upsert({
				where: { key },
				update: { value },
				create: {
					key,
					value,
					description: descriptions[key] || null
				}
			})
		)
	);
};

export const toLines = (value: string) =>
	value
		.split(/\r?\n/)
		.map((item) => item.trim())
		.filter(Boolean);

export const toBoolean = (value: string | undefined) => value === 'true' || value === 'on';

const heroPhrase = (value: string) => {
	if (value.includes('\\n')) return value.replaceAll('\\n', '\n');
	const words = value.trim().split(/\s+/);
	if (words.length <= 1) return value.trim();
	const midpoint = Math.ceil(words.length / 2);
	return `${words.slice(0, midpoint).join(' ')}\n${words.slice(midpoint).join(' ')}`;
};

export const publicStorefrontSettingsFromValues = (settings: SettingValues) => {
	return {
		heroEyebrow: settings.hero_eyebrow,
		heroHeadlinePhrases: toLines(settings.hero_headline_phrases).map(heroPhrase),
		heroSubheading: settings.hero_subheading,
		heroPrimaryLabel: settings.hero_primary_label,
		heroPrimaryHref: settings.hero_primary_href,
		heroSecondaryLabel: settings.hero_secondary_label,
		heroSecondaryHref: settings.hero_secondary_href,
		heroImages: toLines(settings.hero_images),
		saleTapeEnabled: toBoolean(settings.sale_tape_enabled),
		saleTapeItems: toLines(settings.sale_tape_items),
		saleTapeSpeed: Number(settings.sale_tape_speed) || 18,
		showFeaturedCollections: toBoolean(settings.show_featured_collections),
		showEthos: toBoolean(settings.show_ethos),
		showNewArrivals: toBoolean(settings.show_new_arrivals),
		showPromise: toBoolean(settings.show_promise),
		showMostLoved: toBoolean(settings.show_most_loved),
		showInventory: toBoolean(settings.show_inventory),

		// Sliding Banner items
		slide1Title: settings.slide1_title,
		slide1Tagline: settings.slide1_tagline,
		slide1Description: settings.slide1_description,
		slide1Link: settings.slide1_link,
		slide1Image: settings.slide1_image,
		slide1Promo: settings.slide1_promo,

		slide2Title: settings.slide2_title,
		slide2Tagline: settings.slide2_tagline,
		slide2Description: settings.slide2_description,
		slide2Link: settings.slide2_link,
		slide2Image: settings.slide2_image,
		slide2Promo: settings.slide2_promo,

		slide3Title: settings.slide3_title,
		slide3Tagline: settings.slide3_tagline,
		slide3Description: settings.slide3_description,
		slide3Link: settings.slide3_link,
		slide3Image: settings.slide3_image,
		slide3Promo: settings.slide3_promo,

		// Flash Sale
		flashSaleEnabled: toBoolean(settings.flash_sale_enabled),
		flashSaleTitle: settings.flash_sale_title,
		flashSaleSubtitle: settings.flash_sale_subtitle,
		flashSaleDescription: settings.flash_sale_description,
		flashSaleImage: settings.flash_sale_image,
		flashSaleHours: Number(settings.flash_sale_hours) || 2,
		flashSaleMinutes: Number(settings.flash_sale_minutes) || 14,
		flashSaleSeconds: Number(settings.flash_sale_seconds) || 30,
		flashSaleCtaLabel: settings.flash_sale_cta_label,
		flashSaleCtaLink: settings.flash_sale_cta_link
	};
};

export const getPublicStorefrontSettings = async () => {
	const settings = await getSettings(defaultStorefrontSettings);

	return publicStorefrontSettingsFromValues(settings);
};
