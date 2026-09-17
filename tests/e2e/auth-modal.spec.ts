import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("opens the storefront login popup and switches to signup without leaving the current page", async ({ page }) => {
  await page.goto("/?auth=login");

  const dialog = page.getByRole("dialog", { name: "Welcome back" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel("Email address")).toBeFocused();
  await dialog.getByRole("button", { name: "Create an account" }).click();

  await expect(page).toHaveURL(/\?auth=signup$/);
  await expect(page.getByRole("dialog", { name: "Create your account" })).toBeVisible();
});

test("keeps direct auth routes as a fallback and protects customer checkout", async ({ page }) => {
  await page.goto("/auth/login?next=%2Faccount");
  await expect(page.getByRole("heading", { name: "Welcome back." })).toBeVisible();

  await page.goto("/checkout");
  await expect(page).toHaveURL(/\/auth\/login\?next=\/checkout$/);
});

for (const viewport of [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 960 },
]) {
  test(`keeps the public collection routes usable at ${viewport.name} width`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    for (const path of ["/", "/shop", "/products/ortho-plus-mattress", "/interiors", "/interiors/tv-units", "/interiors/kitchen", "/interiors/ceilings", "/build-your-mattress", "/favorites"]) {
      await page.goto(path);
      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.getByLabel("Contact options")).toBeVisible();
    }
  });
}
