import { expect, test } from "@playwright/test";

test("renders the approved secure checkout with placeholders and cart navigation", async ({ page }) => {
  await page.goto("/checkout");

  const checkout = page.frameLocator('iframe[title="SleepExcellent approved secure checkout"]');
  await expect(checkout.getByRole("heading", { level: 2, name: /Shipping & Installation Address/ })).toBeVisible();
  await expect(checkout.locator('img[src="/product-placeholder.svg"]')).toHaveCount(2);
  await expect(checkout.getByRole("link", { name: "Back to Cart" })).toHaveAttribute("href", "/cart");
});

test("retains the bespoke configuration price and records a pending Razorpay order", async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("sleepExcellentBespokeMattress", JSON.stringify({ price: "₹16,236" }));
  });
  await page.goto("/checkout");
  const checkout = page.frameLocator('iframe[title="SleepExcellent approved secure checkout"]');
  await expect(checkout.locator("#bespoke-checkout-price")).toHaveText("₹16,236");
  page.on("dialog", (dialog) => dialog.dismiss());
  await checkout.locator("#razorpay-checkout-button").click();
  await expect
    .poll(() => page.evaluate(() => sessionStorage.getItem("sleepExcellentPendingOrder")))
    .toContain("Payment setup required");
});

test("matches the approved desktop secure checkout", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/checkout");
  await page.waitForTimeout(1500);
  await page.locator("#next-logo").evaluateAll((nodes) => nodes.forEach((node) => node.parentElement?.remove()));
  await expect(page).toHaveScreenshot("checkout-desktop.png", { animations: "disabled", caret: "hide" });
});
