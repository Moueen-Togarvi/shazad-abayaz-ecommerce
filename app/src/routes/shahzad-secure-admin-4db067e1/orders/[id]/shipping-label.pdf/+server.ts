import { buildOrderLabelPdf, loadOrderLabel } from '$lib/server/order-label';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const label = await loadOrderLabel(params.id);
	if (!label) throw error(404, 'Order not found');

	const pdf = await buildOrderLabelPdf(label);
	const filename = `${label.orderNumber.replace(/[^a-zA-Z0-9_-]/g, '-')}-shipping-label.pdf`;

	return new Response(Buffer.from(pdf), {
		headers: {
			'content-type': 'application/pdf',
			'content-disposition': `attachment; filename="${filename}"`,
			'cache-control': 'private, no-store, max-age=0'
		}
	});
};
