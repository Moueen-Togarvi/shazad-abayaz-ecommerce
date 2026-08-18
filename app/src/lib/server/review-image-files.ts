import {
	deleteImageFromCloudinary,
	isCloudinaryConfigured,
	uploadImageToCloudinary
} from '$lib/server/cloudinary-media';
import { isUploadFile, readValidatedImageFile } from '$lib/server/image-upload-validation';
import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

const uploadDir = () => path.join(process.cwd(), 'static', 'uploads', 'reviews');
const MAX_REVIEW_IMAGES_PER_REQUEST = 6;

export const saveReviewImageFiles = async (data: FormData) => {
	const files = data
		.getAll('images')
		.filter(isUploadFile)
		.filter((file) => file.size > 0);

	if (files.length === 0) return [];
	if (files.length > MAX_REVIEW_IMAGES_PER_REQUEST) {
		throw new Error(`You can upload up to ${MAX_REVIEW_IMAGES_PER_REQUEST} review images at once.`);
	}

	if (isCloudinaryConfigured()) {
		return Promise.all(files.map((file) => uploadImageToCloudinary(file, 'reviews')));
	}

	await mkdir(uploadDir(), { recursive: true });

	const urls: string[] = [];
	for (const file of files) {
		const { bytes, extension } = await readValidatedImageFile(file);
		const filename = `${Date.now()}-${randomUUID()}${extension}`;
		await writeFile(path.join(uploadDir(), filename), bytes);
		urls.push(`/uploads/reviews/${filename}`);
	}

	return urls;
};

export const deleteReviewImageFiles = async (urls: string[]) => {
	await Promise.all(
		urls.map(async (url) => {
			if (await deleteImageFromCloudinary(url)) return;

			const relativePath = url.replace(/^\/+/, '');
			if (!relativePath.startsWith('uploads/reviews/')) return;
			await unlink(path.join(process.cwd(), 'static', relativePath)).catch(() => {});
		})
	);
};
