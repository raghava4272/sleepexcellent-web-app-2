# SleepExcellent functionality and UI test flows

Designed 17 September 2026. This is an execution checklist, not a record of passed tests. Existing implementation-phase checkmarks and deployment success do not prove these end-to-end flows passed.

Site under test: https://sleepexcellent-web-app-2-two.vercel.app/

## 1. Test setup and safety

- Prefer an isolated preview with a test Supabase project and Razorpay test keys. If testing the public deployment, first confirm it uses Razorpay **test mode** and obtain permission for test orders, emails, and admin edits. Never place a live payment merely to test the flow.
- Use three separate browser sessions: verified Customer A, verified Customer B, and an admin. Use another controlled inbox for signup verification and a signed-out session for guest checks. Do not invent credentials or put passwords/tokens in this file.
- Use clearly labelled test customer details and an approved test delivery address. Record the starting product prices, category settings, customer count, and dashboard values before changing anything.
- Choose a fixed-price mattress with valid variants, a sofa/bed, an indicative Interior product, and a custom mattress configuration. Record their IDs/slugs and expected server prices.
- Execute critical flows at 390×844, 768×1024, and 1440×960; also check 320px width and a real touch phone. Include Chromium, Safari, and Firefox where available.
- Record deployment commit, environment, browser, viewport, date, and tester. Keep screenshots and logs free of secrets and real customer data.
- Mark each case **Not run / Pass / Fail / Blocked**. Missing email, OAuth, payment, or database configuration is Blocked, never Pass. Restore approved admin edits after testing; retain test orders for audit rather than deleting records indiscriminately.

## 2. Main acceptance journey

Guest home → browse/search → product → confirm variant → login → cart → shipping details → Razorpay test payment → customer order → admin production/delivery update → customer tracking.

Complete this entire journey with the same order number. Screenshots alone are not payment proof: correlate the customer view, admin view, Supabase records, and Razorpay test dashboard.

## 3. Functional flows

### F01 — Guest navigation and product opening · P0

1. Open `/` in a fresh session and reload it several times, including with a slow connection.
2. Click the logo from home, `/shop`, a product, and an Interior collection. It must navigate to `/` in the outer page, not inside an iframe.
3. Hover each desktop category; check the complete product list is visible, with no internal list scrollbar or collision with the slideshow. Use keyboard navigation and mobile taps for the equivalent menu.
4. Open a product from the category menu, home card, `/shop`, search, and each Interior child page. Use Back, Forward, direct URL, reload, and a new tab.
5. Open `/interiors`, `/interiors/tv-units`, `/interiors/kitchen`, and `/interiors/ceilings`.

Expected: correct category/product identity and URL every time; no opening glitch, nested navigation, empty iframe, false 404, or dead `#` link. Invalid slugs show a useful not-found state.

### F02 — Search, filters, sorting, and layouts · P1

1. Search an exact catalogue name, partial name, an Interior product, whitespace, and a nonsense query using `/search?q=...` and the header search.
2. Scroll a long page and use the sticky search; submit by Enter and by the search button.
3. Open `/shop` with no query parameters. Confirm filters are neutral unless the URL intentionally specifies a category.
4. Apply each available price, size, and firmness filter; combine filters, remove an individual filter chip, reset all, and check zero-results behavior.
5. Change every available sort option. Independently check numeric price ordering, rather than just the selected label.
6. Toggle grid/list view repeatedly. Confirm both change the layout, keep the same results, and preserve filters.

Expected: actual results match filters and sort; all controls are editable; reset restores the baseline. Sort arrow/check does not overlap text. No blank results with a nonempty count.

### F03 — Signup, verification, login, and session lifecycle · P0

1. Open login from home, listing, product, and cart. Switch login/signup and close with Close, Escape, backdrop if supported, and browser Back.
2. Submit empty/invalid fields, incorrect credentials, and a duplicate signup email.
3. Sign up with the controlled new inbox. Verify receipt, sender identity, useful email content, and the deployed verification-link destination. If a branded `noreply` sender is required, verify the actual sender, not only the display name.
4. Attempt login before verification. Verify policy is enforced; follow the email link and sign in successfully. Reuse an already-used link and check its safe outcome.
5. Confirm the popup closes and preserves the originating page/selected variant or validated return destination. Check direct `/auth/login` and `/auth/register` fallback pages.
6. Reload, open another tab, sign out, and attempt to reopen `/account`, `/checkout`, and `/admin`.

Expected: blurred originating webpage remains visible; focus stays inside the popup and returns to its trigger; background scroll is locked only while open; keyboard does not hide form actions. No permission bypass or redirect to an external destination. Google login is Blocked/deferred until configured, not falsely tested as working.

