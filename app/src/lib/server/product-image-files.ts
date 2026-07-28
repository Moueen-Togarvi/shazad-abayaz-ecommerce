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

const uploadDir = () => path.join(process.cwd(), 'static', 'uploads', 'products');

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

export const saveProductImageFiles = async (data: FormData) => {
	const files = data
		.getAll('images')
		.filter(isUploadFile)
		.filter((file) => file.size > 0);

	if (files.length === 0) return [];

	if (isCloudinaryConfigured()) {
		return Promise.all(files.map((file) => uploadImageToCloudinary(file, 'products')));
	}

	await mkdir(uploadDir(), { recursive: true });

	const urls: string[] = [];
	for (const file of files) {
		if (!file.type.startsWith('image/')) {
			throw new Error('Only image files are allowed.');
		}

		const filename = `${Date.now()}-${randomUUID()}${imageExtension(file)}`;
		const bytes = Buffer.from(await file.arrayBuffer());
		await writeFile(path.join(uploadDir(), filename), bytes);
		urls.push(`/uploads/products/${filename}`);
	}

	return urls;
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
