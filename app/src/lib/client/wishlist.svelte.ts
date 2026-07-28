export type WishlistItem = {
	id: string;
	slug: string;
	name: string;
	price: number;
	salePrice?: number | null;
	image: string;
	category?: string;
	color?: string;
	size?: string;
	description?: string;
};

const STORAGE_KEY = 'abayiza_wishlist';

const normalizeItem = (item: WishlistItem): WishlistItem => ({
	...item,
	id: String(item.id),
	slug: item.slug || String(item.id),
	name: item.name || 'Abayiza abaya',
	price: Number(item.price || item.salePrice || 0),
	salePrice: item.salePrice ? Number(item.salePrice) : null,
	image: item.image || '/image.png'
});

export function createWishlist() {
	let items = $state<WishlistItem[]>([]);

	if (typeof window !== 'undefined') {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				if (Array.isArray(parsed)) items = parsed.map(normalizeItem);
			} catch {
				items = [];
			}
		}
	}

	function save() {
		if (typeof window !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
		}
	}

	return {
		get items() {
			return items;
		},
		get totalItems() {
			return items.length;
		},
		has(id: string | null | undefined) {
			return items.some((item) => item.id === String(id || ''));
		},
		addItem(item: WishlistItem) {
			const nextItem = normalizeItem(item);
			if (!nextItem.id || this.has(nextItem.id)) return;
			items.push(nextItem);
			save();
		},
		removeItem(id: string) {
			items = items.filter((item) => item.id !== String(id));
			save();
		},
		toggle(item: WishlistItem) {
			if (this.has(item.id)) {
				this.removeItem(item.id);
			} else {
				this.addItem(item);
			}
		},
		clear() {
			items = [];
			save();
		}
	};
}

export const wishlist = createWishlist();
