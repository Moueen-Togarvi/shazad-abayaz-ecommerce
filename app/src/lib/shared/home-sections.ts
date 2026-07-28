export const HOME_PAGE_KEY = 'home';

export const HOME_SECTION_PAGE_SIZE = 8;

export const HOME_SECTION_CONFIGS = [
	{
		key: 'signature-collections',
		eyebrow: 'Curated Edits',
		title: 'Signature Collections',
		description:
			'Refined edits for the pieces you reach for most: daily essentials, occasion layers, and timeless black abayas.',
		homepageLimit: 4
	},
	{
		key: 'new-arrivals',
		eyebrow: 'New Arrivals',
		title: 'New Arrivals',
		description: 'The latest additions to our collection.',
		homepageLimit: 4
	},
	{
		key: 'most-loved',
		eyebrow: 'Bestsellers',
		title: 'Most Loved',
		description: 'Customer favorites selected for everyday polish and occasion styling.',
		homepageLimit: 8
	}
] as const;

export type HomeSectionKey = (typeof HOME_SECTION_CONFIGS)[number]['key'];

export const HOME_SECTION_KEYS = HOME_SECTION_CONFIGS.map((section) => section.key);

export const getHomeSectionConfig = (key: string) =>
	HOME_SECTION_CONFIGS.find((section) => section.key === key);

export const isHomeSectionKey = (key: string): key is HomeSectionKey =>
	HOME_SECTION_KEYS.includes(key as HomeSectionKey);

export const homeSectionHref = (key: HomeSectionKey | string) => `/sections/${key}`;
