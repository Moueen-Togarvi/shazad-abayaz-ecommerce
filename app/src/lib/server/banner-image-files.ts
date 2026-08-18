import {
	deleteImageFromCloudinary,
	isCloudinaryConfigured,
	uploadImageToCloudinary
} from '$lib/server/cloudinary-media';
import { isUploadFile, readValidatedImageFile } from '$lib/server/image-upload-validation';
import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

const uploadDir = () => path.join(process.cwd(), 'static', 'uploads', 'banners');

export const saveBannerImageFile = async (file: FormDataEntryValue | null) => {
	if (!file || !isUploadFile(file) || file.size === 0) return null;

	if (isCloudinaryConfigured()) {
		return uploadImageToCloudinary(file, 'banners');
	}

	await mkdir(uploadDir(), { recursive: true });

	const { bytes, extension } = await readValidatedImageFile(file);
	const filename = `${Date.now()}-${randomUUID()}${extension}`;
	await writeFile(path.join(uploadDir(), filename), bytes);

	return `/uploads/banners/${filename}`;
};

export const deleteBannerImageFile = async (url: string) => {
	if (!url) return;
	if (await deleteImageFromCloudinary(url)) return;

	const relativePath = url.replace(/^\/+/, '');
	if (!relativePath.startsWith('uploads/banners/')) return;
	await unlink(path.join(process.cwd(), 'static', relativePath)).catch(() => {});
};
