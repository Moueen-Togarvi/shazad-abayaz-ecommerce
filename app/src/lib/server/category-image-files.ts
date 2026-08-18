import {
	deleteImageFromCloudinary,
	isCloudinaryConfigured,
	uploadImageToCloudinary
} from '$lib/server/cloudinary-media';
import { isUploadFile, readValidatedImageFile } from '$lib/server/image-upload-validation';
import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

const uploadDir = () => path.join(process.cwd(), 'static', 'uploads', 'categories');

export const saveCategoryImageFile = async (data: FormData) => {
	const file = data.get('image');

	if (!file || !isUploadFile(file) || file.size === 0) return null;

	if (isCloudinaryConfigured()) {
		return uploadImageToCloudinary(file, 'categories');
	}

	await mkdir(uploadDir(), { recursive: true });

	const { bytes, extension } = await readValidatedImageFile(file);
	const filename = `${Date.now()}-${randomUUID()}${extension}`;
	await writeFile(path.join(uploadDir(), filename), bytes);

	return `/uploads/categories/${filename}`;
};

export const deleteCategoryImageFiles = async (urls: string[]) => {
	await Promise.all(
		urls.map(async (url) => {
			if (await deleteImageFromCloudinary(url)) return;

			const relativePath = url.replace(/^\/+/, '');
			if (!relativePath.startsWith('uploads/categories/')) return;
			await unlink(path.join(process.cwd(), 'static', relativePath)).catch(() => {});
		})
	);
};
