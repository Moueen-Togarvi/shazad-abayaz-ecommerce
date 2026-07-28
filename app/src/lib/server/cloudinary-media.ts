import { env } from '$env/dynamic/private';
import { createHash } from 'node:crypto';

type UploadFile = File & {
	arrayBuffer: () => Promise<ArrayBuffer>;
	name: string;
	size: number;
	type: string;
};

type CloudinaryUploadResponse = {
	secure_url?: string;
	public_id?: string;
	error?: { message?: string };
};

type CloudinaryDestroyResponse = {
	result?: string;
	error?: { message?: string };
};

const cloudinaryUrlConfig = () => {
	const raw = env.CLOUDINARY_URL?.trim();
	if (!raw) return null;

	try {
		const parsed = new URL(raw);
		return {
			cloudName: parsed.hostname,
			apiKey: decodeURIComponent(parsed.username),
			apiSecret: decodeURIComponent(parsed.password)
		};
	} catch {
		return null;
	}
};

const cloudName = () => env.CLOUDINARY_CLOUD_NAME?.trim() || cloudinaryUrlConfig()?.cloudName;
const apiKey = () => env.CLOUDINARY_API_KEY?.trim() || cloudinaryUrlConfig()?.apiKey;
const apiSecret = () => env.CLOUDINARY_API_SECRET?.trim() || cloudinaryUrlConfig()?.apiSecret;
const baseFolder = () => env.CLOUDINARY_FOLDER?.trim() || 'abayiza';

export const isCloudinaryConfigured = () => Boolean(cloudName() && apiKey() && apiSecret());

const signParams = (params: Record<string, string | number>) => {
	const payload = Object.keys(params)
		.sort()
		.map((key) => `${key}=${params[key]}`)
		.join('&');

	return createHash('sha1').update(`${payload}${apiSecret()}`).digest('hex');
};

export const uploadImageToCloudinary = async (file: UploadFile, folder: string) => {
	if (!isCloudinaryConfigured()) {
		throw new Error('Cloudinary is not configured.');
	}

	if (!file.type.startsWith('image/')) {
		throw new Error('Only image files are allowed.');
	}

	const timestamp = Math.floor(Date.now() / 1000);
	const targetFolder = `${baseFolder()}/${folder}`.replace(/^\/+|\/+$/g, '');
	const params = {
		folder: targetFolder,
		timestamp
	};

	const body = new FormData();
	body.set('file', new Blob([await file.arrayBuffer()], { type: file.type }), file.name);
	body.set('api_key', apiKey() || '');
	body.set('folder', targetFolder);
	body.set('timestamp', String(timestamp));
	body.set('signature', signParams(params));

	const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName()}/image/upload`, {
		method: 'POST',
		body
	});
	const json = (await response.json()) as CloudinaryUploadResponse;

	if (!response.ok || !json.secure_url) {
		throw new Error(json.error?.message || 'Cloudinary upload failed.');
	}

	return json.secure_url;
};

const publicIdFromUrl = (url: string) => {
	try {
		const parsed = new URL(url);
		if (!parsed.hostname.endsWith('cloudinary.com')) return null;

		const uploadIndex = parsed.pathname.indexOf('/image/upload/');
		if (uploadIndex === -1) return null;

		const afterUpload = parsed.pathname.slice(uploadIndex + '/image/upload/'.length);
		const segments = afterUpload.split('/').filter(Boolean);
		if (segments[0]?.startsWith('v') && /^v\d+$/.test(segments[0])) {
			segments.shift();
		}

		const last = segments.pop();
		if (!last) return null;

		segments.push(last.replace(/\.[a-z0-9]+$/i, ''));
		return segments.join('/');
	} catch {
		return null;
	}
};

export const deleteImageFromCloudinary = async (url: string) => {
	if (!isCloudinaryConfigured()) return false;

	const publicId = publicIdFromUrl(url);
	if (!publicId) return false;

	const timestamp = Math.floor(Date.now() / 1000);
	const params = {
		public_id: publicId,
		timestamp
	};

	const body = new FormData();
	body.set('public_id', publicId);
	body.set('api_key', apiKey() || '');
	body.set('timestamp', String(timestamp));
	body.set('signature', signParams(params));

	const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName()}/image/destroy`, {
		method: 'POST',
		body
	});
	const json = (await response.json()) as CloudinaryDestroyResponse;

	if (!response.ok) {
		throw new Error(json.error?.message || 'Cloudinary delete failed.');
	}

	return true;
};
