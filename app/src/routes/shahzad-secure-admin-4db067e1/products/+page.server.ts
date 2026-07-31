import { setAdminFlash } from '$lib/server/admin-flash';
import prisma from '$lib/server/prisma';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const products = await prisma.product.findMany({
		include: {
			collections: true,
			variants: true,
			images: { orderBy: { displayOrder: 'asc' } }
		},
		orderBy: { createdAt: 'desc' }
	});

	const serializedProducts = products.map((p: any) => ({
		...p,
		price: Number(p.price),
		salePrice: p.salePrice ? Number(p.salePrice) : null,
		totalInventory: p.variants.reduce((acc: number, v: any) => acc + v.stockCount, 0),
		status: !p.isActive
			? 'Draft'
			: p.variants.reduce((acc: number, v: any) => acc + v.stockCount, 0) <= 0
				? 'Out of Stock'
				: 'Active'
	}));

	return {
		products: serializedProducts
	};
};

export const actions: Actions = {
	delete: async ({ request, cookies }) => {
		const data = await request.formData();
		const id = String(data.get('id') ?? '');

		if (!id) {
			return fail(400, { error: 'Product was not found.' });
		}

		try {
			await prisma.product.delete({
				where: { id }
			});
		} catch {
			return fail(500, { error: 'Failed to delete product.' });
		}

		setAdminFlash(cookies, 'Product deleted successfully.');
		throw redirect(303, '/shahzad-secure-admin-4db067e1/products');
	},

	bulkDelete: async ({ request, cookies }) => {
		const data = await request.formData();
		const ids = data
			.getAll('ids')
			.map((value) => String(value).trim())
			.filter(Boolean);

		if (!ids.length) {
			return fail(400, { error: 'No products were selected.' });
		}

		let count = 0;
		try {
			const result = await prisma.product.deleteMany({
				where: { id: { in: ids } }
			});
			count = result.count;
		} catch {
			return fail(500, { error: 'Failed to delete selected products.' });
		}

		setAdminFlash(cookies, `${count} product${count === 1 ? '' : 's'} deleted successfully.`);
		throw redirect(303, '/shahzad-secure-admin-4db067e1/products');
	}
};
