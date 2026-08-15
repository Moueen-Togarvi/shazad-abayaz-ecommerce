import { buildPrintableOrderLabelHtml, loadOrderLabel } from '$lib/server/order-label';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const label = await loadOrderLabel(params.id);
	if (!label) throw error(404, 'Order not found');

	return new Response(await buildPrintableOrderLabelHtml(label), {
		headers: {
			'content-type': 'text/html; charset=utf-8',
			'cache-control': 'private, no-store, max-age=0'
		}
	});
};
