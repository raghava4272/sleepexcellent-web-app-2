# SleepExcellent Ecommerce Web App

Implementation plan for the client-approved SleepExcellent direct-to-consumer storefront, custom mattress configurator, checkout, customer order tracking, and operations dashboard.

This repository will contain one production application with a responsive customer storefront, a protected admin dashboard, backend endpoints, Supabase data and authentication, Razorpay payments, and Vercel deployment. The approved Stitch project is the visual source of truth. Product and pricing data must come from the supplied catalog documents and then be managed in the admin dashboard.

## Project references

- Approved Stitch project: [SleepExcellent D2C Store & Custom Mattress Configurator](https://stitch.withgoogle.com/projects/14164775762318971387)
- Stitch project ID: `14164775762318971387`
- Supabase project URL: `https://punuebwalhaavrbtinkq.supabase.co`
- GitHub repository: `https://github.com/raghava4272/sleepexcellent-web-app-2.git`
- Deployment platform: Vercel
- Local source documents:
  - `Product_Category_Catalog.docx`
  - `SleepExcellent_Price_Catalogue-3.docx`
  - `logo.png`
  - `partner image files/`

Never commit Supabase keys, Razorpay secrets, Google OAuth secrets, or production customer data.

## Product goal

Build a polished ecommerce experience that reproduces the approved Stitch design and lets customers:

1. Discover mattresses, sofas, beds, and interior solutions.
2. Browse and filter products.
3. View product details, options, specifications, pricing, and imagery.
4. Configure a custom mattress and receive a server-calculated price.
5. Sign in with Google.
6. Add products or configured products to a persistent cart.
7. Pay securely with Razorpay.
8. View orders and follow delivery progress.

The admin team must be able to manage the catalog and handle orders from payment through production and delivery without developer assistance.

## Scope for version 1

### Included

- Responsive storefront matching the approved desktop and mobile designs
- Home, product listing, product detail, custom mattress builder, cart, checkout, payment result, account, orders, and order-detail pages
- Supabase Postgres database, Auth, Storage, and Row Level Security
- Google authentication through Supabase Auth
- Razorpay checkout, server-side signature verification, and webhooks
- Protected admin dashboard
- Product, category, price, stock, image, and visibility management
- Order search, filtering, status updates, internal delivery handling, tracking details, notes, and status history
- Customer order tracking
- Indian rupee pricing and India-oriented addresses
- Vercel preview and production deployments
- Automated checks for critical business logic and flows

### Deferred unless the client requests them

- Marketplace or multi-vendor support
- Automated courier aggregator integration
- GST invoicing or accounting integration
- EMI or financing beyond options exposed by Razorpay
- Returns portal, automated refunds, and exchange workflows
- Reviews, wishlists, loyalty points, coupons, and referral programs
- Multilingual content
- Native mobile applications
- Advanced CMS/page builder

Keep extension points for these features, but do not let them delay the version 1 release.

## Approved design inventory

Treat the Stitch screens as visual contracts, not loose inspiration. Reproduce their hierarchy, layout, typography, colors, spacing, sharp geometry, imagery, responsive behavior, and interaction states.

| Experience | Stitch screen ID | Planned route |
| --- | --- | --- |
| Desktop homepage | `b47374326ce94ce98f48aa0cf572edf9` | `/` |
| Mobile homepage | `bab9712dd0f844aaa222866f37a06576` | `/` at mobile breakpoints |
| Product listing page | `b682ee5d6d5d49c89fb4c5820f32fe1a` | `/shop` and `/shop/[category]` |
| Product detail page | `a50253816e2f461ea0b8665efbda3ebb` | `/products/[slug]` |
| Custom mattress builder | `1ca80fec3d0f4125946ebe56ca1d78b3` | `/build-your-mattress` |
| Shopping cart and review | `694b31bebef54283b3816132821e643b` | `/cart` |
| Secure checkout and payment | `873723e99d754d5881a1f8c036bb23dd` | `/checkout` |
| Order tracking and details | `43c427c5e5ec4343a198c8ab00e674ff` | `/account/orders/[orderNumber]` |

The two image-only Stitch assets are reference inputs, not standalone application routes.

### Design system rules

- Preserve the warm architectural palette, especially warm off-white surfaces, dark basalt text/actions, timber accents, and restrained signal red.
- Use the approved Syne and Geist font pairing through `next/font` or locally hosted font files.
- Use square corners and crisp one-pixel borders. Do not introduce generic rounded cards or soft shadows.
- Build a reusable token layer with CSS custom properties for color, typography, spacing, borders, and breakpoints.
- Use a 12-column desktop grid, 8-column tablet grid, and 4-column mobile grid.
- Preserve editorial whitespace in storytelling sections and denser technical spacing in specification and configuration sections.
- Ensure keyboard focus is clearly visible even where the design is visually restrained.
- Use optimized real assets; do not ship remote Stitch image URLs as production assets.
- Compare every completed page at desktop, tablet, and mobile widths against its Stitch reference before accepting it.

## Recommended architecture

Use a single Next.js application so the storefront, admin UI, server-rendered pages, and backend endpoints share types and deployment.

### Application stack

- Next.js App Router with TypeScript and strict type checking
- React Server Components by default; Client Components only for interactive controls
- Tailwind CSS plus CSS variables for the Stitch design tokens
- Supabase JavaScript clients for browser, server, and admin-only access
- Supabase Postgres, Auth, Storage, and Row Level Security
- Server Actions for authenticated first-party mutations where appropriate
- Route Handlers for Razorpay, webhooks, public APIs, and integration boundaries
- Zod for all environment, form, API, and webhook validation
- React Hook Form for complex forms such as checkout and product editing
- A small client store only for transient UI/cart state; persisted cart truth belongs in Supabase
- Razorpay Checkout on the client and Razorpay SDK/API calls only on the server
- Vitest for unit/integration tests and Playwright for end-to-end tests
- ESLint, Prettier, and a CI workflow for repeatable quality checks

Use currently supported package versions at implementation time and commit a lockfile. Avoid adding a separate Express server; Vercel route handlers and Supabase cover the required backend.

### High-level request flow

```text
Browser
  -> Next.js storefront/admin UI
  -> Server Components, Server Actions, and Route Handlers
  -> Supabase Auth/Postgres/Storage
  -> Razorpay API

Razorpay webhook
  -> /api/webhooks/razorpay
  -> signature verification and idempotency check
  -> payment/order/status-event transaction
  -> customer order page and admin dashboard
```

## Repository structure

```text
app/
  (store)/
    page.tsx
    shop/
    products/[slug]/
    build-your-mattress/
    cart/
    checkout/
    payment/
  (account)/
    account/
      page.tsx
      orders/
      addresses/
  admin/
    layout.tsx
    page.tsx
    orders/
    products/
    categories/
    inventory/
    customers/
    settings/
  auth/callback/route.ts
  api/
    checkout/razorpay/order/route.ts
    checkout/razorpay/verify/route.ts
    webhooks/razorpay/route.ts
components/
  ui/
  layout/
  commerce/
  configurator/
  checkout/
  admin/
lib/
  auth/
  supabase/
  razorpay/
  pricing/
  orders/
  validation/
  money/
supabase/
  migrations/
  seed.sql
  tests/
public/
  brand/
  products/
  partners/
tests/
  e2e/
  integration/
types/
```

Keep business rules in `lib/`, not inside page components. Generate database types from Supabase and use them throughout the app.

## Route and page plan

### Storefront

#### `/`

- Implement every approved homepage section in the Stitch order.
- Include the global announcement, navigation, hero, category/product storytelling, service/quality sections, partner content, and footer represented in the design.
- All product and category links must resolve to real database records.
- Use the mobile Stitch homepage as the mobile source of truth rather than merely stacking the desktop layout.

#### `/shop` and `/shop/[category]`

- Product grid with category, price, material, type, availability, and relevant attribute filters.
- Sort by featured, newest, price ascending, and price descending.
- Keep filters in URL search parameters so results are shareable and browser navigation works.
- Paginate on the server; do not fetch the entire catalog into the browser.
- Distinguish purchasable products from products that require a final quotation.

#### `/products/[slug]`

- Product image gallery, name, category, price/range, short description, full description, specifications, materials, variants, availability, quantity, and primary action.
- Server-select a valid default variant and recalculate availability and price when options change.
- Add structured metadata, canonical URLs, Open Graph data, product JSON-LD, and descriptive image alt text.
- For quotation-only interior projects, replace direct purchase with a clearly labeled enquiry/quotation action in a later scoped feature; version 1 may mark them unavailable for checkout.

#### `/build-your-mattress`

- Follow the approved step order and layout.
- Model dimensions, thickness, mattress type/material, firmness/comfort, and add-ons as database-backed choices.
- Price exclusively on the server from active configuration rules. The browser may display estimates but cannot be the pricing authority.
- Show a configuration summary, dimensions, lead-time estimate, final price, and a stable configuration code.
- Store the complete selected configuration and price breakdown in the cart and later snapshot it into the order item.
- Reject impossible or inactive option combinations on both client and server.

#### `/cart`

- Support standard variants and custom configurations.
- Quantity changes and removal must update the persisted cart for signed-in users.
- Revalidate price, variant status, and stock before showing a checkout-ready total.
- Display subtotal, delivery charge, tax fields if enabled, discount placeholders, and grand total.
- Never trust totals supplied by the client.

#### `/checkout`

- Require Google sign-in before payment.
- Collect or select a saved Indian delivery address with recipient name, phone, address lines, locality, city, state, PIN code, and landmark.
- Validate serviceability through a configurable PIN-code table or an initial all-India/manual policy.
- Present a final immutable order summary and terms acknowledgement.
- Create the internal order and Razorpay order on the server, then open Razorpay Checkout.
- Provide retry behavior for failed or abandoned payments without duplicating orders.

#### `/payment/success` and `/payment/failed`

- Success must be based on server-verified payment state, not query parameters from the browser.
- Show the order number and next steps after verified payment.
- A failed or pending page should let the customer safely retry when allowed.

#### `/account` and `/account/orders`

- Profile summary, saved addresses, order list, and sign-out.
- Users can read only their own records under RLS.
- `/account/orders/[orderNumber]` mirrors the approved tracking design with item snapshots, payment status, fulfillment timeline, delivery/tracking details, address snapshot, totals, and customer-visible notes.

### Admin dashboard

All `/admin` routes require an authenticated user whose server-verified profile role is `admin` or `staff`. Hiding navigation is not authorization. Enforce access in server code and RLS.

#### `/admin`

- Summary cards: paid revenue, new orders, orders awaiting action, in production, ready to dispatch, out for delivery, and delivered.
- Recent orders and operational alerts.
- Date filters with Asia/Kolkata reporting boundaries.

#### `/admin/orders`

- Search by order number, customer name, email, phone, payment ID, and tracking number.
- Filter by date, payment state, order state, fulfillment state, delivery state, and product category.
- Sort newest first by default.
- Bulk export the filtered view to CSV only after the basic workflow is stable.

#### `/admin/orders/[id]`

- Customer and delivery address snapshot
- Ordered items, selected variants, and custom mattress configuration
- Server-calculated price breakdown and Razorpay references
- Payment status and verified webhook history
- Internal notes and customer-visible delivery note
- Assignment to a staff member
- Production and delivery status controls
- Estimated delivery date
- Delivery method: in-house or external carrier
- Driver/carrier name, contact reference, tracking number, and tracking URL when applicable
- Status timeline with actor and timestamp
- Guarded transitions so an unpaid order cannot become ready for delivery accidentally
- Manual payment reconciliation action only for administrators, with an audit entry

Recommended order lifecycle:

```text
pending_payment -> paid -> confirmed -> in_production -> ready_for_dispatch
-> shipped/out_for_delivery -> delivered

Exceptional paths: payment_failed, cancelled, refund_pending, refunded
```

Record payment, fulfillment, and delivery as separate state fields so operational changes do not overwrite financial history.

#### `/admin/products` and `/admin/products/[id]`

- Create/edit product identity, category, slug, descriptions, specifications, badges, SEO fields, purchase mode, status, and featured position.
- Create/edit variants, SKUs, option values, prices, compare-at prices, lead times, and stock state.
- Upload and reorder product images in Supabase Storage with alt text.
- Use draft/active/archived status instead of destructive deletion.

#### `/admin/categories`

- Manage category names, hierarchy, slugs, descriptions, images, sort order, and visibility.
- Seed the supplied Mattress, Sofas, Padding Beds, and Interior hierarchy.

#### `/admin/inventory`

- Simple variant-level stock quantity, made-to-order flag, low-stock threshold, and availability state.
- Version 1 does not require warehouse management.

#### `/admin/customers`

- Read-only customer summary and order history.
- Do not expose authentication secrets or unnecessary private data.

#### `/admin/settings`

- Delivery rules, default lead-time text, support details, public contact information, and storefront settings.
- Secrets remain in Vercel/Supabase environment settings, never editable in the browser.

## Database plan

Use UUID primary keys except where an external identifier is explicitly stored. Use `timestamptz`, `created_at`, and `updated_at` consistently. Store money as integer paise, never floating-point rupees. Add indexes for every foreign key and common admin/search filter.

### Identity and access

#### `profiles`

- `id uuid primary key references auth.users(id)`
- `email text`
- `full_name text`
- `avatar_url text`
- `phone text`
- `role text check in ('customer','staff','admin') default 'customer'`
- timestamps

Create profiles from an Auth trigger. Never accept `role` from client-controlled signup metadata. Bootstrap the first admin by migration or a one-time server-side script using an explicit approved email.

#### `addresses`

- `id`, `user_id`, `label`, `recipient_name`, `phone`
- `line1`, `line2`, `locality`, `landmark`, `city`, `state`, `postal_code`, `country_code`
- `is_default`, timestamps

### Catalog

#### `categories`

- `id`, `parent_id`, `name`, `slug`, `description`
- `image_path`, `sort_order`, `is_active`, timestamps

#### `products`

- `id`, `category_id`, `name`, `slug`, `short_description`, `description`
- `purchase_mode check in ('direct','configurable','quote_only')`
- `status check in ('draft','active','archived')`
- `featured`, `seo_title`, `seo_description`, timestamps

#### `product_images`

- `id`, `product_id`, `storage_path`, `alt_text`, `sort_order`, timestamps

#### `product_variants`

- `id`, `product_id`, `sku`, `title`
- `option_values jsonb`
- `price_paise`, `compare_at_price_paise`
- `stock_quantity`, `track_inventory`, `made_to_order`, `lead_time_days`
- `is_active`, timestamps

#### `product_specifications`

- `id`, `product_id`, `group_name`, `label`, `value`, `sort_order`

### Custom mattress configuration

#### `configurator_option_groups`

- `id`, `code`, `name`, `selection_type`, `sort_order`, `is_active`

Examples: size, custom dimensions, thickness, mattress type, firmness, comfort layer, and add-ons.

#### `configurator_options`

- `id`, `group_id`, `code`, `name`, `description`, `metadata jsonb`
- `price_adjustment_paise`, `sort_order`, `is_active`

#### `configurator_price_rules`

- `id`, `name`, `priority`, `conditions jsonb`, `calculation jsonb`
- `valid_from`, `valid_until`, `is_active`, timestamps

Keep the rule model intentionally small in version 1. Add a tested server function that accepts normalized selections and dimensions and returns the authoritative base price, adjustments, total, lead time, and rule-version reference.

### Cart

#### `carts`

- `id`, `user_id`, `status check in ('active','converted','abandoned')`, timestamps
- Partial unique index allowing one active cart per user

#### `cart_items`

- `id`, `cart_id`, `product_id`, nullable `variant_id`, `quantity`
- nullable `configuration jsonb`, nullable `configuration_hash`
- timestamps

Do not store a trusted item total in the cart. Recalculate from current catalog/configuration rules at every server-side read used for checkout.

### Orders, payments, and delivery

#### `orders`

- `id`, human-readable unique `order_number`, `user_id`
- `payment_status`, `order_status`, `fulfillment_status`, `delivery_status`
- `currency default 'INR'`
- `subtotal_paise`, `delivery_paise`, `tax_paise`, `discount_paise`, `total_paise`
- `delivery_address jsonb` as an immutable snapshot
- `customer_note`, `admin_note`, `estimated_delivery_date`
- `assigned_to`, timestamps

#### `order_items`

- `id`, `order_id`, `product_id`, nullable `variant_id`
- snapshot fields: `product_name`, `sku`, `image_path`, `unit_price_paise`, `quantity`, `line_total_paise`
- `variant_snapshot jsonb`, `configuration_snapshot jsonb`, `price_breakdown jsonb`

Order item snapshots must remain valid even if the catalog changes later.

#### `payments`

- `id`, `order_id`, `provider default 'razorpay'`
- unique `provider_order_id`, nullable unique `provider_payment_id`
- `status`, `amount_paise`, `currency`, `method`
- `signature_verified_at`, `paid_at`, `failure_code`, `failure_description`
- sanitized `provider_payload jsonb`, timestamps

Do not store card data. Store only identifiers and non-sensitive payment metadata returned by Razorpay.

#### `payment_webhook_events`

- `id`, unique `provider_event_id`, `event_type`, `payload_hash`
- `status`, `processed_at`, `error_message`, timestamps

This table makes webhook handling idempotent and auditable.

#### `shipments`

- `id`, `order_id`, `delivery_method check in ('in_house','carrier')`
- `carrier_name`, `tracking_number`, `tracking_url`
- `driver_name`, `driver_contact_reference`
- `estimated_delivery_at`, `dispatched_at`, `delivered_at`
- timestamps

#### `order_status_events`

- `id`, `order_id`, `event_type`, `from_status`, `to_status`
- `note`, `visible_to_customer`, `actor_user_id`, `created_at`

Use this as the source for customer and admin timelines.

### Storefront configuration

#### `site_settings`

- Singleton/key-value settings for public support details, delivery copy, announcement text, and feature flags

#### `serviceable_postal_codes`

- `postal_code`, `is_serviceable`, `delivery_fee_paise`, `estimated_min_days`, `estimated_max_days`

The table may initially be empty with a documented manual/all-India fallback policy.

## Row Level Security plan

Enable RLS on every exposed table.

- Anonymous users: read active categories, active products, active variants, public product images/specifications, and non-sensitive site settings.
- Customers: read/update their own profile and addresses; read/write their own active cart; read their own orders, order items, payments, shipments, and customer-visible status events.
- Staff: read catalog and customer/order data required for fulfillment; update permitted operational order and delivery fields.
- Admins: full catalog and operational access through explicit policies and server-side checks.
- Webhooks and privileged admin mutations: use the server-only service-role client after independently verifying authorization/signatures.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to client code or variables prefixed with `NEXT_PUBLIC_`.
- Use SQL helper functions such as `is_admin()`/`is_staff()` with stable, reviewable policies to avoid copying role logic incorrectly.
- Test every policy with anonymous, customer A, customer B, staff, admin, and service-role cases.

## Authentication plan

1. Configure Google as a provider in Supabase Auth.
2. Configure the Google OAuth consent screen and client credentials.
3. Add local, Vercel preview, and production callback URLs in Google, Supabase, and the application allowlist.
4. Start OAuth with Supabase and return through `/auth/callback`.
5. Exchange the authorization code on the server and refresh cookies through supported Supabase SSR helpers.
6. Create/update the profile using trusted Auth identity data.
7. Preserve a safe same-origin `next` path so users return to checkout or the page they started from.
8. Protect `/account/**` and `/admin/**` on the server.
9. Verify admin/staff role again inside every privileged mutation.

Do not implement custom password storage. Add email/password authentication only if the client later requests it.

## Razorpay payment plan

### Create payment order

`POST /api/checkout/razorpay/order`

1. Require an authenticated customer.
2. Load the customer's active cart and selected address from Supabase.
3. Revalidate products, variants, configurations, serviceability, stock, and price on the server.
4. Calculate integer-paise totals on the server.
5. Create the internal order and item snapshots with `pending_payment` state.
6. Create a Razorpay order with the same total/currency and the internal order number in notes.
7. Save the Razorpay order ID and return only the safe checkout fields to the browser.

### Verify browser payment response

`POST /api/checkout/razorpay/verify`

1. Validate the returned Razorpay order ID, payment ID, and signature.
2. Load the matching internal payment record.
3. Verify the HMAC signature with `RAZORPAY_KEY_SECRET` using a timing-safe comparison.
4. Mark the browser response as verified, but let webhook reconciliation remain authoritative for final provider state.
5. Return the internal order number for navigation.

### Process webhooks

`POST /api/webhooks/razorpay`

1. Read the raw request body before parsing JSON.
2. Verify `X-Razorpay-Signature` with `RAZORPAY_WEBHOOK_SECRET`.
3. Reject invalid signatures.
4. Insert a unique webhook-event record before processing.
5. Handle the required payment captured, failed, order paid, and refund events.
6. Check amount, currency, provider order ID, and internal order mapping.
7. Update payment, order, and status-event records atomically.
8. Treat duplicate events as successful no-ops.
9. Clear/convert the cart only after verified payment.
10. Log safe identifiers, never full sensitive payloads or secrets.

Use Razorpay test mode through staging and switch to live keys only after the full webhook flow passes.

## Initial catalog import

Seed the supplied data rather than hardcoding it in UI components.

### Categories and subcategories

- Mattresses: Ortho, Ortho Plus, Latex, Latex Pro, Pocketed Spring, Bonnell Spring, Foam, Memory Foam, Feel Good, and Shim.
- Sofas: L-shape, European/Excellent, Indian Traditional, Head Rest, Chester, Fiber Back, Prussian/Italian style, Camel Back, Classic/Rock style, Recliner, Cloud/Modern, Premium, Cabin, Sectional, U-shape, and Corner.
- Beds: Classic Headboard, Roman, Luxury Headboard, Round/Colony, Dream Night, Teak Wood, Polished/Lifestyle, Shadhi/Wood Rock, Kerala Teak, and Inbuilt Plywood.
- Interiors: TV units, modern kitchens, and bedroom/false ceiling solutions from the supplied category catalog.

Where the category and price documents use different names, create one canonical product name and preserve the source name as import metadata until the client confirms the mapping.

### Price data

- Import the supplied sofa, bed, and mattress prices as initial variant prices.
- Store all imported amounts in paise.
- Mattress source size is generally `72 x 75 x 6 in`, except the Shim entry at `72 x 75 x 1 in`.
- Ceiling solutions use price-per-square-foot ranges and should be `quote_only` in version 1 unless the client approves an exact calculator.
- Catalog prices are explicitly indicative and can change with size, material, finish, customization, transport, and installation. Show a managed disclaimer and ensure the admin can update prices before launch.

Add a documented seed script that is safe to run on an empty development database and cannot silently overwrite production edits.

## Media plan

- Move the approved logo and production-ready images into organized local/public or Supabase Storage locations.
- Use Supabase Storage buckets such as `product-images` and `site-assets`.
- Public catalog images can use a public bucket; private operational documents must use a private bucket with signed URLs.
- Validate MIME type and file size server-side for admin uploads.
- Generate stable paths and optimized display sizes.
- Require useful alt text for every catalog image.
- Confirm rights and client approval before publishing supplied people/partner photographs.

## Environment variables

Create `.env.example` with names only and document each variable.

```dotenv
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=https://punuebwalhaavrbtinkq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

INITIAL_ADMIN_EMAIL=
```

Requirements:

- Validate required variables at startup with separate browser-safe and server-only schemas.
- Use different Supabase/Razorpay credentials for local, preview/staging, and production where available.
- Set secrets in Vercel project settings and local `.env.local`; never in source control.
- Set the same production site URL consistently in Vercel, Supabase Auth, Google OAuth, Razorpay webhooks, metadata, and redirects.

## Detailed implementation phases

Terra should complete and verify each phase before starting the next. Use focused commits and keep the app deployable after every phase.

### Phase 0: repository and requirements baseline

- Initialize the Next.js TypeScript application and commit the lockfile.
- Add lint, type-check, unit-test, and end-to-end commands.
- Add `.env.example`, `.gitignore`, formatting, and CI.
- Preserve the source catalogs and brand assets in a documented location only if the client intends them to live in Git.
- Record the Stitch project and screen IDs in code documentation.
- Create a traceability checklist mapping each approved screen to its route and acceptance screenshot.
- Decision gate: confirm production domain, business contact details, delivery coverage, GST/tax behavior, cancellation policy, final catalog naming, and first admin email.

**Exit criteria:** clean install; lint/type/test commands run; Vercel preview renders a placeholder; no secrets are committed.

### Phase 1: design foundation and application shell

- Extract the Stitch tokens into CSS variables and Tailwind theme values.
- Configure Syne and Geist.
- Build accessible primitives: button, link, input, select, checkbox/radio, dialog/drawer, table, status badge, quantity stepper, image frame, and skeleton.
- Build shared announcement bar, header, desktop navigation, mobile navigation, breadcrumb, footer, and content/grid containers.
- Add loading, empty, not-found, and error states consistent with the design.
- Create visual regression screenshots at mobile, tablet, and desktop sizes.

**Exit criteria:** the shell and primitives match the approved visual language and pass keyboard/focus checks.

### Phase 2: Supabase foundation and seed catalog

- Set up Supabase local configuration and migration workflow.
- Create enums/check constraints, tables, indexes, update-timestamp triggers, and generated database types.
- Add profile trigger and role helpers.
- Add RLS policies and SQL policy tests.
- Create Storage buckets and policies.
- Write an idempotent development seed/import for categories and the supplied catalog prices.
- Add server/browser/service-role Supabase client factories with strict boundaries.

**Exit criteria:** a fresh database can be migrated and seeded; customer isolation and admin access are proven by tests.

**Implementation status:** schema, RLS policies, the `product-images` Storage bucket policy, supplied mattress-price seed, Supabase SSR clients, and an OAuth callback route are committed. The supplied project URL is recorded, but applying the migration and enabling Google OAuth require an authenticated Supabase administrator and the private anon/publishable, service-role, and Google OAuth credentials. See `docs/supabase-setup.md`.

### Phase 3: public storefront

- Implement the responsive homepage from both Stitch references.
- Implement server-rendered listing pages, filters, sort, pagination, and empty states.
- Implement product detail, gallery, variant selection, specifications, structured metadata, and cart action.
- Build admin-independent fixtures only temporarily; remove them when the database queries are complete.
- Optimize images, fonts, metadata, and critical rendering.

**Exit criteria:** all public navigation works with seeded data; desktop/mobile screenshots are approved; pages remain useful without JavaScript where practical.

### Phase 4: Google authentication, account, and cart

- Configure Supabase Google Auth and callback handling.
- Add sign-in, sign-out, session refresh, protected routes, and safe redirects.
- Implement profile and saved addresses.
- Implement one active persisted cart per authenticated customer.
- Optionally support an anonymous local cart, but merge it only after explicit, tested conflict rules.
- Implement cart validation and totals on the server.

**Exit criteria:** two test customers cannot access each other's records; sign-in return paths work; cart survives sessions.

### Phase 5: custom mattress builder

- Seed option groups, options, compatibility rules, and initial pricing rules.
- Implement the approved builder steps and responsive layout.
- Add the normalized pricing service with exhaustive unit tests.
- Add configuration validation, summary, hash/code, cart persistence, and lead-time display.
- Preserve the full configuration and pricing breakdown through cart and order item snapshots.

**Exit criteria:** valid configurations price consistently on client display and server authority; tampered requests fail; invalid combinations cannot enter the cart.

### Phase 6: checkout and Razorpay

- Implement address selection/creation and serviceability validation.
- Implement server-side order creation and immutable item/address snapshots.
- Integrate Razorpay test Checkout.
- Implement signature verification, raw-body webhook verification, idempotent event handling, and reconciliation.
- Add success, pending, failure, and safe retry states.
- Prevent duplicate submission with idempotency keys and disabled/loading states.

**Exit criteria:** captured, failed, abandoned, retried, duplicate-webhook, invalid-signature, and amount-mismatch scenarios all pass in test mode.

### Phase 7: customer orders and tracking

- Implement account order list and order detail.
- Build the customer-visible status timeline from status events.
- Display delivery estimate, method, tracking information, and visible notes.
- Add secure server queries and RLS tests for all order-related tables.

**Exit criteria:** a customer sees accurate history for only their orders and never internal-only notes.

### Phase 8: admin dashboard and delivery operations

- Add server-enforced admin/staff route protection.
- Build dashboard summary queries and recent operational work queue.
- Implement order table search, filters, pagination, and detail workflow.
- Implement guarded order/production/delivery transitions and audit events.
- Add assignment, ETA, in-house/carrier delivery fields, customer-visible notes, and delivered confirmation.
- Implement category, product, variant, price, availability, image, and inventory management.
- Add a safe first-admin bootstrap and document staff onboarding.

**Exit criteria:** staff can take a paid test order from confirmation through delivery without database-console access; every status change is attributable and visible in the correct timeline.

### Phase 9: quality, security, and performance hardening

- Validate every trust boundary with Zod and enforce authorization server-side.
- Review RLS, service-role usage, webhook verification, redirect safety, and sensitive logging.
- Add rate limiting to payment creation, verification, and other abuse-sensitive endpoints.
- Add security headers and a Content Security Policy compatible with Razorpay.
- Test keyboard navigation, screen readers, contrast, touch targets, reduced motion, and form errors.
- Test Chrome, Safari, Firefox, Android, and iOS layouts.
- Meet agreed performance budgets for Core Web Vitals and image weight.
- Add error monitoring and structured logs with order IDs but no secrets or unnecessary personal data.

**Exit criteria:** no critical/high security findings; critical e2e tests pass; responsive and accessibility QA is signed off.

### Phase 10: Vercel release

- Connect the GitHub repository to Vercel.
- Configure preview and production environment variables.
- Configure the production domain and canonical site URL.
- Add Vercel URLs to Supabase Auth and Google OAuth redirect allowlists.
- Add the production webhook URL in Razorpay and verify live-mode signatures with a controlled transaction.
- Run production migrations before directing traffic.
- Seed/verify production categories, products, price values, admin account, delivery settings, and public business content.
- Run the release smoke checklist, then promote the verified deployment.
- Document rollback: redeploy the previous Vercel build and apply only forward-safe database fixes.

**Exit criteria:** production smoke tests pass, payment reconciliation is confirmed, and the admin team completes a delivery workflow using production-like test data.

## API and server-action contract

Use Server Actions for same-origin authenticated CRUD when they improve form handling. Use Route Handlers for integration boundaries and endpoints that need raw bodies or stable HTTP contracts.

Minimum backend interfaces:

| Interface | Responsibility |
| --- | --- |
| `GET /shop?...` server query | Active catalog filters, sort, and pagination |
| Product server query | Product, variants, images, and specifications by slug |
| Cart Server Actions | Add, update quantity, remove, and revalidate |
| Configurator pricing action | Validate selections and return authoritative quote |
| Address Server Actions | Customer-scoped create, update, delete, set default |
| `POST /api/checkout/razorpay/order` | Validate cart and create internal/provider orders |
| `POST /api/checkout/razorpay/verify` | Verify checkout signature and return internal order reference |
| `POST /api/webhooks/razorpay` | Verify and reconcile provider events |
| Admin product actions | Authorized catalog, variant, image, and inventory CRUD |
| Admin order actions | Authorized status, assignment, delivery, and note updates |

Return typed success/error results. Do not expose raw database or provider errors to users.

## Testing plan

### Unit tests

- Money formatting and paise arithmetic
- Cart totals
- Custom mattress compatibility and pricing rules
- Order number generation
- Order state-transition guards
- Razorpay payment and webhook HMAC verification
- Payload validation and safe redirect validation

### Database and integration tests

- RLS role matrix and cross-user isolation
- Profile creation trigger
- Catalog query visibility
- One-active-cart constraint
- Order/item/address snapshot integrity
- Payment and webhook idempotency
- Atomic payment/order transitions
- Admin audit/status event creation

### End-to-end tests

1. Browse homepage -> filter listing -> select variant -> cart.
2. Configure a mattress -> verify price -> cart.
3. Google Auth test/stub flow -> address -> checkout.
4. Razorpay test payment -> verified success -> order appears in account.
5. Failed/abandoned payment -> safe retry -> no duplicate fulfilled order.
6. Admin opens paid order -> confirms -> production -> dispatch -> delivery.
7. Customer sees each customer-visible delivery update.
8. Customer cannot access another customer's order or any admin route.
9. Staff permissions are narrower than admin permissions.
10. Mobile navigation, builder, cart, and checkout flows.

### Visual acceptance

- Capture consistent screenshots for each Stitch route at representative mobile and desktop widths.
- Compare header, footer, grids, typography, colors, borders, imagery, and main interactions.
- Document any unavoidable deviation and obtain client approval before release.
- Test long names, missing images, out-of-stock states, empty data, loading, failures, and narrow screens—not just the ideal seeded case.

## Security and privacy checklist

- [ ] No secrets or `.env.local` in Git history
- [ ] Service-role client imported only by server-only modules
- [ ] RLS enabled and tested on every exposed table
- [ ] Admin role checked on the server for every privileged operation
- [ ] Razorpay signatures verified before financial state changes
- [ ] Webhooks use raw-body verification and idempotency
- [ ] Payment totals recalculated server-side in paise
- [ ] Customer address/contact data minimized in logs
- [ ] File uploads validate type, size, authorization, and storage path
- [ ] OAuth redirects restricted to approved same-origin targets
- [ ] Content Security Policy and security headers configured
- [ ] Dependencies and lockfile scanned in CI
- [ ] Database backups and restore procedure documented

## CI and Git workflow

- Use `main` as the protected production branch.
- Create focused feature branches and pull requests.
- Require lint, type-check, unit/integration tests, build, and critical e2e checks before merge.
- Let Vercel create a preview deployment for each pull request.
- Keep database changes in ordered Supabase migrations; never make undocumented production-only schema edits.
- Use Conventional Commit-style messages where practical.
- Do not commit generated build folders, local environment files, payment payload dumps, or customer exports.

Recommended scripts:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:e2e": "playwright test",
  "db:types": "supabase gen types typescript --local > types/database.ts"
}
```

## Release readiness checklist

### Business content

- [ ] Client confirms canonical product names where the two catalogs differ
- [ ] Client confirms final prices, tax/GST behavior, delivery fees, and serviceable locations
- [ ] Client confirms support email, phone, address, policies, and social links
- [ ] Product descriptions, specifications, stock behavior, lead times, and images are approved
- [ ] Terms, privacy, shipping, cancellation, refund, and warranty content is approved

### Technical readiness

- [ ] Fresh clone installs and builds from documented commands
- [ ] Fresh Supabase environment migrates and seeds successfully
- [ ] Google sign-in works on production domain
- [ ] Razorpay live keys and webhook secret are configured only in the correct environments
- [ ] Successful and failed live-mode controlled payment tests reconcile correctly
- [ ] Admin user and staff permissions are verified
- [ ] Delivery workflow is tested from paid to delivered
- [ ] Customer tracking matches the admin's customer-visible status history
- [ ] Monitoring, logs, backups, and rollback procedure are ready
- [ ] Lighthouse/Core Web Vitals and accessibility targets are accepted
- [ ] Client approves responsive visual comparison against Stitch

## Definition of done

Version 1 is complete only when:

1. Every approved customer screen has a responsive, data-backed implementation that matches Stitch.
2. Products, variants, prices, images, and availability can be managed without code changes.
3. Google authentication and customer data isolation work in production.
4. Razorpay test and live verification paths cannot mark unverified payments as paid.
5. A paid order appears in the admin dashboard and staff can manage production and delivery through to completion.
6. Customers can view their own order details and delivery timeline.
7. Database migrations, RLS policies, seeds, tests, and environment documentation are committed.
8. CI passes and the production Vercel deployment passes the release smoke test.
9. Secrets are absent from the repository and logs.
10. The client signs off on visual fidelity, catalog data, pricing, checkout, and operational workflow.

## Instructions for the implementation agent

When using Terra in light reasoning mode:

1. Read this README completely before changing code.
2. Inspect the linked Stitch project and the exact screen relevant to the current phase.
3. Work on one phase at a time and do not skip its exit criteria.
4. Start each phase by checking the current repository state and existing user changes.
5. Reuse the shared design tokens and components; do not invent an unrelated visual system.
6. Keep all authorization, totals, custom pricing, and payment verification on the server.
7. Add or update tests with each business rule.
8. Run the relevant lint, type-check, tests, and build before handing off a phase.
9. Summarize completed work, files changed, tests run, remaining risks, and the next README phase.
10. Stop and request a business decision only for an unresolved item that materially changes data, pricing, payment, delivery, or client-visible behavior.
