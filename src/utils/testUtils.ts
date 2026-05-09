import { parseGoogleFontUrl } from "./googleFonts";
import {
	cleanupOrphanedAssignments,
	resolveFontFamily,
	DEFAULT_FONT_STACK,
} from "./sectionTypography";

export function runGoogleFontsParserTests() {
	const tests = [
		{
			name: "Valid Google Fonts CSS URL with weight variants",
			url: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
			shouldPass: true,
			expectedFamily: "Roboto",
		},
		{
			name: "Valid Google Fonts CSS URL with plus-encoded family name",
			url: "https://fonts.googleapis.com/css?family=Open+Sans",
			shouldPass: true,
			expectedFamily: "Open Sans",
		},
		{
			name: "Valid Google Fonts CSS URL with multiple families",
			url: "https://fonts.googleapis.com/css?family=Roboto|Open+Sans",
			shouldPass: true,
			expectedFamily: "Roboto",
		},
		{
			name: "Invalid - Google Fonts specimen page",
			url: "https://fonts.google.com/specimen/Roboto",
			shouldPass: false,
		},
		{
			name: "Invalid - non-Google domain",
			url: "https://example.com/fonts.css",
			shouldPass: false,
		},
		{
			name: "Invalid - empty URL",
			url: "",
			shouldPass: false,
		},
		{
			name: "Invalid - malformed URL",
			url: "not-a-url",
			shouldPass: false,
		},
		{
			name: "Invalid - missing family parameter",
			url: "https://fonts.googleapis.com/css2",
			shouldPass: false,
		},
	];

	console.log("\n=== Google Fonts Parser Tests ===");

	let passed = 0;
	let failed = 0;

	for (const test of tests) {
		const result = parseGoogleFontUrl(test.url);
		const isValid = !("error" in result);

		if (isValid === test.shouldPass) {
			if (
				test.shouldPass &&
				!("error" in result) &&
				result.fonts[0]?.family === test.expectedFamily
			) {
				console.log(`✓ ${test.name}`);
				passed++;
			} else if (!test.shouldPass) {
				console.log(`✓ ${test.name}`);
				passed++;
			} else {
				const familyGot = !("error" in result) ? result.fonts[0]?.family || "N/A" : "N/A";
				console.log(
					`✗ ${test.name}: Expected family '${test.expectedFamily}', got '${familyGot}'`,
				);
				failed++;
			}
		} else {
			console.log(`✗ ${test.name}: Validation failed`);
			failed++;
		}
	}

	console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
	return failed === 0;
}

export function runTypographyTests() {
	console.log("=== Typography Utility Tests ===");

	let passed = 0;
	let failed = 0;

	const testFont = {
		id: "font-1",
		family: "Roboto",
		cssUrl: "https://fonts.googleapis.com/css?family=Roboto",
		source: "google-fonts" as const,
	};

	const importedFonts = [testFont];

	const dirtyAssignments = {
		clock: "font-1",
		search: "font-removed",
		quickLinks: "default",
		settings: "font-999",
	};

	const cleaned = cleanupOrphanedAssignments(dirtyAssignments, importedFonts);

	if (
		cleaned.clock === "font-1" &&
		cleaned.search === "default" &&
		cleaned.quickLinks === "default" &&
		cleaned.settings === "default"
	) {
		console.log("✓ Orphaned assignments cleaned correctly");
		passed++;
	} else {
		console.log("✗ Orphaned assignment cleanup failed");
		failed++;
	}

	const validAssignment = resolveFontFamily(
		"clock",
		{
			clock: "font-1",
			search: "default",
			quickLinks: "default",
			settings: "default",
		},
		importedFonts,
	);

	if (
		validAssignment.includes("'Roboto'") &&
		validAssignment.includes(DEFAULT_FONT_STACK)
	) {
		console.log("✓ Font resolution with valid assignment works");
		passed++;
	} else {
		console.log("✗ Font resolution with valid assignment failed");
		failed++;
	}

	const defaultAssignment = resolveFontFamily(
		"search",
		{
			clock: "font-1",
			search: "default",
			quickLinks: "default",
			settings: "default",
		},
		importedFonts,
	);

	if (defaultAssignment === DEFAULT_FONT_STACK) {
		console.log("✓ Font resolution with default assignment works");
		passed++;
	} else {
		console.log("✗ Font resolution with default assignment failed");
		failed++;
	}

	const missingAssignment = resolveFontFamily(
		"settings",
		{
			clock: "font-1",
			search: "default",
			quickLinks: "default",
			settings: "font-missing",
		},
		importedFonts,
	);

	if (missingAssignment === DEFAULT_FONT_STACK) {
		console.log("✓ Font resolution with missing font falls back correctly");
		passed++;
	} else {
		console.log("✗ Font resolution with missing font fallback failed");
		failed++;
	}

	console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
	return failed === 0;
}
