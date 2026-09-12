import { expect, test } from "@playwright/test";

test("renders the approved catalog with supplied mattress data and image placeholders", async ({ page }) => {
  await page.goto("/shop");

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
  await page.goto("/shop");
  await page.waitForTimeout(1500);
  await page.locator("#next-logo").evaluateAll((nodes) => {
    nodes.forEach((node) => node.parentElement?.remove());
  });

  await expect(page).toHaveScreenshot("shop-desktop.png", {
    animations: "disabled",
    caret: "hide",
  });
});
