export function getFaviconUrl(url: string, size = 64) {
	const normalizedSize = Math.max(16, size);
	return `https://www.google.com/s2/favicons?sz=${normalizedSize}&domain_url=${encodeURIComponent(url)}`;
}
