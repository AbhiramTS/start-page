import { test, expect } from "@playwright/test";

test.describe("Settings panel", () => {
	test("shows real settings sections instead of placeholder text", async ({
		page,
	}) => {
		await page.goto("http://localhost:4173");
		await page.waitForLoadState("networkidle");

		await page.locator('button[aria-label="Settings"]').click();

		const panel = page.locator("#settings-panel");
		await expect(panel).toHaveClass(/open/);
		await expect(panel).not.toContainText("to be implemented");

		await expect(panel).toContainText("Theme");
		await expect(panel).toContainText("Quick Links");
		await expect(panel).toContainText("Search Engine");
		await expect(panel).toContainText("Date");
		await expect(panel).toContainText("Font");
	});

	test("provides a sample Google Fonts URL for import", async ({ page }) => {
		await page.goto("http://localhost:4173");
		await page.waitForLoadState("networkidle");

		await page.locator('button[aria-label="Settings"]').click();

		const sampleButton = page.locator('button:has-text("Use sample URL")');
		await expect(sampleButton).toBeVisible();
		await sampleButton.click();

		const fontInput = page.locator("#font-url");
		await expect(fontInput).toHaveValue(
			"https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap",
		);
	});

	test("imports all families from a Google Fonts share URL", async ({ page }) => {
		await page.goto("http://localhost:4173");
		await page.waitForLoadState("networkidle");

		await page.locator('button[aria-label="Settings"]').click();

		const shareUrl =
			"https://fonts.google.com/share?selection.family=Angkor|BJCree:wght@400;500;600;700|Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900|Roboto:ital,wght@0,100..900;1,100..900";

		await page.locator("#font-url").fill(shareUrl);
		await page.locator("#settings-panel .sp-section:has-text('Fonts') .sp-btn:has-text('Import')").click();

		const fontFamilies = page.locator(
			"#settings-panel .sp-section:has(.sp-section-title:text-is('Fonts')) .sp-list-text strong",
		);
		await expect(fontFamilies).toContainText([
			"Angkor",
			"BJCree",
			"Poppins",
			"Roboto",
		]);
	});

	test("keeps font dropdown options readable in dark mode", async ({ page }) => {
		await page.goto("http://localhost:4173");
		await page.waitForLoadState("networkidle");
		await page.locator('button[aria-label="Settings"]').click();

		await page.locator("#settings-panel .sp-section:has-text('Theme') button:has-text('Dark')").click();
		await page.locator('button:has-text("Use sample URL")').click();
		await page.locator("#settings-panel .sp-section:has-text('Fonts') .sp-btn:has-text('Import')").click();

		const styles = await page.locator(".sp-typography-row .sp-select").first().evaluate((el) => {
			const select = el as HTMLSelectElement;
			const selectStyle = getComputedStyle(select);
			const optionStyle = getComputedStyle(select.options[0]);
			return {
				selectColor: selectStyle.color,
				optionColor: optionStyle.color,
				optionBg: optionStyle.backgroundColor,
			};
		});

		expect(styles.selectColor).toBe("rgb(230, 230, 234)");
		expect(styles.optionColor).toBe("rgb(230, 230, 234)");
		expect(styles.optionBg).not.toBe("rgba(0, 0, 0, 0)");
	});

	test("uses numeric number input for section font size and persists numbers", async ({ page }) => {
		await page.goto("http://localhost:4173");
		await page.waitForLoadState("networkidle");
		await page.locator('button[aria-label="Settings"]').click();

		const searchSizeInput = page.locator(".sp-typography-row").nth(1).locator("input");
		await expect(searchSizeInput).toHaveAttribute("type", "number");
		await searchSizeInput.fill("22");

		await page.reload();
		await page.waitForLoadState("networkidle");

		const stored = await page.evaluate(() => {
			const raw = localStorage.getItem("user-preferences");
			return raw ? JSON.parse(raw) : null;
		});

		expect(typeof stored.fontSizes.search).toBe("number");
		expect(stored.fontSizes.search).toBe(22);
	});
});
