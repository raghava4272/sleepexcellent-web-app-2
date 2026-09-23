#!/usr/bin/env node
/** Apply supplied 2026 prices plus realistic fixed estimates for unmatched products. */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
const apply = process.argv.includes("--apply");
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) { const m = line.match(/^([A-Z0-9_]+)=(.*)$/); if (m) process.env[m[1]] = m[2].replace(/^"|"$/g, ""); }

const sourcePrices = {
  "ortho-mattress":[12699,"72 × 75 × 6 in"],"ortho-plus-mattress":[16395,"72 × 75 × 6 in"],"latex-mattress":[15975,"72 × 75 × 6 in"],"latex-pro":[28315,"72 × 75 × 6 in"],"pocketed-spring-mattress":[15595,"72 × 75 × 6 in"],"bonnell-spring-mattress":[17222,"72 × 75 × 6 in"],"foam-mattress":[14475,"72 × 75 × 6 in"],"memory-foam-mattress":[16619,"72 × 75 × 6 in"],"feel-good-mattress":[26929,"72 × 75 × 6 in"],"shim-mattress":[2119,"72 × 75 × 1 in"],
  "l-shape-sofa":[63500,"3-seater + lounger"],"indian-traditional-sofa":[49800,"5-seater"],"head-rest-model-sofa":[59600,"6-seater"],"chester-model-sofa":[86900,"5-seater"],"fiber-back-sofa":[63650,"5-seater"],"camel-back-sofa":[56590,"5-seater"],"premium-sofa":[75900,"3 + 2 + 1 configuration"],"cabin-style-sofa":[62300,"L-shape"],"sectional-sofa":[66900,"6-seater"],"u-shape-sofa":[125900,"9-seater"],"corner-sofa":[71500,"4-seater"],
  "classic-model-headboard-bed":[49600,"King size"],"roman-model-bed":[66900,"Standard model"],"luxury-headboard-bed":[35300,"Standard model"],"dream-night-bed":[33000,"Standard model"],"teak-wood-bed":[28500,"Standard model"],"kerala-teak-bed":[35995,"Standard model"],"inbuilt-plywood-bed":[55900,"Premium model"],
};
const estimatedPrices = {
  "european-sofa":[48900,"3-seater"],"prussian-style-sofa":[42900,"3-seater"],"classic-style-sofa":[44900,"3-seater"],"sofa-with-recliner":[84900,"3-seater recliner"],"cloud-sofa":[79900,"3-seater"],
  "round-shape-bed":[42900,"Standard model"],"polished-bed":[28900,"Standard model"],"shadhi-model-bed":[46900,"Standard model"],
  "industrial-style-kitchen":[320000,"100 sq ft"],"minimalist-false-ceiling":[14400,"120 sq ft"],"industrial-exposed-ceiling":[24000,"120 sq ft"],
};
const interiorGuidePrices = {
  "floating-minimalist-tv-unit":[24000,"Standard unit"],"wall-panel-tv-unit":[29000,"Standard unit"],"low-profile-tv-console":[27000,"Standard unit"],"classic-wooden-tv-unit":[29000,"Standard unit"],"modern-entertainment-wall":[67500,"Standard unit"],"scandinavian-tv-unit":[33000,"Standard unit"],"compact-tv-unit":[26000,"Standard unit"],"luxury-marble-tv-console":[41500,"Standard unit"],"corner-tv-unit":[30500,"Standard unit"],"industrial-tv-unit":[34000,"Standard unit"],
  "l-shaped-modular-kitchen":[225000,"100 sq ft"],"u-shaped-modular-kitchen":[300000,"100 sq ft"],"parallel-galley-kitchen":[265000,"100 sq ft"],"island-kitchen":[600000,"100 sq ft"],"straight-line-kitchen":[170000,"100 sq ft"],"g-shaped-kitchen":[375000,"100 sq ft"],"open-kitchen":[375000,"100 sq ft"],"handleless-kitchen":[900000,"100 sq ft"],"luxury-modular-kitchen":[650000,"100 sq ft"],
  "modern-tray-false-ceiling":[14400,"120 sq ft"],"gypsum-pop-ceiling":[16800,"120 sq ft"],"wooden-beam-ceiling":[34500,"120 sq ft"],"cove-lighting-ceiling":[18600,"120 sq ft"],"geometric-pattern-ceiling":[19200,"120 sq ft"],"luxury-layered-ceiling":[27000,"120 sq ft"],"pvc-panel-ceiling":[12000,"120 sq ft"],"acoustic-ceiling":[28200,"120 sq ft"],
};
const priced = [
  ...Object.entries(sourcePrices).map(([slug, value]) => [slug, value, "price_catalogue_2026"]),
  ...Object.entries(interiorGuidePrices).map(([slug, value]) => [slug, value, "interior_market_guide_2026"]),
  ...Object.entries(estimatedPrices).map(([slug, value]) => [slug, value, "admin"]),
];
const entries = Object.fromEntries(priced.map(([slug, [amount, configuration], source]) => [slug, { kind:"indicative_fixed", source, approved:true, unit:"per item", configuration, amount_paise:amount * 100 }]));
console.log(JSON.stringify({ productCount:Object.keys(entries).length, estimatedProducts:Object.keys(estimatedPrices), entries }, null, 2));

if (apply) {
  const root = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!root || !key) throw new Error("Missing Supabase configuration.");
  const supabase = createClient(root, key);
  const { error: settingError } = await supabase.from("site_settings").upsert({ key:"catalogue_pricing_v1", value:entries }, { onConflict:"key" });
  if (settingError) throw settingError;
  const { data:products, error:productsError } = await supabase.from("products").select("id,slug,categories(slug)");
  if (productsError) throw productsError;
  const missing = products.filter((product) => !entries[product.slug]);
  if (missing.length) throw new Error(`Missing prices for: ${missing.map((product) => product.slug).join(", ")}`);
  const variants = products.map((product) => ({ product_id:product.id, sku:`${product.slug.replaceAll("-", "_").toUpperCase()}_BASE`, title:entries[product.slug].configuration, price_paise:entries[product.slug].amount_paise, compare_at_price_paise:null, stock_quantity:0, track_inventory:false, made_to_order:true, lead_time_days:product.categories?.slug === "mattresses" ? 7 : 21, is_active:true }));
  const { error:variantError } = await supabase.from("product_variants").upsert(variants, { onConflict:"sku" });
  if (variantError) throw variantError;
  const mattressIds = products.filter((product) => product.categories?.slug === "mattresses").map((product) => product.id);
  const directIds = products.filter((product) => product.categories?.slug !== "mattresses").map((product) => product.id);
  const [{ error:mattressError }, { error:directError }] = await Promise.all([supabase.from("products").update({ purchase_mode:"configurable" }).in("id", mattressIds), supabase.from("products").update({ purchase_mode:"direct" }).in("id", directIds)]);
  if (mattressError) throw mattressError;
  if (directError) throw directError;
  console.log(`Applied direct pricing and purchasable variants for ${products.length} products.`);
}
