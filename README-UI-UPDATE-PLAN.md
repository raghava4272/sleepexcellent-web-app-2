# SleepExcellent: next UI update implementation plan

Prepared and updated: September 17, 2026. Status: Phases 0–1 completed locally; remaining phases pending. The additional requests below are planned, not implemented.

This is the next implementation brief for Terra. Implement one phase at a time, verify its acceptance criteria, and record progress in the checklist at the end. The eight original UI requests, product-page opening repair, and supplied-description import take precedence over older, conflicting instructions in the main README. Preserve the present white/warm off-white, black, timber, and restrained red theme and the client's existing assets.

## Requested outcome

1. Place the logo in the top-left corner.
2. Keep the search bar usable and visible while scrolling.
3. Replace the separate TV Units, Kitchen, and Ceilings top-level entries with **Interior**, containing those three subcategories; manage them in the dashboard.
4. Replace the Flash Sale section with **Make Your Own Mattress**.
5. Replace the existing large Make Your Own Mattress section with **Meet Our Interior Experts**.
6. Apply a consistent font style across every category.
7. Reduce the homepage advertising/slideshow height, keeping its full horizontal width.
8. Give the leadership/founders section the heading **Minds Behind Sleep Excellent**.
9. Diagnose and fix the glitch when opening product pages, including incorrect/nested navigation, dead product buttons, layout jumps, and wrong product destinations.
10. Add the product descriptions from `Sleep_Excellent_Product_Descriptions.docx` to the correct products and display them on listings and product detail pages.
11. Include Interior and its pricing in the dashboard, and import the remaining verified product prices from the supplied documents.
12. Increase spacing between dashboard/menu names and put **Home** before **Products** in dashboard navigation.
13. Position the Chat, WhatsApp, and Call action icons in the bottom-right corner, fixed to the viewport.
14. Make mattress product pages follow the structure and purchase interactions of the supplied Wakefit product reference while retaining SleepExcellent's theme, assets, copy, and catalogue.
15. Use suitable components saved on 21st.dev in Pradeep's account where they improve these pages. Inspect the actual saved components during implementation before selecting them.
16. Show login/sign-in and signup forms as popups over the current webpage, with the webpage visible and blurred behind the popup.

## Interpretations to use during implementation

- “Search bar scrollings” means a header/search area that stays visible as the outer website scrolls. It does not mean a scrolling text ticker. If the client later requests rotating search suggestions, scope that separately.
- “Advertising page” means the full-width homepage hero slideshow, not a separate route. Keep the existing slides until the client supplies replacement content.
- “Founders page” means the existing About/leadership section on the homepage. Update that section on desktop and mobile; no separate founders route is required by this request.
- Interior has exactly three children: **TV Units**, **Kitchen**, and **Ceilings**. Use the existing TV-unit, modern-kitchen, and bedroom-ceiling catalogue products under them.
- Moving the mattress feature must preserve access to `/build-your-mattress` and the actual configuration/purchase workflow. The replacement Interior Experts section must contain interior content and an interior destination, not mattress controls with a renamed heading.
- Standardize category typography using the app's existing Syne/Geist families: Syne for category headings/product titles, Geist for navigation, descriptions, forms, and prices. Keep the existing brand logo image and avoid a site-wide font redesign.
- The specified banner heights below are initial implementation targets. Adjust only if real slide content requires it, while keeping the banner materially shorter than today.
- The supplied menu photo is a layout reference: grouped columns with headings/dividers and generous spacing between product names. Its Wakefit product names and blue/purple palette are not SleepExcellent catalogue or theme requirements.
- “Icons right side corner down” supersedes the previous vertically centered contact dock position. Use the bottom-right browser corner with responsive offsets and clearance for mobile purchase controls.
- “Home before Products in dashboard” means the admin navigation order starts **Home → Products → Interior** before existing operations links. Home opens `/`; Products opens the admin product/pricing view. Do not send administrators to an unrelated customer listing when they need editing controls.

## Current implementation facts

Read the relevant local Next.js guides under `node_modules/next/dist/docs/` before implementing code, as required by `AGENTS.md`.

- `app/page.tsx` renders two full-document iframes: `public/stitch-homepage-desktop.html` and `public/stitch-homepage-mobile.html`.
- Desktop navigation is generated from the `catalogueNavigation` array inside the desktop HTML. Editing only the initial navigation markup will be overwritten by that script.
- Current desktop script categories include Mattresses, Sofas, Padding Beds, TV Units, Modern Kitchen, and Bedroom Ceilings.
- Mobile navigation and homepage features have independent markup and scripts. Every applicable change must cover both versions.
- Desktop Flash Sale is `PromotionalMerchandisingStrip`; the current large mattress section is `CustomMattressConfigurator` with `id="custom-mattress"`. Mobile uses a Flash Sale strip and `id="custom-configurator"` for its existing mattress section.
- Desktop hero heights are currently 440/500/580px; mobile hero height is 410px.
- The existing leadership photos are `/ceo-pratap_reddy_snapareddy.jpg` and `/managing_director_merva_obaiah.jpg`, already present in `public/`.
- `components/layout/header.tsx` is an earlier native header scaffold. The homepage currently uses its embedded HTML header. Some scaffold category links do not have implemented destination routes.
- `app/shop/page.tsx` embeds the mattress listing. It is not a working Interior category listing.
- `app/admin/page.tsx` currently shows orders, customer details, summary metrics, and order-status controls. `/admin/categories` does not currently exist.
- Supabase `categories` already has `parent_id`, unique `slug`, `sort_order`, `is_active`, and `description`. Products reference category IDs. Reuse that hierarchy rather than introducing another category table.
- `supabase/seed.sql` currently seeds mattresses. Do not assume the hardcoded interior catalogue is already stored in Supabase.
- `components/contact/floating-actions.tsx` is mounted in the outer layout. Keep the contact dock fixed to the browser viewport.
- Existing iframe sizing has been revised several times. Header/section changes must not reintroduce blank space after the footer or a second scrollbar.

