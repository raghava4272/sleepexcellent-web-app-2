-- SleepExcellent v1: catalog, identity, cart, order, payment, delivery and Storage foundation.
-- Run once on a fresh project through Supabase CLI or the Supabase SQL editor.

create extension if not exists pgcrypto;

create type public.user_role as enum ('customer', 'staff', 'admin');
create type public.product_status as enum ('draft', 'active', 'archived');
create type public.purchase_mode as enum ('direct', 'configurable', 'quote_only');
create type public.cart_status as enum ('active', 'converted', 'abandoned');
create type public.payment_status as enum ('pending', 'authorized', 'paid', 'failed', 'refunded', 'cancelled');
create type public.order_status as enum ('draft', 'pending_payment', 'confirmed', 'in_production', 'dispatched', 'delivered', 'cancelled');
create type public.delivery_status as enum ('not_ready', 'scheduled', 'dispatched', 'delivered', 'failed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  avatar_url text,
  phone text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null default 'Home', recipient_name text not null, phone text not null,
  line1 text not null, line2 text, locality text, landmark text, city text not null, state text not null,
  postal_code text not null check (postal_code ~ '^[0-9]{6}$'), country_code text not null default 'IN',
  is_default boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(), parent_id uuid references public.categories(id) on delete set null,
  name text not null, slug text not null unique, description text, image_path text, sort_order integer not null default 0,
  is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(), category_id uuid references public.categories(id) on delete set null,
  name text not null, slug text not null unique, short_description text, description text,
  purchase_mode public.purchase_mode not null default 'direct', status public.product_status not null default 'draft',
  featured boolean not null default false, seo_title text, seo_description text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null unique, alt_text text not null, sort_order integer not null default 0, created_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique, title text not null, option_values jsonb not null default '{}'::jsonb,
  price_paise integer not null check (price_paise >= 0), compare_at_price_paise integer check (compare_at_price_paise >= price_paise),
  stock_quantity integer not null default 0 check (stock_quantity >= 0), track_inventory boolean not null default true,
  made_to_order boolean not null default false, lead_time_days integer not null default 7 check (lead_time_days >= 0),
  is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.product_specifications (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  group_name text not null, label text not null, value text not null, sort_order integer not null default 0
);

create table public.configurator_option_groups (
  id uuid primary key default gen_random_uuid(), code text not null unique, name text not null,
  selection_type text not null check (selection_type in ('single','multiple','dimension')), sort_order integer not null default 0,
  is_active boolean not null default true
);
create table public.configurator_options (
  id uuid primary key default gen_random_uuid(), group_id uuid not null references public.configurator_option_groups(id) on delete cascade,
  code text not null, name text not null, description text, metadata jsonb not null default '{}'::jsonb,
  price_adjustment_paise integer not null default 0, sort_order integer not null default 0, is_active boolean not null default true,
  unique(group_id, code)
);
create table public.configurator_price_rules (
  id uuid primary key default gen_random_uuid(), name text not null, priority integer not null default 100,
  conditions jsonb not null default '{}'::jsonb, calculation jsonb not null default '{}'::jsonb,
  valid_from timestamptz, valid_until timestamptz, is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.carts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  status public.cart_status not null default 'active', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index carts_one_active_per_user on public.carts(user_id) where status = 'active';
create table public.cart_items (
  id uuid primary key default gen_random_uuid(), cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null, variant_id uuid references public.product_variants(id) on delete set null,
  quantity integer not null check (quantity > 0), configuration jsonb, configuration_hash text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (product_id is not null or configuration is not null)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(), order_number text not null unique,
  user_id uuid not null references public.profiles(id), payment_status public.payment_status not null default 'pending',
  order_status public.order_status not null default 'draft', delivery_status public.delivery_status not null default 'not_ready',
  currency text not null default 'INR', subtotal_paise integer not null default 0, delivery_paise integer not null default 0,
  tax_paise integer not null default 0, discount_paise integer not null default 0, total_paise integer not null default 0,
  delivery_address jsonb not null, customer_note text, admin_note text, estimated_delivery_date date,
  assigned_to uuid references public.profiles(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.order_items (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null, variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null, sku text, image_path text, unit_price_paise integer not null, quantity integer not null check (quantity > 0), line_total_paise integer not null,
  variant_snapshot jsonb not null default '{}'::jsonb, configuration_snapshot jsonb, price_breakdown jsonb not null default '{}'::jsonb
);
create table public.payments (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null default 'razorpay', provider_order_id text not null unique, provider_payment_id text unique,
  status public.payment_status not null default 'pending', amount_paise integer not null check (amount_paise >= 0), currency text not null default 'INR', method text,
  signature_verified_at timestamptz, paid_at timestamptz, failure_code text, failure_description text, provider_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.payment_webhook_events (
  id uuid primary key default gen_random_uuid(), provider_event_id text not null unique, event_type text not null, payload_hash text not null,
  status text not null default 'received', processed_at timestamptz, error_message text, created_at timestamptz not null default now()
);
create table public.shipments (
  id uuid primary key default gen_random_uuid(), order_id uuid not null unique references public.orders(id) on delete cascade,
  delivery_method text not null check (delivery_method in ('in_house','carrier')), carrier_name text, tracking_number text, tracking_url text,
  driver_name text, driver_contact_reference text, estimated_delivery_at timestamptz, dispatched_at timestamptz, delivered_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.order_status_events (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
  event_type text not null, from_status text, to_status text, note text, visible_to_customer boolean not null default false,
  actor_user_id uuid references public.profiles(id), created_at timestamptz not null default now()
);
create table public.site_settings (key text primary key, value jsonb not null, updated_at timestamptz not null default now());
create table public.serviceable_postal_codes (
  postal_code text primary key check (postal_code ~ '^[0-9]{6}$'), is_serviceable boolean not null default true,
  delivery_fee_paise integer not null default 0, estimated_min_days integer, estimated_max_days integer, updated_at timestamptz not null default now()
);

create index addresses_user_id_idx on public.addresses(user_id); create index products_category_status_idx on public.products(category_id, status);
create index variants_product_id_idx on public.product_variants(product_id); create index cart_items_cart_id_idx on public.cart_items(cart_id);
create index orders_user_created_idx on public.orders(user_id, created_at desc); create index orders_operational_idx on public.orders(order_status, delivery_status, created_at desc);
create index order_items_order_id_idx on public.order_items(order_id); create index status_events_order_created_idx on public.order_status_events(order_id, created_at);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into public.profiles (id, email, full_name, avatar_url) values (new.id, coalesce(new.email, ''), new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'avatar_url') on conflict (id) do nothing; return new; end; $$;
create or replace function public.prevent_untrusted_role_change() returns trigger language plpgsql security definer set search_path = public as $$
begin if new.role <> old.role and not public.is_admin() then raise exception 'role changes require an administrator'; end if; return new; end; $$;
create or replace function public.is_staff() returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.profiles where id = auth.uid() and role in ('staff','admin')); $$;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'); $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
create trigger profiles_prevent_untrusted_role_change before update on public.profiles for each row execute procedure public.prevent_untrusted_role_change();

do $$ declare t text; begin foreach t in array array['profiles','addresses','categories','products','product_variants','configurator_price_rules','carts','cart_items','orders','payments','shipments','site_settings','serviceable_postal_codes'] loop execute format('create trigger %I before update on public.%I for each row execute procedure public.set_updated_at()', t || '_updated_at', t); end loop; end $$;

alter table public.profiles enable row level security; alter table public.addresses enable row level security; alter table public.categories enable row level security; alter table public.products enable row level security; alter table public.product_images enable row level security; alter table public.product_variants enable row level security; alter table public.product_specifications enable row level security; alter table public.configurator_option_groups enable row level security; alter table public.configurator_options enable row level security; alter table public.configurator_price_rules enable row level security; alter table public.carts enable row level security; alter table public.cart_items enable row level security; alter table public.orders enable row level security; alter table public.order_items enable row level security; alter table public.payments enable row level security; alter table public.payment_webhook_events enable row level security; alter table public.shipments enable row level security; alter table public.order_status_events enable row level security; alter table public.site_settings enable row level security; alter table public.serviceable_postal_codes enable row level security;

create policy "public reads active categories" on public.categories for select using (is_active or public.is_staff());
create policy "public reads active products" on public.products for select using ((status = 'active') or public.is_staff());
create policy "public reads active variants" on public.product_variants for select using (is_active or public.is_staff());
create policy "public reads product media" on public.product_images for select using (exists (select 1 from public.products p where p.id = product_id and (p.status = 'active' or public.is_staff())));
create policy "public reads product specs" on public.product_specifications for select using (exists (select 1 from public.products p where p.id = product_id and (p.status = 'active' or public.is_staff())));
create policy "public reads active configurator" on public.configurator_option_groups for select using (is_active or public.is_staff());
create policy "public reads active options" on public.configurator_options for select using (is_active or public.is_staff());
create policy "users manage own profile" on public.profiles for select using (id = auth.uid());
create policy "users update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "users manage own addresses" on public.addresses for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users manage own carts" on public.carts for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users manage own cart items" on public.cart_items for all using (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid())) with check (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()));
create policy "users read own orders" on public.orders for select using (user_id = auth.uid() or public.is_staff());
create policy "users read own order items" on public.order_items for select using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_staff())));
create policy "users read own payments" on public.payments for select using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_staff())));
create policy "users read own shipments" on public.shipments for select using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_staff())));
create policy "users read visible order events" on public.order_status_events for select using (public.is_staff() or (visible_to_customer and exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())));
create policy "staff manages operational tables" on public.orders for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manages order items" on public.order_items for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manages payments" on public.payments for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manages shipments" on public.shipments for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manages events" on public.order_status_events for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manages catalog" on public.categories for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manages products" on public.products for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manages variants" on public.product_variants for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manages media" on public.product_images for all using (public.is_staff()) with check (public.is_staff());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values ('product-images', 'product-images', true, 10485760, array['image/jpeg','image/png','image/webp']) on conflict (id) do nothing;
create policy "public reads product images" on storage.objects for select using (bucket_id = 'product-images');
create policy "staff manages product images" on storage.objects for all using (bucket_id = 'product-images' and public.is_staff()) with check (bucket_id = 'product-images' and public.is_staff());
