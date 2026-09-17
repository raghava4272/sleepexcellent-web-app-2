# Catalogue pricing mapping phase 2C

The source price catalogue calls all listed amounts indicative. The source Interior guide calls its values market benchmarks. Both are stored as indicative pricing, not checkout authority.

- Imported fixed model prices: 28 verified entries — 10 mattresses, 11 sofas, and 7 beds.
- Imported Interior benchmark ranges: 5 exact product matches — Floating Minimalist TV Unit, L-Shaped Modular Kitchen, U-Shaped Modular Kitchen, Parallel / Galley Kitchen, and Modern Tray False Ceiling.
- Kept unresolved: 5 sofa and 3 bed price names that differ from the live catalogue; 25 Interior benchmark names that differ from the live catalogue.

Approved formatting aliases: Latex Pro Mattress → `latex-pro`; Headrest Model Sofa → `head-rest-model-sofa`; Premium Model Sofa → `premium-sofa`; Cabin Sofa → `cabin-style-sofa`.

The pricing manifest is kept in `site_settings.catalogue_pricing_v1`. `scripts/import-catalogue-pricing.mjs` is idempotent and is intentionally limited to the verified records above. It does not alter variants, checkout validation, order snapshots, purchase modes, or product identity.
