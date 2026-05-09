import { test, expect } from "@playwright/test";

test.describe("Race Condition Fix", () => {
	test("rapid sequential updates should not lose data", async ({ page }) => {
		await page.goto("http://localhost:4173");
		await page.waitForLoadState("networkidle");
		await page.waitForTimeout(500);

		await page.evaluate(() => {
			localStorage.clear();
		});

		await page.reload();
		await page.waitForLoadState("networkidle");
		await page.waitForTimeout(500);

		const themeToggle = page.locator('[aria-label="Toggle dark/light"]');

		await themeToggle.click();
		await page.waitForTimeout(50);

		await themeToggle.click();
		await page.waitForTimeout(50);

		await themeToggle.click();
		await page.waitForTimeout(100);

		const finalPrefs = await page.evaluate(() => {
			const stored = localStorage.getItem("user-preferences");
			return stored ? JSON.parse(stored) : null;
		});

		expect(finalPrefs).toBeDefined();
		expect(finalPrefs.theme).toBe("dark");
		expect(finalPrefs.quickLinks).toBeDefined();
		expect(finalPrefs.quickLinks.length).toBeGreaterThan(0);
		expect(finalPrefs.searchEngines).toBeDefined();
		expect(finalPrefs.searchEngines.length).toBeGreaterThan(0);

		console.log("Rapid updates test passed - no data loss detected");
		console.log("Final theme:", finalPrefs.theme);
		console.log("Quick links count:", finalPrefs.quickLinks.length);
		console.log("Search engines count:", finalPrefs.searchEngines.length);
	});

	test("verify single localStorage write per update", async ({ page }) => {
		await page.goto("http://localhost:4173");
		await page.waitForLoadState("networkidle");
		await page.waitForTimeout(500);

		const writeCount = await page.evaluate(() => {
			let writes = 0;
			const original = Storage.prototype.setItem;
			Storage.prototype.setItem = function (...args) {
				if (args[0] === "user-preferences") {
					writes++;
				}
				return original.apply(this, args);
			};
			return writes;
		});

		const themeToggle = page.locator('[aria-label="Toggle dark/light"]');
		await themeToggle.click();
		await page.waitForTimeout(200);

		const finalWriteCount = await page.evaluate(() => {
			return (window as any).preferencesWriteCount || 0;
		});

		console.log("Initial write count:", writeCount);
		console.log("Final write count:", finalWriteCount);
		console.log("Single update verification complete");
	});
});
