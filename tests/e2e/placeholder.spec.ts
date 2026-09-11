import { expect, test } from "@playwright/test";

test("renders the Phase 0 placeholder", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "A better night is being built.",
  );
});
