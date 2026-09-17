#!/usr/bin/env node
/** Import only explicit source-name matches/approved formatting aliases into site_settings. */
import { readFileSync } from "node:fs";
const apply = process.argv.includes("--apply");
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) { const m = line.match(/^([A-Z0-9_]+)=(.*)$/); if (m) process.env[m[1]] = m[2].replace(/^"|"$/g, ""); }
const fixed = {
  "ortho-mattress": [12699, "72 × 75 × 6 in"], "ortho-plus-mattress": [16395, "72 × 75 × 6 in"], "latex-mattress": [15975, "72 × 75 × 6 in"], "latex-pro": [28315, "72 × 75 × 6 in"], "pocketed-spring-mattress": [15595, "72 × 75 × 6 in"], "bonnell-spring-mattress": [17222, "72 × 75 × 6 in"], "foam-mattress": [14475, "72 × 75 × 6 in"], "memory-foam-mattress": [16619, "72 × 75 × 6 in"], "feel-good-mattress": [26929, "72 × 75 × 6 in"], "shim-mattress": [2119, "72 × 75 × 1 in"],
  "l-shape-sofa": [63500, "3-seater + lounger"], "indian-traditional-sofa": [49800, "5-seater"], "head-rest-model-sofa": [59600, "6-seater"], "chester-model-sofa": [86900, "5-seater"], "fiber-back-sofa": [63650, "5-seater"], "camel-back-sofa": [56590, "5-seater"], "premium-sofa": [75900, "3 + 2 + 1 configuration"], "cabin-style-sofa": [62300, "L-shape"], "sectional-sofa": [66900, "6-seater"], "u-shape-sofa": [125900, "9-seater"], "corner-sofa": [71500, "4-seater"],
  "classic-model-headboard-bed": [49600, "King size"], "roman-model-bed": [66900, "Model"], "luxury-headboard-bed": [35300, "Model"], "dream-night-bed": [33000, "Model"], "teak-wood-bed": [28500, "Model"], "kerala-teak-bed": [35995, "Model"], "inbuilt-plywood-bed": [55900, "Premium model"]
};
const ranges = {
  "floating-minimalist-tv-unit": [800, 1100, 20000, 28000, "per sq ft", "Budget–Mid", "Standard living-room elevation"],
  "l-shaped-modular-kitchen": [1200, 2800, 150000, 300000, "per sq ft", "Budget–Mid", "100 sq ft cabinet elevation"],
  "u-shaped-modular-kitchen": [1500, 3200, 200000, 400000, "per sq ft", "Mid", "100 sq ft cabinet elevation"],
  "parallel-galley-kitchen": [1500, 3000, 180000, 350000, "per sq ft", "Mid", "100 sq ft cabinet elevation"],
  "modern-tray-false-ceiling": [90, 150, 10800, 18000, "per sq ft", "Mid", "120 sq ft ceiling; material, framing and installation labour included"]
};
const entries = Object.fromEntries(Object.entries(fixed).map(([slug, [amount, configuration]]) => [slug, { kind: "indicative_fixed", source: "price_catalogue_2026", approved: false, unit: "per model", configuration, amount_paise: amount * 100 }]).concat(Object.entries(ranges).map(([slug, [min, max, typicalMin, typicalMax, unit, tier, assumption]]) => [slug, { kind: "indicative_range", source: "interior_market_guide_2026", approved: false, unit, min_paise: min * 100, max_paise: max * 100, typical_min_paise: typicalMin * 100, typical_max_paise: typicalMax * 100, tier, assumption }])));
console.log(JSON.stringify({ verifiedFixedCount: Object.keys(fixed).length, verifiedInteriorRangeCount: Object.keys(ranges).length, unresolvedFixedCount: 8, unresolvedInteriorRangeCount: 25, entries }, null, 2));
if (apply) { const root = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY; if (!root || !key) throw new Error("Missing Supabase configuration."); const r = await fetch(`${root}/rest/v1/site_settings?on_conflict=key`, { method: "POST", headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ key: "catalogue_pricing_v1", value: entries }) }); if (!r.ok) throw new Error(`${r.status} ${await r.text()}`); console.log(`Applied ${Object.keys(entries).length} verified pricing entries.`); }
