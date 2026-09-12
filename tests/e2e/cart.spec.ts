import { expect, test } from "@playwright/test";

test("renders the approved cart with Supabase-ready placeholders", async ({ page }) => {
  await page.goto("/cart");

  const cart = page.frameLocator('iframe[title="SleepExcellent approved shopping cart"]');
  await expect(cart.getByRole("heading", { level: 1 })).toContainText("Shopping Cart");
  await expect(cart.locator('img[src="/product-placeholder.svg"]')).toHaveCount(4);
  await expect(cart.getByRole("link", { name: "PROCEED TO CHECKOUT" })).toHaveAttribute("href", "/checkout");
});

test("carries a bespoke builder configuration into the cart", async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem(
      "sleepExcellentBespokeMattress",
      JSON.stringify({ dimensions: '78" × 60" × 8"', stratum: "MEMORY + SPRING", price: "₹16,236" }),
    );
  });
  await page.goto("/cart");
  const cart = page.frameLocator('iframe[title="SleepExcellent approved shopping cart"]');
  await expect(cart.locator("#bespoke-price")).toHaveText("₹16,236");
  await expect(cart.locator("#bespoke-dimensions")).toHaveText('78" × 60" × 8"');
  await expect(cart.locator("#bespoke-stratum")).toHaveText("MEMORY + SPRING");
});

test("matches the approved desktop shopping cart", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/cart");
  await page.waitForTimeout(1500);
  await page.locator("#next-logo").evaluateAll((nodes) => nodes.forEach((node) => node.parentElement?.remove()));
  await expect(page).toHaveScreenshot("cart-desktop.png", {
    animations: "disabled",
    caret: "hide",
    maxDiffPixelRatio: 0.01,
  });
});
