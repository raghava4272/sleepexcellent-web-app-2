import { expect, test } from "@playwright/test";

test("renders the approved custom mattress builder and preserves its configuration controls", async ({ page }) => {
  await page.goto("/build-your-mattress", { waitUntil: "domcontentloaded" });

  const builder = page.frameLocator('iframe[title="SleepExcellent approved custom mattress builder"]');
  await expect(builder.getByRole("heading", { level: 1 })).toHaveText(
    "Make Your Own Mattress: Calibrated To Your Frame & Spine",
  );
  await expect(builder.locator("#display-final-price")).toHaveText("₹18,450");
  await builder.getByRole("button", { name: "Queen" }).click();
  await expect(builder.locator("#display-final-price")).toHaveText("₹16,236");
});

test("matches the approved desktop mattress builder", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/build-your-mattress", { waitUntil: "domcontentloaded" });
  await page.locator('iframe[title="SleepExcellent approved custom mattress builder"]').waitFor();
  await page.waitForTimeout(1500);
  await page.locator("#next-logo").evaluateAll((nodes) => {
    nodes.forEach((node) => node.parentElement?.remove());
  });

  await expect(page).toHaveScreenshot("mattress-builder-desktop.png", {
    animations: "disabled",
    caret: "hide",
    maxDiffPixelRatio: 0.01,
  });
});