## Phase 0 — baseline and catalogue mapping

Purpose: establish exact sources and safe boundaries before changing layouts.

Tasks:

1. Check Git status, `AGENTS.md`, current routes, and deployment association. Preserve unrelated work and root catalogue/media files.
2. Capture the current homepage at 390px, 768px, and 1440px widths, including header, slideshow, Flash Sale, mattress feature, leadership, and footer.
3. Inventory links to `#custom-mattress`, `#custom-configurator`, Flash Sale anchors, and category slugs. Identify links that need remapping when sections move.
4. Read the supplied catalogue/product listing and compare them with the hardcoded navigation products. Record the complete product-to-subcategory mapping before writing a migration.
5. Inspect actual Supabase category/product rows using safe read-only checks. Reuse existing IDs/slugs wherever possible.
6. Confirm that the production project belongs to Raghava and serves `https://sleepexcellent-web-app-2-two.vercel.app/`. A Git push or HTTP 200 alone is not proof that the new build is deployed.

Exit criteria: current screenshots and a verified mapping of the three Interior subcategories exist; all affected routes/anchors are identified.

## Phase 1 — left logo and search that remains visible

Requests covered: 1 and 2.

Implementation:

1. Use a native storefront header in the outer Next.js page so sticky positioning follows the browser's scrolling viewport. A sticky header inside a full-height iframe will move as the iframe scrolls out of view.
2. Extend the existing `components/layout/header.tsx` or create a clearly named storefront header with the approved appearance. Mount it on storefront routes, including home, category listing, and product detail. Keep admin's own dashboard header separate.
3. Hide/remove the duplicate embedded header/navigation on pages using the outer header. Hide them before iframe height is measured to avoid an empty reserved header area.
4. Desktop layout: logo first on the left, search flexing through the middle, utility actions on the right. Keep a white header and a clickable `/` logo link.
5. Preserve `logo.png`, its aspect ratio, and the centered “Mattresses” tagline below the logo. Do not add the removed “Handcrafted Living” text.
6. Mobile: logo left with utility controls right, search on a second compact row if necessary. Do not hide search entirely on small screens.
7. Use `position: sticky; top: 0` for the outer header. Ensure no ancestor's overflow/transform prevents sticky behavior. Calculate the category row offset from the actual header height instead of hardcoding the old iframe offset.
8. Wire the search to real catalogue data: query on Enter/search-button click, preserve the search term in the URL, show results and a clear empty state, and let results open real product pages. Do not introduce an input that only looks interactive.
9. Preserve existing Favorites, Account, Cart, and Track Order destinations and accessible names.

Likely files: `components/layout/header.tsx`, `app/page.tsx`, storefront pages/layout, `app/globals.css`, embedded homepage/listing header markup. Add a search results route/query implementation only where needed.

Acceptance:

- Logo is visibly left aligned on desktop, tablet, and mobile; clicking it opens home.
- Search stays visible at top, halfway down, and at the footer of long pages.
- Search returns a known mattress and an interior product, and handles no matches.
- No duplicate header, layout jump, clipped utility actions, or extra blank header area.

## Phase 2 — Interior hierarchy and dashboard category controls

Request covered: 3.

Target navigation tree:

```text
Interior
├── TV Units
├── Kitchen
└── Ceilings
```

Implementation:

1. Add an idempotent Supabase migration/seed update for parent `Interior` (`interior`) and children `TV Units` (`tv-units`), `Kitchen` (`kitchen`), and `Ceilings` (`ceilings`). Set each child's `parent_id` to Interior and deterministic sort order 1/2/3.
2. If matching categories already exist, retain their IDs, attach them to the parent, and change display labels carefully. If an existing public slug differs, retain it or add a redirect; do not silently break old URLs.
3. Assign existing interior products to the correct child category. Import missing catalogue records idempotently. Preserve product slugs, variants, prices, media, and existing order snapshots.
4. Expose Interior as one top-level navigation item. Remove the separate top-level TV Units, Modern Kitchen, and Bedroom Ceilings entries in desktop script, mobile menu, outer header, and relevant category tiles.
5. Desktop: open an Interior menu with three clearly titled columns/groups. Each group lists its full product set. Use click/focus support as well as hover; Escape closes it.
6. Mobile: tap Interior to expand the three children, then choose a child or product. Touch navigation must not depend on hover.
7. Build real `/interiors` and `/interiors/[category]` pages for overview and child listings, using catalogue records. Resolve child slugs against the hierarchy and return a proper not-found page for invalid values.
8. Each child title opens its listing and each product link opens `/products/[slug]`. Verify spelling/slug differences such as `Latex Pro` versus `Latex Pro Mattress` rather than deriving all URLs blindly from labels.
9. Add `/admin/categories` and a dashboard link. Show the parent with the three children, product counts, active state, and sort order.
10. Allow authorized admin/staff to edit category display name, description, visibility, and order, and assign a product to one of the three children. Keep this scoped to category management; a full CMS is not required.
11. Protect every mutation server-side with the same verified staff/admin permissions as order management. Validate parent relationships, slug uniqueness, cycles, and allowed fields. Never expose service keys to the browser.
12. Use database-backed category data for both dashboard and storefront. For embedded sections, pass/read a shared public category payload instead of maintaining a second divergent hardcoded category tree.
13. Preserve mattress, sofa, and padding-bed categories and all existing commerce behavior.
14. Add a clearly labelled **Interior** dashboard destination showing TV Units, Kitchen, and Ceilings, with product counts, names, pricing units, indicative ranges, and edit links. Integrate the pricing controls described in Phase 2C below.
15. Add dashboard navigation with **Home** before **Products**, followed by **Interior** and existing Orders/Customers operations. Use at least 12–16px between navigation items and comfortable row padding; allow long names to wrap naturally rather than crowd or truncate essential information.
16. Follow the supplied menu photo for grouping and spacing: three Interior columns on desktop, visible headings/dividers, approximately 10–12px vertical separation between product links, and readable wrapping. Keep full product lists visible without an internal menu scrollbar where the viewport permits; use expandable groups on mobile. Support keyboard focus and Escape.

