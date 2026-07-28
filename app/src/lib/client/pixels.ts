import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';

declare global {
	interface Window {
		fbq?: (...args: any[]) => void;
		ttq?: {
			page?: () => void;
			track?: (event: string, payload?: Record<string, unknown>) => void;
		};
	}
}

type PixelPayload = Record<string, unknown>;
type PixelEventOptions = {
	eventId?: string;
};
type CartLikeItem = {
	productId?: string;
	id?: string;
	name?: string;
	price?: number;
	quantity?: number;
};

export const metaPixelId = (env.PUBLIC_META_PIXEL_ID || '').trim();
export const tikTokPixelId = (env.PUBLIC_TIKTOK_PIXEL_ID || '').trim();

export function pixelsEnabled() {
	return Boolean(metaPixelId || tikTokPixelId);
}

export function trackPageView() {
	if (!browser) return;

	window.fbq?.('track', 'PageView');
	window.ttq?.page?.();
}

function toNumber(value: unknown, fallback = 0) {
	const numberValue = Number(value ?? fallback);
	return Number.isFinite(numberValue) ? numberValue : fallback;
}

function normalizeContents(contents: unknown) {
	if (!Array.isArray(contents)) return undefined;

	return contents
		.map((item) => {
			if (!item || typeof item !== 'object') return null;
			const record = item as Record<string, unknown>;
			const id = String(
				record.id ?? record.content_id ?? record.item_id ?? record.product_id ?? ''
			).trim();

			if (!id) return null;

			return {
				id,
				quantity: Math.max(1, toNumber(record.quantity, 1)),
				item_price: toNumber(record.item_price ?? record.price, 0)
			};
		})
		.filter(Boolean);
}

function normalizeMetaPayload(payload: PixelPayload = {}) {
	const contents = normalizeContents(payload.contents);
	const contentIds = Array.isArray(payload.content_ids)
		? payload.content_ids.map((id) => String(id)).filter(Boolean)
		: contents?.map((item: any) => item.id);

	return {
		...payload,
		...(contentIds?.length ? { content_ids: contentIds } : {}),
		...(contents?.length ? { contents } : {}),
		...(payload.value !== undefined ? { value: toNumber(payload.value) } : {}),
		...(payload.currency ? { currency: String(payload.currency).toUpperCase() } : {}),
		...(payload.num_items !== undefined ? { num_items: toNumber(payload.num_items) } : {})
	};
}

function primaryVariant(item: any) {
	return (
		item?.variants?.find((variant: any) => Number(variant.stockCount || 0) > 0) ||
		item?.variants?.[0]
	);
}

function productPrice(item: any) {
	return toNumber(item?.salePrice || item?.price, 0);
}

function productCategory(item: any) {
	return item?.collections
		?.map((collection: any) => collection.name)
		.filter(Boolean)
		.join(', ');
}

function eventId(event: string, stableId?: string) {
	const suffix =
		stableId || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
	return `abayiza.${event}.${suffix}`;
}

export function productPixelPayload(product: any, quantity = 1): PixelPayload {
	const variant = primaryVariant(product);
	const price = productPrice(product);
	const productId = String(product?.id || variant?.productId || '').trim();
	const safeQuantity = Math.max(1, toNumber(quantity, 1));

	return {
		content_name: product?.name || "Shahzad Abaya's product",
		content_category: productCategory(product) || undefined,
		content_type: 'product',
		content_ids: productId ? [productId] : [],
		contents: productId
			? [
					{
						id: productId,
						quantity: safeQuantity,
						item_price: price
					}
				]
			: [],
		value: price * safeQuantity,
		currency: 'PKR'
	};
}

export function cartPixelPayload(items: CartLikeItem[], value?: number): PixelPayload {
	const contents = items.map((item) => ({
		id: String(item.productId || item.id || ''),
		quantity: Math.max(1, toNumber(item.quantity, 1)),
		item_price: toNumber(item.price, 0)
	}));
	const subtotal = contents.reduce((total, item) => total + item.item_price * item.quantity, 0);

	return {
		content_type: 'product',
		content_ids: contents.map((item) => item.id).filter(Boolean),
		contents,
		num_items: contents.reduce((total, item) => total + item.quantity, 0),
		value: toNumber(value, subtotal),
		currency: 'PKR'
	};
}

export function trackMetaEvent(
	event: string,
	payload?: PixelPayload,
	options: PixelEventOptions = {}
) {
	if (!browser) return;

	const normalizedPayload = normalizeMetaPayload(payload);
	if (options.eventId) {
		window.fbq?.('track', event, normalizedPayload, { eventID: options.eventId });
		return;
	}

	window.fbq?.('track', event, normalizedPayload);
}

export function trackTikTokEvent(event: string, payload?: PixelPayload) {
	if (!browser) return;
	window.ttq?.track?.(event, payload);
}

export function trackProductView(payload: PixelPayload) {
	trackMetaEvent('ViewContent', payload);
	trackTikTokEvent('ViewContent', payload);
}

export function trackAddToCart(payload: PixelPayload) {
	trackMetaEvent('AddToCart', payload);
	trackTikTokEvent('AddToCart', payload);
}

export function trackAddToWishlist(payload: PixelPayload) {
	trackMetaEvent('AddToWishlist', payload);
	trackTikTokEvent('AddToWishlist', payload);
}

export function trackSearch(searchString: string, resultIds: string[] = []) {
	const payload = {
		search_string: searchString,
		content_ids: resultIds,
		content_type: 'product'
	};
	trackMetaEvent('Search', payload);
	trackTikTokEvent('Search', payload);
}

export function trackInitiateCheckout(payload: PixelPayload) {
	trackMetaEvent('InitiateCheckout', payload);
	trackTikTokEvent('InitiateCheckout', payload);
}

export function trackPurchase(payload: PixelPayload, options: PixelEventOptions = {}) {
	trackMetaEvent('Purchase', payload, options);
	trackTikTokEvent('CompletePayment', payload);
}

export function trackPurchaseOnce(orderId: string, payload: PixelPayload) {
	if (!browser || !orderId) return;

	const storageKey = `shahzad_pixel_purchase_${orderId}`;
	if (sessionStorage.getItem(storageKey)) return;

	trackPurchase(payload, { eventId: eventId('Purchase', orderId) });
	sessionStorage.setItem(storageKey, '1');
}
