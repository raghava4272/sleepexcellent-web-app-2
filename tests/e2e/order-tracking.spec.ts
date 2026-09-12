import { expect, test } from "@playwright/test";

test("renders approved order tracking with Supabase-ready placeholders", async ({ page }) => {
  await page.goto("/account/orders/SE-98421");
  const tracking = page.frameLocator('iframe[title="SleepExcellent approved order tracking"]');
  await expect(tracking.getByRole("heading", { level: 1 })).toContainText("Estimated Delivery");
  await expect(tracking.locator('img[src="/product-placeholder.svg"]')).toHaveCount(2);
  await tracking.getByRole("button", { name: "Cart" }).click();
  await expect(page).toHaveURL(/\/cart$/);
});

test("displays the pending checkout order in the approved tracker", async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem(
      "sleepExcellentPendingOrder",
      JSON.stringify({ number: "SE-2026-8821", total: "₹38,100", status: "Payment setup required" }),
    );
    sessionStorage.setItem("sleepExcellentBespokeMattress", JSON.stringify({ price: "₹16,236" }));
  });
  await page.goto("/account/orders/SE-2026-8821");
  const tracking = page.frameLocator('iframe[title="SleepExcellent approved order tracking"]');
  await expect(tracking.locator("#tracking-order-summary")).toContainText("SE-2026-8821");
  await expect(tracking.locator("#tracking-bespoke-price")).toHaveText("₹16,236");
  await expect(tracking.locator("#tracking-total-paid")).toHaveText("₹38,100");
});

test("matches the approved desktop order tracker", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/account/orders/SE-98421");
  await page.waitForTimeout(1500);
  await page.locator("#next-logo").evaluateAll((nodes) => nodes.forEach((node) => node.parentElement?.remove()));
  await expect(page).toHaveScreenshot("order-tracking-desktop.png", {
    animations: "disabled",
    caret: "hide",
    maxDiffPixelRatio: 0.01,
  });
});
