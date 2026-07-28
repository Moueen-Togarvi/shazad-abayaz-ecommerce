import {
	deleteImageFromCloudinary,
	isCloudinaryConfigured,
	uploadImageToCloudinary
} from '$lib/server/cloudinary-media';
import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

type UploadFile = File & {
	arrayBuffer: () => Promise<ArrayBuffer>;
	name: string;
	size: number;
	type: string;
};

const allowedExtensions = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.webp']);
const extensionByType: Record<string, string> = {
	'image/avif': '.avif',
	'image/gif': '.gif',
	'image/jpeg': '.jpg',
	'image/png': '.png',
	'image/webp': '.webp'
};

const uploadDir = () => path.join(process.cwd(), 'static', 'uploads', 'banners');

const isUploadFile = (value: FormDataEntryValue): value is UploadFile =>
	typeof value === 'object' &&
	value !== null &&
	'arrayBuffer' in value &&
	'name' in value &&
	'size' in value;

const imageExtension = (file: UploadFile) => {
	const fromName = path.extname(file.name).toLowerCase();
	if (allowedExtensions.has(fromName)) return fromName;
	return extensionByType[file.type] ?? '.jpg';
};

export const saveBannerImageFile = async (file: FormDataEntryValue | null) => {
	if (!file || !isUploadFile(file) || file.size === 0) return null;

	if (!file.type.startsWith('image/')) {
		throw new Error('Only image files are allowed.');
	}

	if (isCloudinaryConfigured()) {
		return uploadImageToCloudinary(file, 'banners');
	}

	await mkdir(uploadDir(), { recursive: true });

	const filename = `${Date.now()}-${randomUUID()}${imageExtension(file)}`;
	const bytes = Buffer.from(await file.arrayBuffer());
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
