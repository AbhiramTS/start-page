export type Theme = "light" | "dark";

export interface Link {
	id: string;
	title: string;
	url: string;
	icon?: string;
	tags?: string[];
	isCustom: boolean;
}

export interface SearchEngine {
	name: string;
	url: string;
}

export interface ImportedFont {
	id: string;
	family: string;
	cssUrl: string;
	source: "google-fonts";
}

export type FontSection = "clock" | "search" | "quickLinks" | "settings";

export type FontAssignmentMap = Record<FontSection, string>;

export type FontSizeMap = Record<FontSection, number>;

export type DateTimeFormat = "12h" | "24h";

export interface UserPreferences {
	theme: Theme;
	quickLinks: Link[];
	searchEngines: SearchEngine[];
	defaultSearchEngineIndex: number;
	dateTimeFormat: DateTimeFormat;
	importedFonts: ImportedFont[];
	fontAssignments: FontAssignmentMap;
	fontSizes: FontSizeMap;
}
