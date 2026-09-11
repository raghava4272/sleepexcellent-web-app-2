import { expect, test } from "@playwright/test";

test("renders the approved Stitch desktop homepage", async ({ page }) => {
  await page.goto("/");
  const homepage = page.frameLocator('iframe[title="SleepExcellent approved desktop homepage"]');
  await expect(homepage.locator('img[src="/logo.png"]')).toBeVisible();
  await expect(homepage.getByRole("heading", { level: 2 })).toHaveText(
    /Better sleep\.\s*Architected around you\./,
  );
});

test("uses the approved mobile Stitch homepage at mobile widths", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const homepage = page.frameLocator('iframe[title="SleepExcellent approved mobile homepage"]');
  await expect(homepage.locator('img[src="/logo.png"]')).toBeVisible();
  await expect(homepage.getByRole("heading", { level: 1 })).toHaveText(
    /Better Sleep\.\s*Architected Around You\./,
  );
});
