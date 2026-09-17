# Phase 0 baseline and catalogue mapping

Completed: September 17, 2026  
Scope: baseline evidence and source mapping only. No storefront, database, or deployment mutation was made.

## Deployment and repository baseline

- Repository remote: `https://github.com/raghava4272/sleepexcellent-web-app-2.git`.
- Current local implementation commit: `5b667c6 fix: keep contact dock fixed on homepage`.
- Public production URL reviewed: `https://sleepexcellent-web-app-2-two.vercel.app/`.
- The public URL returned Vercel response headers and rendered the expected storefront, including the fixed contact dock. This confirms the domain is live on Vercel; it does **not** prove which exact Git commit Vercel has deployed. Confirm the deployment commit in Raghava's Vercel dashboard at release time.
- Baseline captures were taken from the public URL at 390 × 844, 768 × 1024, and 1440 × 1000. They are temporary review evidence, intentionally not committed.

## Source inventory

| Source | Purpose | Result |
| --- | --- | --- |
| `Product_Category_Catalog.docx` | Catalogue identity and category structure | 66 items across six source groups |
| `SleepExcellent_Price_Catalogue-3.docx` | Indicative mattress, sofa, bed, and ceiling prices | 10 mattress prices; 16 sofa prices; 10 bed prices; ceiling type ranges |
| `docs/reference-sources/Sleep_Excellent_Product_Descriptions.docx` | Stable project copy of supplied product descriptions | 66 numbered descriptions; retained unchanged for Phase 2B |

The description document's original WhatsApp temporary path is not suitable for a future import. The stable project copy above must be used as the source in Phase 2B. It is source material, not application data, and has not been imported.

## Target catalogue mapping

| Top-level storefront group | Child group | Count | Product identity source |
| --- | --- | ---: | --- |
| Mattresses | — | 10 | Product Category Catalog |
| Sofas | — | 16 | Product Category Catalog |
| Padding Beds | — | 10 | Product Category Catalog |
| Interior | TV Units | 10 | Product Category Catalog |
| Interior | Kitchen | 10 | Product Category Catalog |
| Interior | Ceilings | 10 | Product Category Catalog |

The requested target hierarchy is therefore:

```text
Interior
├── TV Units
├── Kitchen
└── Ceilings
```

The three Interior children account for 30 catalogue products. Phase 2 must keep sofas and padding beds intact while replacing the three separate top-level interior navigation labels with this parent/child structure.

## Actual Supabase baseline

The correct Supabase project was inspected with read-only queries only.

| Entity | Current state |
| --- | --- |
| Categories | One active category: `Mattresses` (`mattresses`), ID `6812880e-207e-467c-9445-76768d4d8059` |
| Products | Ten active mattress products, all correctly represented in the supplied mattress catalogue |
| Sofas | No database category or product records found |
| Padding Beds | No database category or product records found |
| Interior | No parent category, child categories, or products found |

Existing canonical mattress slugs are:

```text
bonnell-spring-mattress
feel-good-mattress
foam-mattress
latex-mattress
latex-pro
memory-foam-mattress
ortho-mattress
ortho-plus-mattress
pocketed-spring-mattress
shim-mattress
```

Phase 2 must reuse this Mattress category ID and the existing slugs. The `Latex Pro` label maps to `latex-pro`; do not derive a new `latex-pro-mattress` route without an explicit redirect/migration decision.

## Catalogue discrepancies requiring explicit handling

Do not resolve the following by name similarity, row order, or invented aliases.

| Catalogue/description source | Price catalogue or current hardcoded navigation | Status |
| --- | --- | --- |
| European Sofa | Excellent Sofa | unresolved |
| Head Rest Model Sofa | Headrest Model Sofa | formatting alias to review |
| Prussian Style Sofa | Luxury Sofa | unresolved |
| Classic Style Sofa | Italian Model Sofa | unresolved |
| Sofa with Recliner | Rock Style Sofa | unresolved |
| Cloud Sofa | Modern Sofa | unresolved |
| Premium Sofa | Premium Model Sofa | formatting alias to review |
| Cabin Style Sofa | Cabin Sofa | formatting alias to review |
| Round Shape Bed | Colony Model Bed | unresolved |
| Polished Bed | Lifestyle Bed | unresolved |
| Shadhi Model Bed | Wood Rock Bed | unresolved |
| Parallel / Galley Kitchen | Parallel Galley Kitchen | formatting alias to review |

The price catalogue explicitly calls ceiling values indicative ranges by material/type rather than a price per named bedroom-ceiling model. Phase 2 should not create final purchasable ceiling prices from those ranges.

## Existing navigation, anchors, and route boundaries

### Homepage implementation

- `app/page.tsx` renders desktop and mobile homepage documents in full-document iframes.
- Desktop navigation is generated from `catalogueNavigation` in `public/stitch-homepage-desktop.html`; changing only initial markup will be overwritten by the script.
- Current visible desktop top-level items are Mattresses, Sofas, Padding Beds, TV Units, Modern Kitchen, and Bedroom Ceilings.
- Mobile has independent navigation and section markup in `public/stitch-homepage-mobile.html`.

### Anchors to remap or preserve

| Current reference | Found in | Phase 0 conclusion |
| --- | --- | --- |
| `#custom-mattress` | desktop homepage | Preserve access while the large builder feature is moved/replaced in Phases 3–4 |
| `#custom-configurator` | mobile homepage | Preserve/remap alongside the desktop builder anchor |
| Flash Sale timer/strip | desktop and mobile homepage | Replace only in Phase 3, after recording its current CTA destination |
| `#mattresses` | mobile cards and CTA | Keep a valid mattress destination or replace with a real listing link |
| `/build-your-mattress` | native builder route and homepage CTA | Canonical builder route; must remain working |
| `/shop` | native mattress listing | Existing listing is mattress-only and not an Interior listing |
| `/products/[slug]` | native product route | Must use actual product slugs; Phase 2A repairs invalid/nested opening flows |

Additional relevant boundaries:

- `app/admin/page.tsx` already provides order/customer/delivery operations but there is no `/admin/categories` route.
- `categories` already supports `parent_id`, `slug`, `sort_order`, `is_active`, and `description`; Phase 2 must reuse this table for Interior.
- `supabase/seed.sql` currently seeds only mattresses.
- `components/contact/floating-actions.tsx` is outside the iframes and is the correct location for fixed viewport contact controls.

## Baseline visual observations

- At 390px, the storefront selects its mobile homepage. The compact header, slideshow, Flash Sale strip, category cards, builder feature, product cards, leadership section, footer, and fixed action dock all render.
- At 768px and 1440px, the desktop document is selected. The header still uses the centered logo/search configuration and the three separate interior-like top-level entries. The slideshow is full-width and tall, followed by Flash Sale and the large `Make Your Own Mattress` feature.
- The public baseline still includes the current composition that later phases will intentionally change. These observations are a release comparison point, not acceptance of the present UI.

## Phase 0 exit result

- [x] Repository, user-provided source files, remote, and live domain inspected without overwriting unrelated work.
- [x] Homepage baseline captured at 390px, 768px, and 1440px.
- [x] Existing anchors, category navigation source, and route boundaries identified.
- [x] Complete 66-product target mapping recorded, including the exact three Interior children.
- [x] Supabase categories/products inspected read-only; current database gap and reusable mattress IDs/slugs recorded.
- [x] Production domain confirmed as Raghava's public URL at the HTTP/UI level; exact deployed commit remains a release-time Vercel-dashboard check.

Next implementation phase: **Phase 1 — left logo and sticky functional search**.
