export type UploadFile = File & {
	arrayBuffer: () => Promise<ArrayBuffer>;
	name: string;
	size: number;
	type: string;
};

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const extensionByType: Record<string, string> = {
	'image/avif': '.avif',
	'image/gif': '.gif',
	'image/jpeg': '.jpg',
	'image/png': '.png',
	'image/webp': '.webp'
};

export const isUploadFile = (value: FormDataEntryValue): value is UploadFile =>
	typeof value === 'object' &&
	value !== null &&
	'arrayBuffer' in value &&
	'name' in value &&
	'size' in value &&
	'type' in value;

const hasValidSignature = (bytes: Buffer, type: string) => {
	if (type === 'image/jpeg')
		return bytes.length >= 3 && bytes.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
	if (type === 'image/png')
		return (
			bytes.length >= 8 &&
			bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
		);
	if (type === 'image/gif') {
		const signature = bytes.subarray(0, 6).toString('ascii');
		return signature === 'GIF87a' || signature === 'GIF89a';
	}
	if (type === 'image/webp')
		return (
			bytes.length >= 12 &&
			bytes.subarray(0, 4).toString('ascii') === 'RIFF' &&
			bytes.subarray(8, 12).toString('ascii') === 'WEBP'
		);
	if (type === 'image/avif') {
		const brand = bytes.subarray(8, 12).toString('ascii');
		return (
			bytes.length >= 12 &&
			bytes.subarray(4, 8).toString('ascii') === 'ftyp' &&
			['avif', 'avis'].includes(brand)
		);
	}
	return false;
};

export const readValidatedImageFile = async (file: UploadFile) => {
	const extension = extensionByType[file.type];
	if (!extension) throw new Error('Only AVIF, GIF, JPEG, PNG, and WebP images are allowed.');
	if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) {
		throw new Error('Each image must be 10 MB or smaller.');
	}

	const bytes = Buffer.from(await file.arrayBuffer());
	if (bytes.length !== file.size || !hasValidSignature(bytes, file.type)) {
		throw new Error('The uploaded file is not a valid image.');
	}

	return { bytes, extension };
};
