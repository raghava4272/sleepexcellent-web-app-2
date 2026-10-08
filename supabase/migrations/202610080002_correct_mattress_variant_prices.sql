-- Replace mattress prices with the corrected size/thickness catalogue.
-- Regular mattress prices scale from the supplied King 78 × 72 in, 6 in base
-- using the document's stated surface-area and thickness method.
update public.products as product
set purchase_mode = 'configurable'::public.purchase_mode,
    updated_at = now()
from public.categories as category
where product.category_id = category.id
  and category.slug = 'mattresses';

update public.product_variants as variant
set is_active = false,
    updated_at = now()
from public.products as product
join public.categories as category on category.id = product.category_id
where variant.product_id = product.id
  and category.slug = 'mattresses';

with bases(slug, base_price_paise) as (
  values
    ('ortho-mattress', 1329900),
    ('ortho-plus-mattress', 1679900),
    ('latex-mattress', 1569900),
    ('latex-pro', 2149900),
    ('pocketed-spring-mattress', 1850000),
    ('bonnell-spring-mattress', 1499900),
    ('foam-mattress', 1249900),
    ('memory-foam-mattress', 2049900),
    ('feel-good-mattress', 2239900)
), sizes(code, label, length_in, width_in, sort_order) as (
  values
    ('72X36', 'Diwan Mattress — 72 × 36 in', 72, 36, 1),
    ('75X36', 'Single Mattress — 75 × 36 in', 75, 36, 2),
    ('75X48', 'Double Mattress — 75 × 48 in', 75, 48, 3),
    ('75X60', 'Queen Mattress — 75 × 60 in', 75, 60, 4),
    ('75X72', 'King Mattress — 75 × 72 in', 75, 72, 5),
    ('78X72', 'King Mattress — 78 × 72 in', 78, 72, 6)
), thicknesses(value_in, label, sort_order) as (
  values (6, '6 in', 1), (8, '8 in', 2), (10, '10 in', 3), (12, '12 in', 4)
), catalogue as (
  select
    product.id as product_id,
    upper(replace(base.slug, '-', '_')) || '_' || size.code || '_' || thickness.value_in || 'IN' as sku,
    size.label || ' · ' || thickness.label as title,
    jsonb_build_object('size', size.label, 'thickness', thickness.label) as option_values,
    round(base.base_price_paise::numeric * (size.length_in * size.width_in)::numeric / (78 * 72) * thickness.value_in::numeric / 6)::integer as price_paise,
    size.sort_order * 10 + thickness.sort_order as sort_order
  from bases as base
  join public.products as product on product.slug = base.slug
  cross join sizes as size
  cross join thicknesses as thickness
)
insert into public.product_variants (product_id, sku, title, option_values, price_paise, compare_at_price_paise, stock_quantity, track_inventory, made_to_order, lead_time_days, is_active)
select product_id, sku, title, option_values, price_paise, null, 0, false, true, 7, true
from catalogue
order by product_id, sort_order
on conflict (sku) do update
set product_id = excluded.product_id,
    title = excluded.title,
    option_values = excluded.option_values,
    price_paise = excluded.price_paise,
    compare_at_price_paise = excluded.compare_at_price_paise,
    track_inventory = excluded.track_inventory,
    made_to_order = excluded.made_to_order,
    lead_time_days = excluded.lead_time_days,
    is_active = excluded.is_active,
    updated_at = now();

with slim(size_code, size_label, price_paise, sort_order) as (
  values
    ('75X36', 'Single Mattress — 75 × 36 in', 149900, 1),
    ('75X48', 'Double Mattress — 75 × 48 in', 199900, 2),
    ('75X60', 'Queen Mattress — 75 × 60 in', 249800, 3),
    ('75X72', 'King Mattress — 75 × 72 in', 299800, 4),
    ('78X72', 'King Mattress — 78 × 72 in', 311800, 5)
), catalogue as (
  select
    product.id as product_id,
    'SHIM_MATTRESS_' || slim.size_code as sku,
    slim.size_label as title,
    jsonb_build_object('size', slim.size_label) as option_values,
    slim.price_paise,
    slim.sort_order
  from slim
  join public.products as product on product.slug = 'shim-mattress'
)
insert into public.product_variants (product_id, sku, title, option_values, price_paise, compare_at_price_paise, stock_quantity, track_inventory, made_to_order, lead_time_days, is_active)
select product_id, sku, title, option_values, price_paise, null, 0, false, true, 7, true
from catalogue
order by sort_order
on conflict (sku) do update
set product_id = excluded.product_id,
    title = excluded.title,
    option_values = excluded.option_values,
    price_paise = excluded.price_paise,
    compare_at_price_paise = excluded.compare_at_price_paise,
    track_inventory = excluded.track_inventory,
    made_to_order = excluded.made_to_order,
    lead_time_days = excluded.lead_time_days,
    is_active = excluded.is_active,
    updated_at = now();

