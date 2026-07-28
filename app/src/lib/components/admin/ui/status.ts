/**
 * Single source of truth for admin status → { label, tone } mappings.
 * Kills the copy-pasted `statusClass` / `statusLabel` helpers that lived on every page.
 */

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export type StatusInfo = { label: string; tone: BadgeTone };

/** Order lifecycle status → friendly label + semantic tone. */
export const ORDER_STATUS: Record<string, StatusInfo> = {
	PENDING: { label: 'Pending', tone: 'warning' },
	PROCESSING: { label: 'In Progress', tone: 'info' },
	SHIPPED: { label: 'Shipped', tone: 'neutral' },
	DELIVERED: { label: 'Completed', tone: 'success' },
	CANCELLED: { label: 'Cancelled', tone: 'danger' }
};

/** Product status as surfaced in the product list. */
export const PRODUCT_STATUS: Record<string, StatusInfo> = {
	Active: { label: 'Active', tone: 'info' },
	Draft: { label: 'Draft', tone: 'warning' },
	'Out of Stock': { label: 'Out of Stock', tone: 'danger' }
};

export function orderStatus(status: string): StatusInfo {
	return ORDER_STATUS[status] ?? { label: status, tone: 'neutral' };
}

export function productStatus(status: string): StatusInfo {
	return PRODUCT_STATUS[status] ?? { label: status, tone: 'neutral' };
}
