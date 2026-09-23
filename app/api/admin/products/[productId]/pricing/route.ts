import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/user";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { PRICING_SETTING_KEY } from "@/lib/catalog/pricing";
import type { PriceEntry, PricingManifest } from "@/lib/catalog/pricing-types";

async function canManageCatalog(userId: string) { const admin = createSupabaseAdminClient(); const { data } = await admin.from("profiles").select("email, role").eq("id", userId).maybeSingle(); return data?.role === "admin" || data?.role === "staff" || data?.email?.toLowerCase() === process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase(); }
const isNonNegativeInteger = (value: unknown): value is number => Number.isInteger(value) && (value as number) >= 0;
const validEntry = (entry: PriceEntry) => ["indicative_fixed", "indicative_range"].includes(entry.kind) && typeof entry.unit === "string" && entry.unit.length <= 40 && typeof entry.approved === "boolean" && (entry.kind !== "indicative_fixed" || isNonNegativeInteger(entry.amount_paise)) && (entry.kind !== "indicative_range" || (isNonNegativeInteger(entry.min_paise) && (entry.max_paise === null || entry.max_paise === undefined || (isNonNegativeInteger(entry.max_paise) && entry.max_paise >= entry.min_paise))));

export async function PATCH(request: Request, ctx: { params: Promise<{ productId: string }> }) {
  try {
    const user = await requireAuthenticatedUser(request); if (!(await canManageCatalog(user.id))) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    const { productId } = await ctx.params; const entry = await request.json() as PriceEntry;
    if (!validEntry(entry)) return NextResponse.json({ error: "INVALID_PRICING" }, { status: 400 });
    const admin = createSupabaseAdminClient(); const { data: product } = await admin.from("products").select("slug").eq("id", productId).maybeSingle(); if (!product) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    const { data: setting } = await admin.from("site_settings").select("value").eq("key", PRICING_SETTING_KEY).maybeSingle(); const manifest = ((setting?.value ?? {}) as PricingManifest); manifest[product.slug] = { ...entry, source: "admin" };
    const { error } = await admin.from("site_settings").upsert({ key: PRICING_SETTING_KEY, value: manifest }); if (error) throw error;
    if (entry.kind === "indicative_fixed" && typeof entry.amount_paise === "number") {
      const { error: variantError } = await admin.from("product_variants").update({ price_paise: entry.amount_paise }).eq("product_id", productId).eq("is_active", true);
      if (variantError) throw variantError;
    }
    return NextResponse.json({ entry: manifest[product.slug] });
  } catch (error) { if (error instanceof Error && error.message === "AUTH_REQUIRED") return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 }); return NextResponse.json({ error: "UPDATE_FAILED" }, { status: 500 }); }
}
