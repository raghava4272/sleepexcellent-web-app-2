import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";

// Next's local form redirects use localhost; keep cookies on that same host.
test.use({ baseURL: "http://localhost:3000" });

test("signs into the account popup, opens the profile, and saves personal details", async ({ page }) => {
  test.skip(!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY, "Requires configured Supabase test access.");
  test.setTimeout(60000);
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false } });
  const email = `profile-qa-${randomUUID()}@sleepexcellent.test`;
  const password = `Qa-${randomUUID()}!`;
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { full_name: "Profile QA Customer" } });
  if (error || !data.user) throw new Error("Unable to create temporary customer for profile verification.");
  const orderId = randomUUID();
  const orderNumber = `QA-${randomUUID()}`;
  try {
    const { data: createdProfile } = await admin.from("profiles").select("id").eq("id", data.user.id).maybeSingle();
    expect(createdProfile, "New customer must have a profile record").not.toBeNull();
    const { data: product } = await admin.from("products").select("id, name").eq("slug", "ortho-plus-mattress").single();
    if (!product) throw new Error("Test mattress is missing from the catalogue.");
    const { error: orderError } = await admin.from("orders").insert({ id: orderId, order_number: orderNumber, user_id: data.user.id, subtotal_paise: 100000, total_paise: 100000, delivery_address: { recipient_name: "Profile QA Customer", line1: "QA test address", city: "Hyderabad", state: "Telangana", postal_code: "500001", phone: "9000000000" } });
    if (orderError) throw new Error("Unable to create temporary QA order.");
    const { error: itemError } = await admin.from("order_items").insert({ order_id: orderId, product_id: product.id, product_name: product.name, quantity: 1, unit_price_paise: 100000, line_total_paise: 100000, variant_snapshot: { title: "Single / 72 × 36 / 6 inches" } });
    if (itemError) throw new Error("Unable to create temporary QA order item.");
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto("/shop", { waitUntil: "load" });
    await page.getByRole("navigation", { name: "Store tools" }).getByRole("button", { name: "Account", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "Welcome back" });
    await dialog.getByLabel("Email address").fill(email);
    await dialog.getByLabel("Password", { exact: true }).fill(password);
    await dialog.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(page).toHaveURL(/\/account$/);
    await expect(page.getByRole("heading", { name: "My account", exact: true })).toBeVisible();
    await expect(page.getByText(email, { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Personal information", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Order history & tracking", exact: true })).toBeVisible();
    await page.getByRole("link", { name: "View order details →", exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/account/orders/${orderNumber}$`));
    await expect(page.getByRole("heading", { level: 1, name: `Order ${orderNumber}`, exact: true })).toBeVisible();
    await expect(page.getByText("Single / 72 × 36 / 6 inches · Qty 1", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Current status", exact: true })).toBeVisible();
    await page.getByRole("link", { name: "View product", exact: true }).click();
    await expect(page).toHaveURL(/\/products\/ortho-plus-mattress$/);
    await expect(page.getByRole("heading", { level: 1, name: "Ortho Plus Mattress", exact: true })).toBeVisible();
    await page.goto("/account", { waitUntil: "load" });
    await expect(page.getByRole("link", { name: "View product", exact: true })).toHaveAttribute("href", "/products/ortho-plus-mattress");
    await page.getByLabel("Full name", { exact: true }).fill("Updated QA Customer");
    await page.getByLabel("Phone", { exact: true }).fill("9000000000");
    await page.getByRole("button", { name: "Save details", exact: true }).click();
    await expect(page.getByRole("status")).toHaveText("Saved.");
    await page.goto("/shop", { waitUntil: "load" });
    await page.getByRole("navigation", { name: "Store tools" }).getByRole("button", { name: "Account", exact: true }).click();
    await expect(page).toHaveURL(/\/account$/);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByLabel("Full name", { exact: true })).toHaveValue("Updated QA Customer");
    await expect(page.getByLabel("Phone", { exact: true })).toHaveValue("9000000000");
    const call = page.getByRole("link", { name: "Call us", exact: true });
    await call.hover();
    await expect(call).toHaveCSS("color", "rgb(255, 255, 255)");
  } finally {
    const { error: orderCleanupError } = await admin.from("orders").delete().eq("id", orderId).eq("user_id", data.user.id);
    if (orderCleanupError) throw new Error("Unable to remove temporary QA order.");
    const { error: cleanupError } = await admin.auth.admin.deleteUser(data.user.id);
    if (cleanupError) throw new Error("Unable to remove the temporary profile QA customer.");
  }
});