### F04 — Customer profile and isolation · P0

1. Sign in as Customer A and open `/account`. Confirm email, name, phone, order history, Favorites, Shop, Cart, and Sign out are available.
2. Edit name and phone; save, reload, sign out/in, and confirm persistence. Submit malformed or excessively long values and check validation.
3. Sign in as Customer B in the separate session. Confirm B sees B's details and orders, never A's.
4. Attempt A's order URL as B and as a guest; try an unknown order number.

Expected: profile updates persist without changing email/role. Other users' order data is not disclosed; denied and missing states are useful and safe.

### F05 — Product descriptions and mattress variant confirmation · P0

1. Compare title, category, description, price, price type, and specifications with the supplied catalogue/mapping reports. Sample every source-description group, plus unmatched products.
2. On a mattress, exercise each available series, size group, dimension, thickness, and custom-size option. Change choices before and after Confirm Variant.
3. Check selected/confirmed states, dimension units, validation, recalculated price, and the selection summary. Refresh and use Back.
4. Try an invalid or unsupported variant/custom dimension. Check disabled/unavailable options cannot be submitted by the UI.
5. Add the confirmed selection to cart. Compare the exact series, dimensions, thickness, quantity, and price with the product page.

Expected: no copied unrelated descriptions, invented specs, or silent fallback variant. Server validates availability and calculates price. If a requested series/size option is missing, record a feature failure rather than skipping it. Indicative/range Interior prices are clearly labelled and not presented as a guaranteed purchasable price.

### F06 — Favorites · P1

1. Save/remove a product from each place that exposes a favorite action. Open `/favorites` from the header and account.
2. Open the saved product, reload, and check the documented persistence behavior after sign-out/in.
3. Check duplicate saves, empty-state CTA, missing/unavailable product, and Customer B's session.

Expected: hearts and list agree; clicking a heart does not accidentally open the product; no duplicates. If favorites are device-local rather than account-backed, document that limitation explicitly and do not claim cross-device persistence.

### F07 — Custom mattress builder · P0

1. Enter `/build-your-mattress` from the home customization CTA and navigation.
2. Change dimensions, material/layers, firmness, and other available choices; record the summary and recalculated amount.
3. Exercise minimum/maximum and invalid dimensions, unsupported combinations, and mobile controls.
4. Add the configuration to cart, reload, change quantity, and continue to checkout.

Expected: all confirmed configuration details survive through cart, checkout, order records, and customer tracking. Server rejects tampered client prices/configurations; a display-only calculator is not sufficient.

### F08 — Cart lifecycle · P0

1. Add one mattress variant and one other purchasable product; add the same variant twice, then a different variant of the same mattress.
2. Increase/decrease quantity, remove an item, empty the cart, and use its browse CTA.
3. Reload and sign out/in; confirm the promised cart persistence. Repeat with Customer B.
4. Check guest-to-login behavior: no lost confirmed selection or unannounced loss/duplication of cart items.
5. Double-click Add/Update and simulate an interrupted request. Revisit a cart after a catalogue price/availability change in the approved test environment.

Expected: counts, line totals, subtotal, charges, and final total agree. Distinct variants remain distinct; quantity never becomes negative/zero unexpectedly. B cannot access A's cart. UI errors leave a recoverable, consistent state.

### F09 — Checkout and Razorpay test success · P0

1. Sign in as A and checkout the known cart using the approved test address. Exercise mandatory-field, phone, postcode, and empty-cart validation.
2. Compare product/configuration summaries and totals with cart and the server-calculated order.
3. Start payment once. Confirm the Razorpay checkout is in test mode and its amount/currency match the server order. Use provider-approved test payment details, never a live transaction.
4. Complete a successful test payment. Record the order number and masked provider order/payment references.
5. Confirm order appears in `/account` and `/account/orders/[orderNumber]`, then in the admin dashboard.

Expected: matching identity, items, address, amount, and payment across customer/admin/database/provider. Order becomes `confirmed` only after server verification; payment is `paid`/`captured` as appropriate. Converted cart is not accidentally reused or lost before success. Admin sees pending orders accurately as pending, not falsely paid.

### F10 — Payment cancel, failure, retry, and duplicate callback · P0

1. Cancel the test checkout, then exercise provider test failure. Confirm no paid confirmation or converted cart.
2. Retry from the recovery action and ensure no extra charge or duplicate paid order. Double-click payment initiation.
3. In the isolated test environment, interrupt navigation/connectivity after provider success but before browser verification, then reload account/cart.
4. Use approved automated/API tests to submit an invalid signature, mismatched order/payment, Customer B's order reference, and a repeated valid callback.

