import { setAdminFlash } from '$lib/server/admin-flash';
import { deleteReviewImageFiles, saveReviewImageFiles } from '$lib/server/review-image-files';
import prisma from '$lib/server/prisma';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const reviewPhotos = await prisma.reviewPhoto.findMany({
		orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }]
	});

	return {
		reviewPhotos: reviewPhotos.map((photo) => ({
			id: photo.id,
			url: photo.url,
			displayOrder: photo.displayOrder,
			isVisible: photo.isVisible,
			createdAt: photo.createdAt.toISOString()
		}))
	};
};

export const actions: Actions = {
	upload: async ({ request, cookies }) => {
		const data = await request.formData();

		let imageUrls: string[];
		try {
			imageUrls = await saveReviewImageFiles(data);
		} catch {
			return fail(400, { error: 'Only image files are allowed.' });
		}

		if (!imageUrls.length) {
			return fail(400, { error: 'Please choose at least one review image.' });
		}

		const imageOrder = await prisma.reviewPhoto.aggregate({
			_max: { displayOrder: true }
		});
		const nextDisplayOrder = (imageOrder._max.displayOrder ?? -1) + 1;

		await prisma.reviewPhoto.createMany({
			data: imageUrls.map((url, index) => ({
				url,
				displayOrder: nextDisplayOrder + index,
				isVisible: true
			}))
		});

		setAdminFlash(
			cookies,
			`${imageUrls.length} review photo${imageUrls.length === 1 ? '' : 's'} uploaded successfully.`
		);
		throw redirect(303, '/abayiza-secure-admin-7k9x2p/reviews');
	},

	toggle: async ({ request, cookies }) => {
		const data = await request.formData();
		const id = String(data.get('id') || '');
		const isVisible = data.get('isVisible') === 'true';

		if (!id) return fail(400, { error: 'Review photo was not found.' });

		await prisma.reviewPhoto.update({
			where: { id },
			data: { isVisible }
		});

		setAdminFlash(
			cookies,
			isVisible ? 'Review photo shown on storefront.' : 'Review photo hidden from storefront.'
		);
		throw redirect(303, '/abayiza-secure-admin-7k9x2p/reviews');
	},

	delete: async ({ request, cookies }) => {
		const data = await request.formData();
		const id = String(data.get('id') || '');

		if (!id) return fail(400, { error: 'Review photo was not found.' });

		const photo = await prisma.reviewPhoto.findUnique({
			where: { id },
			select: { url: true }
		});

		if (!photo) return fail(400, { error: 'Review photo was not found.' });

		await prisma.reviewPhoto.delete({ where: { id } });
		await deleteReviewImageFiles([photo.url]);

		setAdminFlash(cookies, 'Review photo deleted successfully.');
		throw redirect(303, '/abayiza-secure-admin-7k9x2p/reviews');
	}
};
