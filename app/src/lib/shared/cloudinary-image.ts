const UPLOAD_MARKER = '/image/upload/';

/**
 * Inserts Cloudinary delivery transforms (auto format/quality, width cap, auto DPR)
 * into a Cloudinary URL. Non-Cloudinary URLs (e.g. local /uploads/... fallback) pass through untouched.
 */
export const cloudinaryUrl = (url: string | null | undefined, width: number): string => {
	if (!url) return url ?? '';

	const markerIndex = url.indexOf(UPLOAD_MARKER);
	if (markerIndex === -1) return url;

	const insertAt = markerIndex + UPLOAD_MARKER.length;
	const transform = `f_auto,q_auto,dpr_auto,w_${width}/`;
	return `${url.slice(0, insertAt)}${transform}${url.slice(insertAt)}`;
};
