import { test, expect } from "@playwright/test";

test.describe("Shared Preferences State", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:4173");
	});

	test("multiple preference updates should not overwrite each other", async ({
		page,
		context,
	}) => {
		const newPage = await context.newPage();
		await newPage.goto("http://localhost:4173");

		const getLocalStorage = async (p: any) => {
			return await p.evaluate(() => {
				const stored = localStorage.getItem("user-preferences");
				return stored ? JSON.parse(stored) : null;
			});
		};

		await newPage.waitForLoadState("networkidle");
		await newPage.waitForTimeout(500);

		const initialPrefs = await getLocalStorage(newPage);
		console.log("Initial preferences:", JSON.stringify(initialPrefs, null, 2));

		const themeToggle = newPage.locator('[aria-label="Toggle dark/light"]');
		await themeToggle.click();
		await newPage.waitForTimeout(200);

		const afterTheme = await getLocalStorage(newPage);
		console.log("After theme toggle:", JSON.stringify(afterTheme, null, 2));
		expect(afterTheme.theme).not.toBe(initialPrefs.theme);

		const searchEngineSelector = newPage
			.locator('.search-engine-selector, [data-testid="search-engine-selector"]')
			.first();
		const searchEngineExists = (await searchEngineSelector.count()) > 0;

		if (searchEngineExists) {
			await searchEngineSelector.click();
			await newPage.waitForTimeout(200);
		}

		const afterBoth = await getLocalStorage(newPage);
		console.log("After both updates:", JSON.stringify(afterBoth, null, 2));

		expect(afterBoth.theme).toBe(afterTheme.theme);
		expect(afterBoth.quickLinks).toEqual(initialPrefs.quickLinks);
		expect(afterBoth.searchEngines).toBeDefined();

		console.log(
			"Verification passed: theme change persisted and other fields intact",
		);

		await newPage.close();
	});

	test("theme toggle persists correctly", async ({ page }) => {
		await page.waitForLoadState("networkidle");
		await page.waitForTimeout(500);

		const initialTheme = await page.evaluate(() => {
			const stored = localStorage.getItem("user-preferences");
			return stored ? JSON.parse(stored).theme : null;
		});

		const themeToggle = page.locator('[aria-label="Toggle dark/light"]');
		await themeToggle.click();
		await page.waitForTimeout(200);

		const newTheme = await page.evaluate(() => {
			const stored = localStorage.getItem("user-preferences");
			return stored ? JSON.parse(stored).theme : null;
		});

		expect(newTheme).not.toBe(initialTheme);
		expect(["light", "dark"]).toContain(newTheme);

		await page.reload();
		await page.waitForLoadState("networkidle");
		await page.waitForTimeout(500);

		const reloadedTheme = await page.evaluate(() => {
			const stored = localStorage.getItem("user-preferences");
			return stored ? JSON.parse(stored).theme : null;
		});

		expect(reloadedTheme).toBe(newTheme);
		console.log("Theme persisted across reload:", newTheme);
	});
});
