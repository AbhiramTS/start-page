import { useState, useEffect, useCallback } from "react";
import type {
	UserPreferences,
	Theme,
	Link,
	SearchEngine,
	ImportedFont,
	FontSection,
	FontSizeMap,
	DateTimeFormat,
} from "../types";
import { parseGoogleFontUrl } from "../utils/googleFonts";
import {
	cleanupOrphanedAssignments,
	DEFAULT_FONT_SIZES,
} from "../utils/sectionTypography";

const STORAGE_KEY = "user-preferences";

const DEFAULT_LINKS: Link[] = [
	{
		id: "1",
		title: "GitHub",
		url: "https://github.com",
		icon: "🐙",
		tags: ["dev"],
		isCustom: false,
	},
	{
		id: "2",
		title: "Gmail",
		url: "https://mail.google.com",
		icon: "📧",
		tags: ["mail"],
		isCustom: false,
	},
	{
		id: "3",
		title: "YouTube",
		url: "https://youtube.com",
		icon: "▶️",
		tags: ["media"],
		isCustom: false,
	},
	{
		id: "4",
		title: "Twitter",
		url: "https://twitter.com",
		icon: "🐦",
		tags: ["social"],
		isCustom: false,
	},
	{
		id: "5",
		title: "NSE India",
		url: "https://nseindia.com",
		icon: "📈",
		tags: ["finance"],
		isCustom: false,
	},
	{
		id: "6",
		title: "Claude",
		url: "https://claude.ai",
		icon: "🤖",
		tags: ["ai"],
		isCustom: false,
	},
	{
		id: "7",
		title: "Vercel",
		url: "https://vercel.com",
		icon: "🚀",
		tags: ["dev"],
		isCustom: false,
	},
	{
		id: "8",
		title: "Linear",
		url: "https://linear.app",
		icon: "📋",
		tags: ["work"],
		isCustom: false,
	},
];

const DEFAULT_SEARCH_ENGINES: SearchEngine[] = [
	{ name: "Google", url: "https://google.com/search?q=" },
	{ name: "DDG", url: "https://duckduckgo.com/?q=" },
	{ name: "Bing", url: "https://bing.com/search?q=" },
];

function getDefaultTheme(): Theme {
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function createDefaultPreferences(): UserPreferences {
	return {
		theme: getDefaultTheme(),
		quickLinks: DEFAULT_LINKS,
		searchEngines: DEFAULT_SEARCH_ENGINES,
		defaultSearchEngineIndex: 0,
		dateTimeFormat: "12h",
		importedFonts: [],
		fontAssignments: {
			clock: "default",
			search: "default",
			quickLinks: "default",
			settings: "default",
		},
		fontSizes: { ...DEFAULT_FONT_SIZES },
	};
}

function migrateOldPreferences(): Partial<UserPreferences> {
	const migrated: Partial<UserPreferences> = {};

	try {
		const oldTheme = localStorage.getItem("theme-preference");
		if (oldTheme === "light" || oldTheme === "dark") {
			migrated.theme = oldTheme;
		}
	} catch (e) {
		console.error("Failed to migrate theme preference:", e);
	}

	try {
		const oldLinks = localStorage.getItem("custom-links");
		if (oldLinks) {
			migrated.quickLinks = JSON.parse(oldLinks);
		}
	} catch (e) {
		console.error("Failed to migrate custom links:", e);
	}

	return migrated;
}

function loadPreferences(): UserPreferences {
	const normalizeFontSize = (
		value: unknown,
		fallback: number,
	): number => {
		if (typeof value === "number" && Number.isFinite(value)) {
			return value;
		}
		if (typeof value === "string") {
			const parsed = Number.parseFloat(value);
			if (Number.isFinite(parsed)) {
				return parsed;
			}
		}
		return fallback;
	};

	const normalizeFontSizes = (
		fontSizes: Partial<Record<FontSection, unknown>> | undefined,
	): FontSizeMap => ({
		clock: normalizeFontSize(fontSizes?.clock, DEFAULT_FONT_SIZES.clock),
		search: normalizeFontSize(fontSizes?.search, DEFAULT_FONT_SIZES.search),
		quickLinks: normalizeFontSize(
			fontSizes?.quickLinks,
			DEFAULT_FONT_SIZES.quickLinks,
		),
		settings: normalizeFontSize(fontSizes?.settings, DEFAULT_FONT_SIZES.settings),
	});

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored) as UserPreferences;

			const cleaned = {
				...parsed,
				fontSizes: normalizeFontSizes(
					parsed.fontSizes as Partial<Record<FontSection, unknown>>,
				),
				fontAssignments: cleanupOrphanedAssignments(
					parsed.fontAssignments || {},
					parsed.importedFonts || [],
				),
			};

			return {
				...createDefaultPreferences(),
				...cleaned,
			};
		}
	} catch (e) {
		console.error("Failed to load preferences:", e);
	}

	const defaults = createDefaultPreferences();
	const migrated = migrateOldPreferences();

	return { ...defaults, ...migrated };
}

