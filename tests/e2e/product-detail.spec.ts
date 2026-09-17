import { expect, test } from "@playwright/test";

test("renders the live Ortho Plus product detail with its catalogue description and variant picker", async ({ page }) => {
  await page.goto("/products/ortho-plus-mattress", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { level: 1, name: "Ortho Plus Mattress" })).toBeVisible();
  await expect(page.getByText("Indicative ₹16,395")).toBeVisible();
  await expect(page.getByText(/An upgraded version of our ortho mattress/).first()).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Choose your mattress" })).toBeVisible();
});

test("requires variant confirmation before allowing the mattress to be added to cart", async ({ page }) => {
  await page.goto("/products/ortho-plus-mattress", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("button", { name: "Add to cart" })).toHaveCount(0);
  await page.getByRole("button", { name: /Ultra.*Premium/ }).click();
  await page.getByRole("button", { name: "Queen" }).click();
  await page.getByRole("button", { name: "78 × 36 in" }).click();
  await page.getByRole("button", { name: "8 in" }).click();
  await expect(page.getByText("Ultra · Queen · 78 × 36 in · 8 in")).toBeVisible();
  await page.getByRole("button", { name: "Confirm variant" }).click();
  await expect(page.getByRole("button", { name: "Variant confirmed ✓" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Add to cart" })).toBeVisible();
});
