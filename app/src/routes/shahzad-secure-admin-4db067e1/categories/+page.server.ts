import { setAdminFlash } from '$lib/server/admin-flash';
import { deleteCategoryImageFiles, saveCategoryImageFile } from '$lib/server/category-image-files';
import prisma from '$lib/server/prisma';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const toSlug = (value: string) =>
	value
		.trim()
		.toLowerCase()
		.replace(/&/g, 'and')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

const readCategoryForm = (data: FormData) => {
	const name = String(data.get('name') ?? '').trim();
	const isVisible = data.get('isVisible') === 'on';

	return {
		name,
		slug: toSlug(name),
		description: null,
		displayOrder: 0,
		isVisible
	};
};

export const load: PageServerLoad = async () => {
	const categories = await prisma.collection.findMany({
		orderBy: { name: 'asc' },
		include: {
			_count: {
				select: { products: true }
			}
		}
	});

	return { categories };
};

export const actions: Actions = {
	create: async ({ request, cookies }) => {
		const data = await request.formData();
		const category = readCategoryForm(data);

		if (!category.name || !category.slug) {
			return fail(400, {
				createError: 'Category name is required.'
			});
		}

		const existing = await prisma.collection.findUnique({
			where: { slug: category.slug }
		});

		if (existing) {
			return fail(400, {
				createError: 'Category slug already exists. Change the name or slug.'
			});
		}

		try {
			const imageUrl = await saveCategoryImageFile(data);
			await prisma.collection.create({
				data: {
					...category,
					imageUrl
				}
			});
		} catch {
			return fail(500, {
				createError: 'Failed to create category. Check the image file and try again.'
			});
		}

		setAdminFlash(cookies, 'Category added successfully.');
		throw redirect(303, '/abayiza-secure-admin-7k9x2p/categories');
	},

	update: async ({ request, cookies }) => {
		const data = await request.formData();
		const id = String(data.get('id') ?? '');
		const category = readCategoryForm(data);

		if (!id || !category.name || !category.slug) {
			return fail(400, {
				updateError: 'Category name is required.'
			});
		}

		const existing = await prisma.collection.findUnique({
			where: { slug: category.slug }
		});

		if (existing && existing.id !== id) {
			return fail(400, {
				updateError: 'Category slug already exists. Use a different slug.'
			});
		}

		try {
			const currentCategory = await prisma.collection.findUnique({
				where: { id },
				select: { imageUrl: true }
			});
			const uploadedImageUrl = await saveCategoryImageFile(data);
			const removeImage = data.get('removeImage') === 'on';
			const nextImageUrl =
				uploadedImageUrl || (removeImage ? null : currentCategory?.imageUrl || null);

			await prisma.collection.update({
				where: { id },
				data: {
					...category,
					imageUrl: nextImageUrl
				}
			});

			if ((uploadedImageUrl || removeImage) && currentCategory?.imageUrl) {
				await deleteCategoryImageFiles([currentCategory.imageUrl]);
			}
		} catch {
			return fail(500, {
				updateError: 'Failed to update category. Check the image file and try again.'
			});
		}

		setAdminFlash(cookies, 'Category updated successfully.');
		throw redirect(303, '/abayiza-secure-admin-7k9x2p/categories');
	},

	delete: async ({ request, cookies }) => {
		const data = await request.formData();
		const id = String(data.get('id') ?? '');

		if (!id) {
			return fail(400, {
				deleteError: 'Category was not found.'
			});
		}

		try {
			const category = await prisma.collection.findUnique({
				where: { id },
				select: { imageUrl: true }
			});
			await prisma.collection.delete({
				where: { id }
			});
			if (category?.imageUrl) {
				await deleteCategoryImageFiles([category.imageUrl]);
			}
		} catch {
			return fail(500, {
				deleteError: 'Failed to delete category.'
			});
		}

		setAdminFlash(cookies, 'Category deleted successfully.');
		throw redirect(303, '/abayiza-secure-admin-7k9x2p/categories');
	}
};
