import type {
	FontSection,
	FontAssignmentMap,
	FontSizeMap,
	ImportedFont,
} from "../types";

export const DEFAULT_FONT_STACK =
	"system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

export const DEFAULT_FONT_SIZES: FontSizeMap = {
	clock: 48,
	search: 16,
	quickLinks: 14,
	settings: 14,
};

export function resolveFontFamily(
	section: FontSection,
	assignments: FontAssignmentMap,
	importedFonts: ImportedFont[],
): string {
	const assignedId = assignments[section];

	if (!assignedId || assignedId === "default") {
		return DEFAULT_FONT_STACK;
	}

	const font = importedFonts.find((f) => f.id === assignedId);
	if (!font) {
		return DEFAULT_FONT_STACK;
	}

	return `'${font.family}', ${DEFAULT_FONT_STACK}`;
}

export function getFontSize(section: FontSection, sizes: FontSizeMap): number {
	return sizes[section] || DEFAULT_FONT_SIZES[section];
}

export function getActiveFontStyles(importedFonts: ImportedFont[]): string {
	return importedFonts
		.map((font) => `@import url('${font.cssUrl}');`)
		.join("\n");
}

export function cleanupOrphanedAssignments(
	assignments: FontAssignmentMap,
	importedFonts: ImportedFont[],
): FontAssignmentMap {
	const validIds = new Set(importedFonts.map((f) => f.id));
	const cleaned: FontAssignmentMap = {} as FontAssignmentMap;

	for (const section of Object.keys(assignments) as FontSection[]) {
		const assignedId = assignments[section];
		if (assignedId === "default" || validIds.has(assignedId)) {
			cleaned[section] = assignedId;
		} else {
			cleaned[section] = "default";
		}
	}

	return cleaned;
}