Likely additions: category query helpers/types, `/interiors` routes, `/admin/categories`, guarded category APIs/server actions, one migration/seed update. Review native product pages so interiors do not accidentally display mattress-only selectors.

Acceptance:

- Navigation shows one Interior parent with exactly the three requested children.
- Every catalogue interior product is assigned correctly, visible in its listing, and links to the correct product page.
- Dashboard edits survive reload and appear in the storefront after refresh/revalidation.
- A customer cannot use admin category mutations; active catalogue remains publicly readable.
- No product/order records are deleted to achieve the regrouping.

## Phase 2A — product-page opening glitch

Additional request covered: 9. Complete this after the category/routes work and before replacing promotional sections.

### Findings from source inspection

- In `public/stitch-product-listing.html`, only the first product card's Select Slab button has a navigation handler. It uses `window.location.href`, which changes the iframe's location rather than the outer website URL.
- The other original cards have no product navigation handler. The cloned Foam Mattress card also does not receive its own handler; cloning a node does not copy a JavaScript `onclick` property.
- Homepage dropdown links use `target="_top"`, but build slugs from display names. Those derived slugs are not verified against real product records.
- `app/products/[slug]/page.tsx` currently constructs a product title from any slug instead of looking up the product and rejecting unknown slugs. It also renders mattress configuration controls for every category, including interiors.
- The root loading skeleton differs substantially from the product layout, which should be checked as a possible source of visible layout jumping.

These are verified code findings, not a confirmed browser reproduction of every symptom. Terra must capture the reported opening behavior before deciding which additional changes are necessary.

### Diagnosis and implementation

1. Reproduce opening products from `/shop` cards, homepage category dropdowns/tiles, Favorites, search results, and the new Interior listings. Test top-of-page and scrolled positions at desktop and mobile sizes.
2. Record the clicked product, outer URL before/after, iframe URL, viewport/scroll position, screenshot or short trace, and any console/network errors. Check for nested product content, retained listing dimensions, header duplication, blank space, flicker, and wrong/default product data.
3. Replace listing CTA navigation with real links to each record's canonical `/products/[slug]` URL. Embedded links must navigate the outer page with `target="_top"`; native pages should use Next.js links. Give all original and cloned cards valid destinations.
4. Resolve product links from actual catalogue/database slugs, not unverified label transformations. Cover the known Latex Pro label/slug mismatch and all Interior product names. Preserve established URLs or supply redirects where necessary.
5. Fetch the requested product on the server and render a proper not-found state for invalid/inactive products according to catalogue visibility. Show the requested product's name, description, category, and valid options.
6. Render mattress selectors only for mattress products; interiors and other categories need the appropriate product details/action instead. Do not let unrelated products enter the cart with mattress configurations.
7. Ensure the Ortho Plus dedicated route and the generic route use consistent detail layout/data behavior. Avoid a special-case page becoming visually or functionally different from other mattress details without a product-specific reason.
8. Make product opening land on a complete top-level page with a visible header/title, predictable initial scroll, and no retained iframe height. Verify Back returns to the originating listing and its filters/view state where practical; do not reset scrolling on every unrelated render.
9. Address loading/flicker only where reproduced: use a product-shaped loading state, stable image dimensions, and consistent server/client initial values. Check delayed fonts/images and hydration errors instead of hiding the page with arbitrary timeouts.
10. Recheck product options, favorite toggling, and Add to Cart after navigation. Avoid introducing a new pricing system as part of this navigation repair.

Likely files: `public/stitch-product-listing.html`, homepage navigation scripts, `app/products/[slug]/page.tsx`, `app/products/ortho-plus-mattress/page.tsx`, product query helpers, affected listing/search routes, and a product-level loading state if needed. Review `components/stitch/stitch-frame.tsx` if iframe navigation or sizing contributes to the reproduced issue.

Acceptance:

- Every displayed product CTA opens that exact product in the outer browser URL, with no product page nested inside the listing iframe.
- Desktop/mobile opening and Back navigation work from all listed entry points, including the Foam Mattress card.
- Product title, description, category, and options match the chosen record; interiors do not show mattress selectors.
- Unknown product slugs show a proper not-found page rather than an invented product title.
- No reproduced flicker, disruptive layout jump, clipped content, duplicate header, or trailing blank panel remains; product opening emits no new console errors.
- Favorites and Add to Cart still operate for supported products.

## Phase 2B — import the supplied product descriptions

Additional request covered: 10. Complete after product/category mapping and Phase 2A's database-backed product resolution, before final visual acceptance.

### Source and inspected inventory

