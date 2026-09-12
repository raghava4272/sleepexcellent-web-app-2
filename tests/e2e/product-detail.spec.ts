import { expect, test } from "@playwright/test";

test("renders the approved Ortho Plus product detail with catalog price and image placeholders", async ({ page }) => {
  await page.goto("/products/ortho-plus-mattress");

  const detail = page.frameLocator('iframe[title="SleepExcellent approved Ortho Plus Mattress details"]');
  await expect(detail.getByRole("heading", { level: 1 })).toHaveText("Ortho Plus Mattress");
  await expect(detail.locator("#display-price")).toHaveText("₹16,395");
  await expect(detail.locator('#main-product-stage[src="/product-placeholder.svg"]')).toBeVisible();
});

test("matches the approved desktop product detail", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/products/ortho-plus-mattress");
  await page.waitForTimeout(1500);
  await page.locator("#next-logo").evaluateAll((nodes) => {
    nodes.forEach((node) => node.parentElement?.remove());
  });

  await expect(page).toHaveScreenshot("product-detail-desktop.png", {
    animations: "disabled",
    caret: "hide",
  });
});
