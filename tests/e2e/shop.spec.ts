import { expect, test } from "@playwright/test";

for (const viewport of [
  { name: "desktop", width: 1440, height: 960 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`opens the mattress category in the main page at ${viewport.name} width`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const home = page.frameLocator(`iframe[title="SleepExcellent approved ${viewport.name} homepage"]`);
    await home.locator('a.group[href="/shop"]').first().click();

    await expect(page).toHaveURL(/\/shop$/);
    await expect(page.locator(".storefront-header")).toHaveCount(1);
    const frame = page.locator('iframe[title="SleepExcellent approved product listing"]');
    await expect.poll(async () => (await frame.boundingBox())?.height ?? 0).toBeGreaterThan(500);
    const catalog = page.frameLocator('iframe[title="SleepExcellent approved product listing"]');
    await expect(catalog.getByRole("heading", { level: 1 })).toHaveText("Orthopedic & Ergonomic Mattresses");
    await catalog.locator("#product-grid > article").first().locator("button.bg-primary").click();
    await expect(page).toHaveURL(/\/products\/ortho-plus-mattress$/);
    await expect(page.getByRole("heading", { level: 1, name: "Ortho Plus Mattress" })).toBeVisible();
  });
}

test("renders the approved catalog with supplied mattress data and image placeholders", async ({ page }) => {
  await page.goto("/shop", { waitUntil: "domcontentloaded" });

  const catalog = page.frameLocator('iframe[title="SleepExcellent approved product listing"]');
  await expect(catalog.getByRole("heading", { level: 1 })).toHaveText(
    "Orthopedic & Ergonomic Mattresses",
  );
  await expect(
    catalog.getByRole("heading", { exact: true, level: 3, name: "Foam Mattress" }),
  ).toBeVisible();
  await expect(catalog.locator('img[src="/product-placeholder.svg"]')).toHaveCount(10);
});

test("matches the approved desktop product listing", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/shop", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.locator("#next-logo").evaluateAll((nodes) => {
    nodes.forEach((node) => node.parentElement?.remove());
  });

  await expect(page).toHaveScreenshot("shop-desktop.png", {
    animations: "disabled",
    caret: "hide",
  });
});