Source document: `Sleep_Excellent_Product_Descriptions.docx`.

Current supplied location:

```text
/Users/ananyanarayani/Library/Containers/net.whatsapp.WhatsApp/Data/tmp/documents/7D44B03B-E4E1-4B51-9133-EB4D7B55CC7D/Sleep_Excellent_Product_Descriptions.docx
```

The document was read while preparing this plan. It contains 66 numbered product names, each followed by a descriptive paragraph:

| Source group | Entries | Count | Storefront group |
| --- | --- | --- | --- |
| Mattress | 1–10 | 10 | Mattresses |
| Sofas | 11–26 | 16 | Sofas |
| Padding Beds | 27–36 | 10 | Padding Beds |
| Interior — TV Units | 37–46 | 10 | Interior → TV Units |
| Interior — Modern Kitchen | 47–56 | 10 | Interior → Kitchen |
| Interior — Bedroom Ceilings | 57–66 | 10 | Interior → Ceilings |

Use this document as the source of product description copy; use the existing product catalogue and verified product records for identity/category/pricing. The WhatsApp path is temporary: at Phase 0, preserve a working source copy in a stable project reference directory before extraction. If it is no longer available, obtain the same document before importing copy; do not recreate it from memory.

### Matching rules and known differences

- Match each description using a reviewed source-name-to-canonical-product-slug mapping. Match within the correct category; do not use row order, partial names, or fuzzy similarity as an automatic update rule.
- Formatting variants requiring review include `Latex Pro` versus `Latex Pro Mattress`, `Head Rest Model Sofa` versus `Headrest Model Sofa`, `Parallel / Galley Kitchen` versus `Parallel Galley Kitchen`, `Premium Sofa` versus `Premium Model Sofa`, and `Cabin Style Sofa` versus `Cabin Sofa`.
- The source also includes sofa names such as European Sofa, Prussian Style Sofa, Classic Style Sofa, Sofa with Recliner, and Cloud Sofa, while the current navigation contains different names such as Excellent Sofa, Luxury Sofa, Italian Model Sofa, Rock Style Sofa, and Modern Sofa. Do not assume these are equivalent or substitute descriptions without catalogue evidence/client direction.
- The source beds include Round Shape Bed, Polished Bed, and Shadhi Model Bed; current navigation instead includes Colony Model Bed, Lifestyle Bed, and Wood Rock Bed. Treat these as unresolved product identities until verified.
- Keep unresolved items in an explicit mapping report, not assigned to an unrelated product. Do not rename products, alter their slugs, or create new purchasable products merely to make the 66 descriptions appear matched.

### Implementation

1. Extract all 66 product names/paragraphs in source order into a reviewable structured manifest containing source number, category, source name, exact description, canonical slug when verified, and mapping status.
2. Compare the manifest against the product/category catalogue and actual Supabase products. Produce a report of exact matches, approved aliases, ambiguous matches, missing products, and existing products with no source description.
3. Resolve confirmed aliases explicitly. Continue safe imports for verified matches while reporting ambiguous/missing items for direction. If a missing product is independently confirmed by the catalogue, add it only through the established catalogue-import rules, preserving the correct purchase mode and price source.
4. Use an idempotent migration or import script keyed by canonical product slug/ID. Update `products.description` with the sourced paragraph and `products.short_description` with the same paragraph or a faithful excerpt for cards. Preserve the complete source text in the full description.
5. Preserve wording and meaning, punctuation, and category association. Do not add technical specifications, certifications, guarantees, or pricing claims absent from the source. Record any necessary editorial adjustment rather than silently rewriting the supplied copy.
6. Update only verified description fields. Preserve IDs, names/slugs, categories, prices, variants, media, visibility, cart data, and order snapshots. Keep previous descriptions in a reviewable export/report so a wrong match can be corrected.
7. Render stored full descriptions on the actual native product pages, replacing generic placeholder copy for matched records. Render short descriptions on `/shop`, Interior listings, and relevant homepage product cards. Embedded HTML must consume the same product descriptions/payload rather than retain conflicting hardcoded copy.
8. Clearly distinguish a product with no supplied description from a completed import. Preserve existing appropriate copy for unmatched products pending review instead of fabricating text or copying another product's paragraph.
9. Render copy as text/controlled paragraphs, not executable HTML from a document. Use readable line heights and natural wrapping, and retain the Phase 5 typography rules.
10. Verify representative entries from every category, both Latex products and Ortho/Ortho Plus separately, plus all approved aliases. Re-run the import to confirm it updates existing records without duplicates.

Acceptance:

- The manifest accounts for all 66 source entries, with a count/report of imported, unresolved, and missing identities; coverage is not claimed complete while unresolved mappings remain.
- Every verified product shows its own supplied description on its detail page and consistent summary copy on listings.
- No generic placeholder description remains on matched products; no unrelated description is assigned to an ambiguous product.
- Full paragraphs are preserved; cards may truncate visually but detail copy is readable and complete at desktop/mobile sizes.
- Re-running the import is safe and changes neither prices nor existing product/order identities.
- The implementation handoff records unresolved name differences so the client can resolve them before final acceptance.

## Phase 2C — catalogue pricing and dashboard product controls

Additional requests covered: 11 and 12. Complete after catalogue identity mapping and before the product-detail redesign.

### Reviewed pricing sources

Stable source copies retained for implementation:

- `docs/reference-sources/Sleep_Excellent_Interior_Market_Pricing.docx`: 30 named Interior entries, including tier, INR range per square foot, and typical unit/project total.
- `docs/reference-sources/SleepExcellent_Price_Catalogue-3.docx`: 10 mattress prices, 16 sofa prices, 10 bed prices, and eight ceiling-material ranges. Prices are described by the source as indicative.

