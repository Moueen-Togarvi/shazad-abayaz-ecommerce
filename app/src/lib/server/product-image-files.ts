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
		if (!entry.file.type.startsWith('image/')) {
			throw new Error('Only image files are allowed.');
		}

		const filename = `${Date.now()}-${randomUUID()}${imageExtension(entry.file)}`;
		const bytes = Buffer.from(await entry.file.arrayBuffer());
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