Expected: invalid/foreign confirmations are rejected. Retrying/replaying is idempotent: one paid payment and one logical confirmation, without duplicated status history. Provider success must remain recoverable even if the browser closes. If webhook/reconciliation is missing, record this as a production blocker rather than treating browser-only success as payment reliability.

### F11 — Admin order and delivery → customer tracking · P0

1. Sign in as admin. Confirm Home appears before Products, Interior navigation works, and menu labels have readable spacing.
2. Locate F09's order; compare customer name/email/phone, payment, total, timestamp, and order number with A's account.
3. Save `in_production` / `not_ready`; then `in_production` / `scheduled` with ETA; then `dispatched` / `dispatched`; finally `delivered` / `delivered`.
4. After each save, reload admin and refresh A's order page. Compare status, ETA, and customer-visible timeline, allowing only a documented propagation delay.
5. On separate approved test orders, exercise delivery `failed`, ETA correction/clearing, and `cancelled`. Try invalid statuses/dates and incompatible transitions in backend tests.
6. Recheck A's profile after A edits personal info; verify admin customer information is current.

Expected: persisted changes are visible to the correct customer. No contradictory status combinations, duplicate history, hidden failed saves, or ability to reverse terminal states without a defined policy. Delivery scheduling remains distinct from production status; ETA edits are observable even if status is unchanged. Cancelling an order is not proof of a payment refund.

### F12 — Admin catalogue/pricing and analytics · P1

1. In `/admin/categories`, inspect Interior and its three children. Edit an approved test category's label/order/visibility; save and verify storefront plus reload. Restore baseline.
2. In `/admin/products`, change an approved test product's fixed/indicative price/range, check validation and storefront display, then restore baseline.
3. Verify invalid prices, reversed ranges, missing fields, and concurrent edits do not silently corrupt data.
4. Compare paid revenue, active orders, out-for-delivery count, and customer count with the labelled test records. Failed/unpaid payments must not add paid revenue.
5. Check the dashboard with more than 30 orders: current code loads the latest 30, so verify metrics disclose that window or log misleading all-time totals as a failure. Check older orders remain manageable if full order management is promised.

Expected: admin edits persist and update the correct records; customer access cannot mutate them. Financial values have an explicit scope and agree with their underlying order set.

### F13 — Authorization and safe error handling · P0

1. Open admin pages as guest and Customer B. Verify no dashboard/customer information appears before denial.
2. In approved automated/API tests, attempt customer/unauthenticated writes to admin order, category, and pricing endpoints; foreign cart/profile/order access; client-price changes; and unsafe return URLs.
3. Test unavailable database, failed profile/category save, missing product, and payment-configuration errors in the isolated environment.
4. Inspect browser network bundles/errors for accidentally exposed service-role, Razorpay-secret, or other private keys. Never paste secret values into reports.

Expected: unauthenticated actions are rejected, unauthorized actions forbidden, and invalid input safely rejected. No role escalation, cross-customer disclosure, misleading success, stack traces, or secrets. Retry works without erasing previously saved data.

## 4. UI walkthrough — apply to every affected route

Cover `/`, `/shop`, `/search`, representative mattress/sofa/bed/Interior product pages, `/interiors` and all children, builder, favorites, cart, checkout, account/order detail, login/register, and all three admin pages.

| Check | Required result |
| --- | --- |
| Logo/header | Left-aligned logo on white background; centered Mattresses tagline; no cropped logo; clicking returns home; sticky search stays usable. |
| Home slideshow | Full horizontal width; desktop approximately 5:1, tablet 26vw within 240–300px, mobile approximately 1.54:1 within 208–273px; arrows/dots work; text/image crop readable. |
| Home content | Make Your Own Mattress and Meet Our Interior Experts have correct destinations; Minds Behind Sleep Excellent uses actual supplied portraits/roles. |
| Theme | Existing warm palette, Syne headings, Geist body/controls/prices, consistent rounded boxes, spacing and interaction states. Do not restore older conflicting square-corner styling. |
| Menus/forms/cards | No overlapping labels, select arrows, ticks, clipping, orphan text, false selected states, or inert grid/list controls. |
| Scroll/bottom | Scroll to the actual footer; no extra blank iframe area or phantom viewport. Short-page whitespace before the footer is not the same as a trailing blank panel after it. |
| Contact dock | Chat placeholder, WhatsApp, and Call remain bottom-right at the same viewport position while scrolling; clickable; no collision with purchase bars, keyboard, or popup. Placeholder phone numbers are not a real contact integration. |
| Responsive layout | No page-wide horizontal overflow; admin tables may scroll within their labelled container. Touch targets, navigation, filters, and variant picker remain usable at narrow widths. |
| Accessibility | Keyboard-operable menus/forms, visible focus, named controls, announced validation, readable contrast, 200% zoom, dialog focus trap/return, Escape and reduced-motion support. |
| Loading/error/empty | Slow network, blocked images/fonts, empty cart/favorites/results/orders, failed requests, and not-found states remain readable and actionable. Homepage content must not collapse if third-party images fail. |