The Interior guide calls its values general Indian-market benchmarks rather than SleepExcellent quotations. Preserve that meaning when importing and displaying them. For example, Floating Minimalist TV Unit is ₹800–₹1,100/sq.ft with a typical unit range of ₹20,000–₹28,000; L-Shaped Modular Kitchen is ₹1,200–₹2,800/sq.ft with a typical total of ₹1.5–₹3 lakh; Modern Tray False Ceiling is ₹90–₹150/sq.ft with a typical 120-sq.ft total of ₹10,800–₹18,000.

Implementation:

1. Extract a reviewed pricing manifest keyed by verified product ID/slug, retaining source name, category, currency, pricing unit, minimum/maximum rate, typical total range, assumed project area, tier, inclusions, and whether a range is open-ended (`+`). Account for all 30 Interior and 36 mattress/sofa/bed entries.
2. Match names explicitly using the Phase 0 mapping. Keep European/Excellent Sofa and the other unresolved sofa/bed identities in the unmatched report; never attach prices by row position. Confirm formatting aliases before applying them.
3. Reuse product variants for fixed purchasable prices. Add structured product pricing fields/table only where necessary for range/unit/quote pricing; do not put a project estimate into `product_variants.price_paise` as a payable amount. Store INR amounts in integer paise and validate nonnegative values and ordered bounds.
4. For verified mattresses, sofas, and beds, import the supplied per-model price with its specified configuration. The mattress source prices apply to 72 × 75 × 6 inches except Shim at 72 × 75 × 1 inch. Do not automatically apply that same amount to every size or support series.
5. Import Interior benchmark ranges with their units and assumptions. TV-unit typical totals assume standard elevation; kitchen totals use the source's stated assumptions; ceiling totals assume 120 sq.ft and the source says material, framing, and installation labour are included. Preserve product-specific ranges over broad material-level ceiling ranges without combining them into an invented price.
6. Store benchmark/indicative versus approved selling-price status separately. Display **Indicative range** and **Request a quote** for Interior products until an admin supplies a confirmed selling price/quote policy. Final Interior payment requires a server-validated quotation or confirmed product variant; a lower range boundary must not silently become the checkout total.
7. Add `/admin/products` and an Interior pricing view linked from the dashboard. Show readable name/category columns, pricing mode/unit, current price or range, source/status, and edit actions. Place **Home** before **Products** in the dashboard navigation and provide more spacing between names and controls.
8. Allow authorized admin/staff to edit fixed prices, indicative ranges, units, and approved status with server-side validation. Save changes to Supabase, refresh/revalidate storefront data, and show clear success/error states. Preserve previous order price snapshots.
9. Make the import idempotent and produce counts for imported, matched, ambiguous, and missing products. Preserve an export of previous price values. Do not overwrite later admin edits when rerunning the source import unless explicitly requested.

Acceptance: all source rows are accounted for; verified products show consistent prices in dashboard/listing/detail; admin edits persist; customers cannot change prices; unit/range pricing is not charged as a fixed product price; existing order totals remain unchanged.

## Phase 2D — product-page layout and saved 21st.dev components

Additional requests covered: 14 and 15. Complete after Phases 2A–2C so the design uses real product identity, copy, options, and pricing.

