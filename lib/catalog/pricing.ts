import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { PriceEntry, PricingManifest } from "./pricing-types";
export type { PriceEntry, PricingManifest } from "./pricing-types";
export const PRICING_SETTING_KEY = "catalogue_pricing_v1";

export async function getPricingManifest(): Promise<PricingManifest> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin.from("site_settings").select("value").eq("key", PRICING_SETTING_KEY).maybeSingle();
  return (data?.value && typeof data.value === "object" ? data.value : {}) as PricingManifest;
}

export function priceLabel(entry?: PriceEntry) {
  if (!entry) return null;
  const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
  if (entry.kind === "indicative_fixed" && typeof entry.amount_paise === "number") return `Indicative ${currency.format(entry.amount_paise / 100)}`;
  if (entry.kind === "indicative_range" && typeof entry.min_paise === "number") return `Indicative ${currency.format(entry.min_paise / 100)}${entry.max_paise ? ` – ${currency.format(entry.max_paise / 100)}` : "+"} ${entry.unit}`;
  return null;
}