-- Repair existing mattress cart lines by mapping their saved configuration to
-- the corresponding corrected variant. Unconfigured legacy lines use the
-- catalogue base option rather than retaining a stale price.
update public.cart_items as item
set variant_id = variant.id,
    updated_at = now()
from public.products as product
join public.categories as category on category.id = product.category_id
join public.product_variants as variant on variant.product_id = product.id and variant.is_active
where item.product_id = product.id
  and category.slug = 'mattresses'
  and variant.option_values ->> 'size' = coalesce(
    item.configuration ->> 'size',
    case when product.slug = 'shim-mattress' then 'Single Mattress — 75 × 36 in' else 'King Mattress — 78 × 72 in' end
  )
  and (
    product.slug = 'shim-mattress'
    or variant.option_values ->> 'thickness' = coalesce(item.configuration ->> 'thickness', '6 in')
  );

insert into public.site_settings (key, value)
values (
  'catalogue_pricing_v1',
  jsonb_build_object(
    'ortho-mattress', jsonb_build_object('kind','indicative_fixed','unit','King 78 × 72 in · 6 in','source','corrected_price_catalogue_2026_10','approved',true,'amount_paise',1329900,'configuration','King 78 × 72 in · 6 in'),
    'ortho-plus-mattress', jsonb_build_object('kind','indicative_fixed','unit','King 78 × 72 in · 6 in','source','corrected_price_catalogue_2026_10','approved',true,'amount_paise',1679900,'configuration','King 78 × 72 in · 6 in'),
    'latex-mattress', jsonb_build_object('kind','indicative_fixed','unit','King 78 × 72 in · 6 in','source','corrected_price_catalogue_2026_10','approved',true,'amount_paise',1569900,'configuration','King 78 × 72 in · 6 in'),
    'latex-pro', jsonb_build_object('kind','indicative_fixed','unit','King 78 × 72 in · 6 in','source','corrected_price_catalogue_2026_10','approved',true,'amount_paise',2149900,'configuration','King 78 × 72 in · 6 in'),
    'pocketed-spring-mattress', jsonb_build_object('kind','indicative_fixed','unit','King 78 × 72 in · 6 in','source','corrected_price_catalogue_2026_10','approved',true,'amount_paise',1850000,'configuration','King 78 × 72 in · 6 in'),
    'bonnell-spring-mattress', jsonb_build_object('kind','indicative_fixed','unit','King 78 × 72 in · 6 in','source','corrected_price_catalogue_2026_10','approved',true,'amount_paise',1499900,'configuration','King 78 × 72 in · 6 in'),
    'foam-mattress', jsonb_build_object('kind','indicative_fixed','unit','King 78 × 72 in · 6 in','source','corrected_price_catalogue_2026_10','approved',true,'amount_paise',1249900,'configuration','King 78 × 72 in · 6 in'),
    'memory-foam-mattress', jsonb_build_object('kind','indicative_fixed','unit','King 78 × 72 in · 6 in','source','corrected_price_catalogue_2026_10','approved',true,'amount_paise',2049900,'configuration','King 78 × 72 in · 6 in'),
    'feel-good-mattress', jsonb_build_object('kind','indicative_fixed','unit','King 78 × 72 in · 6 in','source','corrected_price_catalogue_2026_10','approved',true,'amount_paise',2239900,'configuration','King 78 × 72 in · 6 in'),
    'shim-mattress', jsonb_build_object('kind','indicative_fixed','unit','Single 75 × 36 in','source','corrected_price_catalogue_2026_10','approved',true,'amount_paise',149900,'configuration','Single 75 × 36 in')
  )
)
on conflict (key) do update
set value = public.site_settings.value || excluded.value,
    updated_at = now();
