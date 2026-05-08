import { useState } from "react";
import { getFaviconUrl } from "../utils/favicon";

interface SiteIconProps {
	url: string;
	label: string;
	className?: string;
	size?: number;
	fallbackGlyph?: string;
}

export function SiteIcon({
	url,
	label,
	className,
	size = 20,
	fallbackGlyph,
}: SiteIconProps) {
	const [failed, setFailed] = useState(false);
	const fallback = (fallbackGlyph || label.trim()[0] || "?").toUpperCase();

	if (failed) {
		return (
			<span className={className} aria-hidden="true">
				{fallback}
			</span>
		);
	}

	return (
		<img
			className={className}
			src={getFaviconUrl(url, size)}
			alt=""
			aria-hidden="true"
			loading="lazy"
			decoding="async"
			onError={() => setFailed(true)}
		/>
	);
}
