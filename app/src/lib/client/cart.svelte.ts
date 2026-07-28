export type CartItem = {
	id: string; // Can be a combination of productId and variantId
	productId: string;
	variantId?: string;
	name: string;
	price: number;
	quantity: number;
	image: string;
	color?: string;
	size?: string;
};

export function createCart() {
	let items = $state<CartItem[]>([]);

	// Ensure localStorage is only accessed on client-side
	if (typeof window !== 'undefined') {
		const stored = localStorage.getItem('abayiza_cart');
		if (stored) {
			try {
				items = JSON.parse(stored);
			} catch (e) {}
		}
	}

	function save() {
		if (typeof window !== 'undefined') {
			localStorage.setItem('abayiza_cart', JSON.stringify(items));
		}
	}

	return {
		get items() {
			return items;
		},
		get totalItems() {
			return items.reduce((acc, item) => acc + item.quantity, 0);
		},
		get subtotal() {
			return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
		},
		addItem(newItem: CartItem) {
			const existingIndex = items.findIndex((i) => i.id === newItem.id);
			if (existingIndex >= 0) {
				items[existingIndex].quantity += newItem.quantity;
			} else {
				items.push(newItem);
			}
			save();
		},
		removeItem(id: string) {
			items = items.filter((item) => item.id !== id);
			save();
		},
		updateQuantity(id: string, quantity: number) {
			if (quantity <= 0) {
				this.removeItem(id);
				return;
			}
			const existingIndex = items.findIndex((i) => i.id === id);
			if (existingIndex >= 0) {
				items[existingIndex].quantity = quantity;
			}
			save();
		},
		clear() {
			items = [];
			save();
		}
	};
}

export const cart = createCart();