Reference: [Wakefit Ortho Essential Mattress product page](https://www.wakefit.co/mattress/ortho-essential-mattress/WOEM72366). Reviewed September 17, 2026. The page presents selectable support series with prices, size confirmation, reviews, customer media, descriptions, and FAQs. The earlier supplied mobile screenshots additionally show size-group, dimension, thickness, and Confirm Variant controls. Reinspect desktop and mobile behavior during implementation because the reference can change.

Implementation:

1. Build one shared native product-detail layout for generic and Ortho Plus routes. Desktop: image gallery left and purchase/options panel right; mobile: stacked gallery and purchase details with compact sticky Add to Cart controls. Keep SleepExcellent's white/warm off-white, black, timber, restrained red, Syne/Geist styling and rounded edges.
2. Show breadcrumbs, actual product title, supplied description, selected configuration price, genuine available review information, and image placeholders until approved product media exists. Do not copy Wakefit imagery, descriptions, offer percentages, certifications, warranty promises, or testimonials.
3. Provide a clear selector flow for supported mattress products: support series where actually available, size group (Single/Diwan/Queen/King/Custom), dimensions, and thickness. Use an accessible dialog/drawer for variants, visible selection states, a selected-size summary, fit confirmation, and **Confirm Variant**. Derive options and prices from allowed product data; never invent a series for a product that does not offer it.
4. Confirming a variant updates the summary and price. Add to Cart stores the exact product, variant, quantity, and custom configuration used for server-side pricing. Ensure current cart/checkout validation rejects unsupported combinations and stale prices. Keep non-mattress products on their own detail/quote flow.
5. Include readable product description/specification sections, delivery information, warranty/policy details only where supplied, and FAQs. Show reviews/customer media only if real records exist; use an honest empty state otherwise.
6. Inspect 21st.dev's saved/favourite components in Pradeep's account using the available signed-in session. If that account session is unavailable, let the user complete interactive sign-in or obtain component links before choosing account-specific assets. Do not claim to have retrieved saved components merely from an email/account name.
7. Record selected component URLs, source/license, intended use, dependencies, and adaptations in `docs/21st-dev-components.md`. Prefer suitable gallery, variant drawer, tabs/accordion, menu, or purchase-panel components. Check React/Next.js compatibility, keyboard access, reduced-motion behavior, and bundle cost. Adapt styling to the existing theme and remove sample content, sample endpoints, tracking, and unused dependencies.
8. Keep commerce logic in the app's validated product/cart layer rather than trusting demo component state as a payment authority. Avoid a broad UI-library migration solely to use a saved component.

Acceptance: the reference's purchase layout and selector flow are recognizable in SleepExcellent's theme; every offered selection maps to valid catalogue data and price; desktop/mobile Add to Cart works with the confirmed configuration; no duplicate header, nested navigation, opening glitch, or trailing blank space; saved-component provenance is recorded or the account-access dependency is reported honestly.

## Phase 3 — move Make Your Own Mattress into the Flash Sale position

Request covered: 4.

Implementation:

1. Replace the current Flash Sale block in desktop and mobile with a compact mattress customization feature in that same page position.
2. Heading: **Make Your Own Mattress**. Include brief useful copy explaining dimensions, support/layers, and comfort, plus one primary CTA linking to `/build-your-mattress`.
3. Reuse the useful existing mattress layer/cutaway visual rather than the unrelated Flash Sale sofa/interior cards. Keep it compact; the full builder remains on its dedicated route.
4. Remove sale-only countdowns, clearance badges, discount claims, deal-card actions, and timer scripts belonging to the removed block. Guard/remove scripts that reference deleted DOM IDs.
5. Give this moved feature a stable anchor such as `id="custom-mattress"`. Update old mattress section anchors and header/footer CTAs to either this feature or the dedicated builder as appropriate.
6. Retain the functional configuration and cart flow on the builder/product pages; do not create a second pricing implementation inside this promotional block.

Acceptance: no Flash Sale content remains in the replaced section; desktop/mobile customization CTA opens the working builder and no browser script errors occur from deleted timers/controls.

## Phase 4 — replace the old large mattress feature with Interior Experts

Request covered: 5.

Implementation:

1. Replace the old large mattress-section content with **Meet Our Interior Experts**, on desktop and mobile, maintaining its placement in the homepage sequence.
2. Use a clean interior visual/placeholder, a short consultation-oriented description, and the three service labels TV Units, Kitchen, and Ceilings.
3. CTA: **Explore Interior Solutions**, opening `/interiors`. Optional secondary service links may open the three listings.
4. Use `id="interior-experts"` for the new feature. Remove mattress layer controls, mattress size inputs, pricing gauges, and mattress-specific IDs/scripts from this section.
5. Do not invent expert names, qualifications, service statistics, or reuse CEO/Managing Director photos as interior-expert profiles. If expert photos are unavailable, use existing approved interior visuals/placeholders until the client supplies them.
6. Preserve the leadership photos in the separate founders section. Do not build consultation booking or send enquiries as part of this replacement.

Acceptance: this section has interior content, the correct heading, working Interior links, and no leftover mattress configuration controls. A distinct Make Your Own Mattress feature still exists in its new location.

## Phase 5 — category typography consistency

Request covered: 6.

Implementation:

1. Define/reuse a small category type scale: Syne headings/product titles and Geist navigation/body/form/price text. Use the existing palette and restrained font weights.
2. Apply it to top navigation, dropdown headings, category cards, listing titles, product cards/details, Interior landing/children, and dashboard category headings/controls.
3. Load/reuse the same fonts in native pages and embedded HTML. Changing only `app/globals.css` will not style iframe documents.
4. Replace category-specific arbitrary font overrides where necessary. Keep the logo as an image and keep copy readable rather than forcing all text into uppercase.
5. Use responsive sizes and consistent line heights. Check long catalogue names, three-column Interior menus, prices, and mobile wrapping.

Acceptance: all categories use the same heading/body families and scale; no clipped names, unintended fallback fonts, or crowded mobile labels.

## Phase 6 — reduce slideshow height and verify content sizing

Request covered: 7.

Implementation:

1. Keep the slideshow edge-to-edge horizontally. Reduce initial height targets to approximately **360px desktop**, **300px tablet**, and **240px mobile** (currently up to 580px desktop and 410px mobile).
2. Keep arrows, dots, text, and primary links legible in the smaller area. Use intentional crop/focal positioning so key imagery is not cut off.
3. Keep existing slide content until client replacements arrive. Preserve manual navigation, automatic playback behavior, and reduced-motion support.
4. Recalculate iframe height after header removal, section replacements, fonts/images loading, layout changes, and desktop/mobile breakpoint changes.
5. Measure the bottom of real normal-flow content/the footer, not the iframe viewport's `documentElement.scrollHeight` as a minimum. The latter can retain an old tall viewport and prevent shrinking.
6. Exclude hidden documents, fixed action docks, script/style nodes, and viewport-dependent minimum-height fillers from frame measurements. Attach observers after each iframe load and clean them up correctly.
7. Avoid trusting `body.lastElementChild.offsetTop` when the last child is a script or hidden node; use the actual footer/content element. Ensure height changes can both increase and decrease.
8. Maintain one browser scrollbar. Expand/collapse listing FAQs and switch grid/list layouts to confirm content is never clipped and no blank area remains below the footer.

Likely files: embedded hero markup/styles/scripts, `app/page.tsx`, `components/stitch/stitch-frame.tsx`, `app/globals.css`.

Acceptance: banner is visibly shorter yet full-width; footer is the final page content; no trailing blank panel at any tested width; slideshow and floating actions work during scrolling.

## Phase 6A — match Wakefit homepage slideshow dimensions

Client addition: match the homepage slideshow dimensions on [Wakefit's homepage](https://www.wakefit.co/). This replaces the earlier approximate Phase 6 height targets for the next implementation; Phase 6's completed work remains recorded below.

1. Inspect the live Wakefit homepage at the same 390px, 768px, and 1440px viewport widths used for SleepExcellent verification. Record the visible slideshow width, height, aspect ratio, and any breakpoint-specific layout in the verification notes before changing styles. Measure the banner itself, excluding the header and sections below it; do not infer dimensions from extracted page text.
2. Apply matching slideshow dimensions and responsive proportions to SleepExcellent's homepage at each corresponding viewport. Keep the desktop banner full-width horizontally and preserve our existing colour theme, slide content, and controls. The client will provide replacement slide content later.
3. Ensure all slides occupy the same measured area, use intentional image positioning, and do not cause layout jumps or horizontal overflow. Preserve arrows, dots, autoplay, and reduced-motion behavior.
4. Recheck iframe content height and the footer after the sizing change so the banner does not reintroduce trailing blank space. Compare both homepages side by side at the three viewport widths and record the final dimensions.

Acceptance: the SleepExcellent slideshow matches Wakefit's measured banner dimensions at equivalent viewport widths while retaining SleepExcellent styling and working controls. Do not implement this addition during the plan-only update.

## Phase 7 — leadership heading

Request covered: 8.

Implementation:

1. Update the main heading of the existing leadership section to **Minds Behind Sleep Excellent** on desktop and mobile.
2. Keep the supplied portraits, accurate names, and roles: Pratap Reddy Snapareddy — CEO; Merva Obaiah — Managing Director.
3. Give the section a stable `id="founders"` if needed for an About/leadership link. Use a proper heading hierarchy and meaningful alt text.
4. Ensure two readable cards on larger screens and sensible stacking/wrapping on mobile. Do not fabricate biographies or label both people Founders without confirmation.

Acceptance: exact heading is present in both homepage versions and portraits/names/roles remain correct and readable.

## Phase 7A — bottom-right fixed contact icons

Additional request covered: 13.

1. Update `components/contact/floating-actions.tsx` to use fixed bottom-right positioning in the outer document. Use approximately 16–24px right/bottom offsets, adjusted for device safe areas. Replace the centered `top-1/2`/translate positioning.
2. Use compact recognizable Chat, WhatsApp, and Call icons with accessible names and desktop labels/tooltips as appropriate. Keep the chatbot as the existing future-feature element; do not represent it as a working assistant.
3. Preserve the established WhatsApp and telephone destinations, but confirm actual business contact values before public launch rather than adding new invented contact details.
4. Reserve clearance above mobile sticky Add to Cart/checkout controls. Prevent the dock from covering selectors, dialogs, payment controls, or footer links. Keep it at the same viewport position at the top, middle, and footer of storefront pages.

Acceptance: all three controls are visible in the bottom-right corner while scrolling on desktop/mobile; WhatsApp/Call destinations work; the contact dock does not obstruct purchasing.

## Phase 7B — login and signup popups

Additional request covered: 16.

1. Open an authentication modal when a visitor selects Account/Login/Sign up or a protected storefront action requires authentication. Keep the originating webpage visible behind a dimmed, blurred backdrop; preserve its scroll position and product/cart state.
2. Use the existing SleepExcellent theme and rounded form controls. Provide email/password login and signup views, a clear switch between them, close button, password visibility control, validation, loading state, and readable error/success messages. Retain email verification behavior and add Google sign-in only when its configuration is ready.
3. Reuse the existing authentication handlers and validated return destination. After successful login, close the popup and return to or continue the requested action. Do not duplicate authentication logic or bypass admin permissions/email verification.
4. Implement an accessible dialog: focus moves into it, stays within it while open, and returns to the trigger when closed; Escape closes it where appropriate. Lock background scrolling while the popup is open. On small screens, use a responsive dialog with enough room for the keyboard and independently scrollable form content.
5. Keep `/auth/login` and `/auth/register` usable for direct links, expired-session redirects, and email-verification flows. Where navigation originates within the storefront, use a modal route or equivalent state that supports browser Back closing the popup and preserves the underlying page. Direct entry must have a complete fallback page rather than an empty blurred background.
6. Test opening from home, listing, product, cart, and admin entry; switching login/signup; closing and browser Back; invalid credentials; signup verification; successful login; and restoring the intended destination. Protect admin access with the existing verified role checks.

Acceptance: login/signup appear above the blurred originating webpage, remain usable on desktop/mobile, preserve underlying page/cart state, and complete the existing authentication/verification flow correctly.

## Phase 8 — verification and release

Include the added pricing/dashboard/product-layout/contact requirements in release checks: verify the pricing coverage report, fixed versus indicative pricing, admin permissions and persisted edits, Home-before-Products navigation, readable menu spacing, confirmed mattress variants and server-priced cart totals, selected 21st.dev component provenance, and bottom-right contact controls with mobile purchase-bar clearance.

1. Run the project's relevant lint, typecheck, and production build. Add focused behavior tests for category permissions, hierarchical catalogue routing, search, persistent dashboard edits, and description-import mapping/idempotency; do not add trivial tests for every copy/style edit.
2. Verify home, `/shop`, product details, `/interiors`, all three Interior child pages, builder, account/cart, and admin category management at 390px, 768px, and 1440px widths.
3. Check logo home navigation; search while scrolling; Interior hover/keyboard/touch menus; product links and the complete Phase 2A opening/Back-navigation matrix; customization CTA; Interior Experts CTA; heading text; slideshow controls.
4. Scroll every affected long page to its bottom and verify no trailing blank frame area. Confirm the fixed contact dock stays at the same viewport position.
5. Verify admin edits persist, storefront data updates, and customer access to admin mutations is rejected. Preserve existing order management and customer tracking.
   Verify the description-import coverage report and compare displayed descriptions with the supplied document in all six source groups.
6. Existing visual snapshots refer to earlier screens. Review new screenshots against this brief before updating snapshots; do not accept them automatically just to make tests pass.
7. Apply the reviewed migration to the correct Supabase project if authorized during implementation. Preserve IDs and records; inspect results before deploying dependent UI.
8. Commit focused changes to Raghava's repository and deploy through Raghava's Vercel project. Do not use the previously misconfigured Faden CLI account.
9. Confirm Vercel's new deployment is Ready and corresponds to the implementation commit, then verify the exact public domain. Record the URL, commit, and checks in this document.

## Terra execution instructions

- Read this plan and current Git state before starting. Do not restart the original ten-phase ecommerce build from the main README.
- Follow phase order 0, 1, 2, 2A, 2B, 2C, 2D, 3–6, 6A, 7, 7A, 7B, then 8. Completed phases do not need repeating. At each handoff, report which phase completed and the remaining checklist items. Resume from the first incomplete phase when the client says “next”.
- Implement actual working destinations, menus, search, and dashboard persistence; a renamed label with a dead link does not satisfy this plan.
- Keep changes focused on the eight UI requests, the product-page opening repair, supplied product descriptions, and the frame/header behavior needed to make them work. Preserve login, checkout, Razorpay verification, favourites, order tracking, and order controls.
- Use existing assets and theme. Do not invent product prices or expert profiles for this UI update. Read the catalogue mapping before importing interior data.
- Do not commit `.env.local`, service/payment keys, or unrelated root source files. Never expose credentials in logs/screenshots.
- Read relevant local Next.js documentation before code changes. Use the project's existing package manager and scripts.
- Record verification honestly: a passing build verifies compilation, not scrolling behavior or a completed deployment.

Suggested first implementation prompt:

> Follow README-UI-UPDATE-PLAN.md. Start with Phase 0 and then implement Phase 1. Preserve the current theme and supplied logo, keep the logo left with a centered Mattresses tagline, and make search stay visible in the outer scrolling viewport. Verify desktop and mobile behavior, record completed checklist items, and stop at the phase handoff.

## Progress checklist

- [x] Phase 0: baseline, catalogue mapping, routes, and deployment verified — see `docs/phase-0-baseline.md`; exact live deployment commit still needs Vercel-dashboard confirmation at release.
- [x] Phase 1: left logo and sticky functional search — outer header/search added for home, shop, and product routes; verified locally at desktop/mobile sizes.
- [x] Phase 2: Interior hierarchy, real listings, and dashboard category management (completed 17 Sep 2026; price controls remain intentionally scheduled in Phase 2C)
- [x] Phase 2A: product opening glitch repaired with database-backed product resolution and verified Interior/mattress entry points (17 Sep 2026)
- [x] Phase 2B: 66 source descriptions inventoried; 41 verified descriptions imported and displayed; 25 nonmatching Interior identities recorded for review (17 Sep 2026)
- [x] Phase 2C: 28 verified indicative fixed prices and 5 verified Interior ranges imported safely; protected admin product controls and dashboard navigation added (17 Sep 2026)
- [x] Phase 2D: shared reference-style product layout and confirmed-variant flow implemented in our theme; 21st.dev saved components are now accessible and their appropriate adoption boundaries are documented in `docs/21st-dev-components.md` (17 Sep 2026)
- [x] Phase 3: Flash Sale replaced by a responsive Make Your Own Mattress entry point that opens the existing builder in the outer browser route (17 Sep 2026)
- [x] Phase 4: old homepage mattress configurator replaced by responsive Meet Our Interior Experts content that links to each real Interior collection; legacy mattress anchors now open the existing builder route (17 Sep 2026)
- [x] Phase 5: consistent Syne category/product headings and Geist body, navigation, form, and price text applied across embedded and native storefront/category pages (17 Sep 2026)
- [x] Phase 6: full-width slideshow reduced to 360px desktop / 330px tablet / 240px mobile with controls and reduced-motion support preserved; homepage iframe measurement ignores hidden, fixed, and non-content nodes to prevent trailing blank space (17 Sep 2026)
- [x] Phase 6A: Wakefit-derived slideshow proportions applied — 5:1 desktop (20vw, 240–360px), 26vw tablet (240–300px), and 1.54:1 mobile (65vw, 208–273px); controls and theme preserved (17 Sep 2026)
- [x] Phase 7: leadership section now uses the exact Minds Behind Sleep Excellent heading with a stable founders anchor on desktop and mobile (17 Sep 2026)
- [x] Phase 7A: compact fixed bottom-right Chat placeholder, WhatsApp, and Call controls now include accessible icon labels and mobile purchase-control clearance (17 Sep 2026)
- [x] Phase 7B: login/signup popups over a blurred originating webpage, with accessible controls and verified authentication flow
- [ ] Phase 8: responsive/function/security checks and verified deployment

Implementation notes: Phase 0 completed without application, database, or deployment changes. Source-document and live-site baseline evidence is recorded in `docs/phase-0-baseline.md`. Phase 1 moved the homepage/listing header into the outer Next.js viewport, added a database-backed `/search?q=` page, and hides embedded duplicate headers before iframe measurement. It has not been deployed yet.