Capture each route at the top, a meaningful interaction state, and the bottom. Repeat scrolling after resize/orientation change and font/image completion. Compare desktop/tablet/mobile screenshots against the current brief, not obsolete snapshots; review differences before approving any baseline update.

## 5. Execution order, automation, and release gate

1. Smoke: F01, F03 login, F05 confirmed variant, F08 cart, home/shop/product scroll and contact-dock UI checks.
2. Golden journey: F09 → F11, with the same order number and Customer B isolation from F04.
3. Failure/security: F10 and F13. These are release-critical even when the golden journey works.
4. Extended: F02, F06, F07, F12, then the complete responsive/accessibility walkthrough.
5. Run lint, typecheck, unit tests and production build. Map Playwright cases to these flow IDs; use deterministic test data and purposeful waits, not arbitrary sleeps or uncontrolled third-party load completion.

Current `tests/e2e` contains older static-cart, checkout, tracking, product and screenshot assumptions. Audit those against the current authenticated/database-backed routes before treating the suite as acceptance coverage. Keep a homepage-height regression check for **both** desktop and mobile. Add automated business checks for server pricing, ownership, payment verification/idempotency, admin transitions/persistence, and customer-visible history; supplement with manual real-touch/email/provider checks.

Release gate: all P0 cases pass in the intended environment, no unresolved security/payment/data-loss defect, critical pages usable at all three standard widths, no trailing blank-page regression, and customer/admin/provider evidence agrees. Unconfigured Google login/chatbot may be explicitly deferred and labelled; missing payment recovery, incorrect production contact details, or misleading prices/analytics cannot be hidden by checking off a UI phase.

## 6. Result and defect templates

## 7. Initial execution record — 17 September 2026

| Flow / check | Result | Evidence / outcome |
| --- | --- | --- |
| Automated unit, type, lint | Pass with warnings | Vitest: 1/1 passing; TypeScript passes; ESLint has six existing warnings and no errors. |
| F01 public routes and responsive home | Pass (targeted) | Login popup, live home visibility, and public collection routes exercised by Chromium at 390px, 768px, and 1440px. |
| F03 unauthenticated protected entry | Fixed and pass | `/cart` and `/checkout` now redirect server-side to their safe login return destination instead of leaving an unauthenticated customer on a loading screen. |
| F05 product variant confirmation | Automated coverage added | Native product detail test checks description, selection changes, confirmation, and Add to cart availability. |
| Homepage trailing blank panel | Fixed and pass | Mobile iframe now uses document scroll height as well as element bounds; focused browser regression check passes. |
| F04, F06–F13 authenticated/payment/admin flows | Blocked | Requires controlled Customer A/Customer B/admin sessions, email inbox verification, Supabase test-data access, and a confirmed Razorpay test-mode setup. No credentials or transactions were fabricated. |
| Legacy static-page visual/cart tests | Needs replacement | Older tests expect iframe-based cart/checkout/tracking/product pages that the current app has replaced with native authenticated routes. They are not valid release evidence until rewritten around the current database-backed flows. |

The product, auth, and homepage regressions above were checked locally. The public product detail was also opened on the deployed site and its description, pricing label, series controls, size controls, and variant-confirmation UI were visible. Re-run this record after deploying any fixes and after the blocked credentials are available.

For every executed case, record:

| Run / flow ID | Commit / environment | Browser / viewport | Result | Expected vs actual | Order/product reference | Evidence / defect |
| --- | --- | --- | --- | --- | --- | --- |
| Pending | Pending | Pending | Not run | Pending | Masked/test-only | Pending |

Defect report: flow ID; severity (P0 security/payment/data loss, P1 broken key feature, P2 visual/usability); exact reproduction steps; expected and actual behavior; first failing step; screenshot/video; sanitized request/response; affected commit; fix commit; retest result.

After a fix: rerun the failing step, the entire dependent journey, and the relevant ownership/responsive checks. Do not declare the whole website passed because one screenshot, build, or isolated test succeeds.
