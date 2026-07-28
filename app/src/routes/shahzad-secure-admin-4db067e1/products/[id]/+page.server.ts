import { setAdminFlash } from '$lib/server/admin-flash';
import prisma from '$lib/server/prisma';
import type { PageServerLoad, Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { parseProductForm, validateProductForm } from '$lib/server/admin-product-form';
import { deleteProductImageFiles, saveProductImageFiles } from '$lib/server/product-image-files';

export const load: PageServerLoad = async ({ params }) => {
	const product = await prisma.product.findUnique({
		where: { id: params.id },
		include: {
			images: { orderBy: { displayOrder: 'asc' } },
			variants: true,
			collections: true
		}
	});

	if (!product) {
		throw error(404, 'Product not found');
	}

	const allCollections = await prisma.collection.findMany({
		orderBy: { displayOrder: 'asc' }
	});

	return {
		product: {
			...product,
			price: Number(product.price),
			salePrice: product.salePrice ? Number(product.salePrice) : null
		},
		allCollections
	};
};

export const actions: Actions = {
	update: async ({ request, params, cookies }) => {
		const data = await request.formData();
		const product = parseProductForm(data);
		const validationError = validateProductForm(product);

		if (validationError) {
			return fail(400, { error: validationError });
		}

		const existing = await prisma.product.findUnique({
			where: { slug: product.slug }
		});

		if (existing && existing.id !== params.id) {
			return fail(400, { error: 'Product slug already exists. Change the title or slug.' });
		}

		try {
			const uploadedImageUrls = await saveProductImageFiles(data);
			const removeImageIds = data
				.getAll('removeImageIds')
				.map((value) => String(value).trim())
				.filter(Boolean);
			const imagesToRemove = removeImageIds.length
				? await prisma.productImage.findMany({
						where: {
							productId: params.id,
							id: { in: removeImageIds }
						},
						select: { id: true, url: true }
					})
				: [];

			await prisma.product.update({
				where: { id: params.id },
				data: {
					name: product.name,
					slug: product.slug,
					description: product.description,
					price: product.price,
					salePrice: product.salePrice,
					isActive: product.isActive,
					collections: {
						set: product.collectionIds.map((id) => ({ id }))
					}
				},
				select: { id: true }
			});

			if (imagesToRemove.length) {
				await prisma.productImage.deleteMany({
					where: {
						productId: params.id,
						id: { in: imagesToRemove.map((image) => image.id) }
					}
				});
				await deleteProductImageFiles(imagesToRemove.map((image) => image.url));
			}

			if (uploadedImageUrls.length) {
				const imageOrder = await prisma.productImage.aggregate({
					where: { productId: params.id },
					_max: { displayOrder: true }
				});
				const nextDisplayOrder = (imageOrder._max.displayOrder ?? -1) + 1;

				await prisma.productImage.createMany({
					data: uploadedImageUrls.map((url, index) => ({
						productId: params.id,
						url,
						altText: product.name,
						displayOrder: nextDisplayOrder + index
					}))
				});
			}

			await prisma.productVariant.deleteMany({
				where: { productId: params.id }
			});

			await prisma.productVariant.createMany({
				data: product.variants.map((variant) => ({
					...variant,
					productId: params.id
				}))
			});
		} catch (e) {
			return fail(500, {
				error: 'Failed to update product. Check duplicate SKU values or image files.'
			});
		}

		setAdminFlash(cookies, 'Product updated successfully.');
		throw redirect(303, `/abayiza-secure-admin-7k9x2p/products/${params.id}`);
	},

	delete: async ({ params, cookies }) => {
		try {
			await prisma.product.delete({
				where: { id: params.id }
			});
		} catch (e) {
			return fail(500, { error: 'Failed to delete product.' });
		}

		setAdminFlash(cookies, 'Product deleted successfully.');
		throw redirect(303, '/abayiza-secure-admin-7k9x2p/products');
	}
};
