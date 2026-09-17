import { expect, test } from "@playwright/test";

const viewports = [
  { name: "mobile", size: { width: 390, height: 844 } },
  { name: "tablet", size: { width: 768, height: 1024 } },
  { name: "desktop", size: { width: 1440, height: 960 } },
] as const;

for (const viewport of viewports) {
  test(`matches the ${viewport.name} approved Stitch homepage`, async ({ page }) => {
    await page.setViewportSize(viewport.size);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    await page.locator("#next-logo").evaluateAll((nodes) => {
      nodes.forEach((node) => node.parentElement?.remove());
    });
    await expect(page).toHaveScreenshot(`foundation-${viewport.name}.png`, {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.07,
    });
  });
}
