const UPLOAD_MARKER = '/image/upload/';
const LOCAL_IMAGE_PATTERN = /\.(?:png|jpe?g)(?=\?|#|$)/i;

const localWebpUrl = (url: string): string => {
	if (!url.startsWith('/') || url.startsWith('//') || url.startsWith('/uploads/')) return url;
	return LOCAL_IMAGE_PATTERN.test(url) ? url.replace(LOCAL_IMAGE_PATTERN, '.webp') : url;
};

/**
 * Inserts Cloudinary delivery transforms (auto format/quality, width cap, auto DPR)
 * into a Cloudinary URL. Bundled local images use pre-compressed WebP counterparts,
 * while user-uploaded local fallbacks pass through untouched.
 */
export const cloudinaryUrl = (url: string | null | undefined, width: number): string => {
	if (!url) return url ?? '';

	const markerIndex = url.indexOf(UPLOAD_MARKER);
	if (markerIndex === -1) return localWebpUrl(url);

	const insertAt = markerIndex + UPLOAD_MARKER.length;
	const transform = `f_auto,q_auto,dpr_auto,w_${width}/`;
	return `${url.slice(0, insertAt)}${transform}${url.slice(insertAt)}`;
};
