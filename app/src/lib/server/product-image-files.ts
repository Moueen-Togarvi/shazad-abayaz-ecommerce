import {
	deleteImageFromCloudinary,
	isCloudinaryConfigured,
	uploadImageToCloudinary
} from '$lib/server/cloudinary-media';
import {
	isUploadFile,
	readValidatedImageFile
} from '$lib/server/image-upload-validation';
import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

const uploadDir = () => path.join(process.cwd(), 'static', 'uploads', 'products');
const MAX_PRODUCT_IMAGES_PER_REQUEST = 12;

export type SavedProductImage = {
	url: string;
	color: string | null;
};

export const saveProductImageFiles = async (data: FormData): Promise<SavedProductImage[]> => {
	const allEntries = data.getAll('images').filter(isUploadFile);
	// Colours are submitted one-per-picked-file, in the same order, so we must
	// index into them before dropping empty file slots.
	const colorEntries = data.getAll('imageColors').map((value) => String(value).trim());

	const files = allEntries
		.map((file, index) => ({ file, color: colorEntries[index] || null }))
		.filter((entry) => entry.file.size > 0);

	if (files.length === 0) return [];
	if (files.length > MAX_PRODUCT_IMAGES_PER_REQUEST) {
		throw new Error(
			`You can upload up to ${MAX_PRODUCT_IMAGES_PER_REQUEST} product images at once.`
		);
	}

	if (isCloudinaryConfigured()) {
		return Promise.all(
			files.map(async (entry) => ({
				url: await uploadImageToCloudinary(entry.file, 'products'),
				color: entry.color
			}))
		);
	}

	await mkdir(uploadDir(), { recursive: true });

	const saved: SavedProductImage[] = [];
	for (const entry of files) {
		const { bytes, extension } = await readValidatedImageFile(entry.file);
		const filename = `${Date.now()}-${randomUUID()}${extension}`;
		await writeFile(path.join(uploadDir(), filename), bytes);
		saved.push({ url: `/uploads/products/${filename}`, color: entry.color });
	}

	return saved;
};

export const deleteProductImageFiles = async (urls: string[]) => {
	await Promise.all(
		urls.map(async (url) => {
			if (await deleteImageFromCloudinary(url)) return;

			const relativePath = url.replace(/^\/+/, '');
			if (!relativePath.startsWith('uploads/products/')) return;
			await unlink(path.join(process.cwd(), 'static', relativePath)).catch(() => {});
		})
	);
};
