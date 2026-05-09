export interface ParsedGoogleFont {
	family: string;
	cssUrl: string;
}

export interface GoogleFontParseError {
	error: string;
}

export type GoogleFontParseResult =
	| { fonts: ParsedGoogleFont[] }
	| GoogleFontParseError;

function buildFontFromSpec(familySpec: string): ParsedGoogleFont | null {
	const trimmed = familySpec.trim();
	if (!trimmed) {
		return null;
	}

	const familyPart = trimmed.split(":")[0]?.trim();
	const family = familyPart?.replace(/\+/g, " ");
	if (!family) {
		return null;
	}

	const params = new URLSearchParams();
	params.set("family", trimmed.replace(/\s+/g, "+"));
	params.set("display", "swap");

	return {
		family,
		cssUrl: `https://fonts.googleapis.com/css2?${params.toString()}`,
	};
}

function dedupeFonts(fonts: ParsedGoogleFont[]): ParsedGoogleFont[] {
	const seen = new Set<string>();
	const deduped: ParsedGoogleFont[] = [];

	for (const font of fonts) {
		const key = font.family.toLowerCase();
		if (seen.has(key)) {
			continue;
		}
		seen.add(key);
		deduped.push(font);
	}

	return deduped;
}

export function parseGoogleFontUrl(url: string): GoogleFontParseResult {
	const trimmed = url.trim();

	if (!trimmed) {
		return { error: "URL cannot be empty" };
	}

	let parsedUrl: URL;
	try {
		parsedUrl = new URL(trimmed);
	} catch {
		return { error: "Invalid URL format" };
	}

	if (parsedUrl.hostname === "fonts.googleapis.com") {
		if (!parsedUrl.pathname.startsWith("/css")) {
			return {
				error: "URL must be a Google Fonts CSS stylesheet (path starts with /css)",
			};
		}

		const familySpecs = parsedUrl.searchParams
			.getAll("family")
			.flatMap((familyGroup) => familyGroup.split("|"))
			.map((spec) => spec.trim())
			.filter(Boolean);

		if (familySpecs.length === 0) {
			return { error: "URL must contain at least one 'family' parameter" };
		}

		const fonts = dedupeFonts(
			familySpecs
				.map(buildFontFromSpec)
				.filter((font): font is ParsedGoogleFont => font !== null),
		);

		if (fonts.length === 0) {
			return { error: "Could not extract font family name" };
		}

		return { fonts };
	}

	if (parsedUrl.hostname === "fonts.google.com" && parsedUrl.pathname === "/share") {
		const selection = parsedUrl.searchParams.get("selection.family");
		if (!selection) {
			return { error: "Share URL must contain a 'selection.family' parameter" };
		}

		const familySpecs = selection
			.split("|")
			.map((spec) => spec.trim())
			.filter(Boolean);

		if (familySpecs.length === 0) {
			return { error: "Share URL does not contain any font families" };
		}

		const fonts = dedupeFonts(
			familySpecs
				.map(buildFontFromSpec)
				.filter((font): font is ParsedGoogleFont => font !== null),
		);

		if (fonts.length === 0) {
			return { error: "Could not extract font family name" };
		}

		return { fonts };
	}

	return { error: "Only fonts.googleapis.com CSS URLs or fonts.google.com/share URLs are allowed" };
}

export function isValidGoogleFontUrl(url: string): boolean {
	const result = parseGoogleFontUrl(url);
	return !("error" in result) && result.fonts.length > 0;
}