function savePreferences(prefs: UserPreferences): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
	} catch (e) {
		console.error("Failed to save preferences:", e);
	}
}

export function usePreferences() {
	const [preferences, setPreferences] =
		useState<UserPreferences>(loadPreferences);

	useEffect(() => {
		savePreferences(preferences);
	}, [preferences]);

	const updateTheme = useCallback((theme: Theme) => {
		setPreferences((prev) => ({ ...prev, theme }));
	}, []);

	const updateQuickLinks = useCallback((quickLinks: Link[]) => {
		setPreferences((prev) => ({ ...prev, quickLinks }));
	}, []);

	const updateSearchEngines = useCallback((searchEngines: SearchEngine[]) => {
		setPreferences((prev) => ({ ...prev, searchEngines }));
	}, []);

	const updateDefaultSearchEngineIndex = useCallback((index: number) => {
		setPreferences((prev) => ({ ...prev, defaultSearchEngineIndex: index }));
	}, []);

	const updateDateTimeFormat = useCallback((format: DateTimeFormat) => {
		setPreferences((prev) => ({ ...prev, dateTimeFormat: format }));
	}, []);

	const importFont = useCallback((cssUrl: string): boolean => {
		const result = parseGoogleFontUrl(cssUrl);
		if ("error" in result) {
			return false;
		}

		setPreferences((prev) => {
			const newFonts = result.fonts.filter(
				(font) =>
					!prev.importedFonts.some(
						(existing) =>
							existing.cssUrl === font.cssUrl || existing.family === font.family,
					),
			);

			if (newFonts.length === 0) {
				return prev;
			}

			const imported = newFonts.map<ImportedFont>((font) => ({
				id:
					crypto.randomUUID?.() ||
					`${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
				family: font.family,
				cssUrl: font.cssUrl,
				source: "google-fonts",
			}));

			return {
				...prev,
				importedFonts: [...prev.importedFonts, ...imported],
			};
		});

		return true;
	}, []);

	const removeFont = useCallback((fontId: string) => {
		setPreferences((prev) => {
			const updatedFonts = prev.importedFonts.filter((f) => f.id !== fontId);
			const cleanedAssignments = cleanupOrphanedAssignments(
				prev.fontAssignments,
				updatedFonts,
			);

			return {
				...prev,
				importedFonts: updatedFonts,
				fontAssignments: cleanedAssignments,
			};
		});
	}, []);

	const assignFont = useCallback((section: FontSection, fontId: string) => {
		setPreferences((prev) => ({
			...prev,
			fontAssignments: {
				...prev.fontAssignments,
				[section]: fontId,
			},
		}));
	}, []);

	const updateFontSize = useCallback((section: FontSection, size: number) => {
		setPreferences((prev) => ({
			...prev,
			fontSizes: {
				...prev.fontSizes,
				[section]: size,
			},
		}));
	}, []);

	const resetToDefaults = useCallback(() => {
		setPreferences(createDefaultPreferences());
	}, []);

	return {
		preferences,
		updateTheme,
		updateQuickLinks,
		updateSearchEngines,
		updateDefaultSearchEngineIndex,
		updateDateTimeFormat,
		importFont,
		removeFont,
		assignFont,
		updateFontSize,
		resetToDefaults,
	};
}
