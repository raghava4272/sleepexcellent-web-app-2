export type PriceEntry = {
  kind: "indicative_fixed" | "indicative_range";
  source: "price_catalogue_2026" | "interior_market_guide_2026" | "admin";
  approved: boolean;
  unit: string;
  configuration?: string;
  amount_paise?: number;
  min_paise?: number;
  max_paise?: number | null;
  typical_min_paise?: number;
  typical_max_paise?: number | null;
  tier?: string;
  assumption?: string;
};
export type PricingManifest = Record<string, PriceEntry>;
