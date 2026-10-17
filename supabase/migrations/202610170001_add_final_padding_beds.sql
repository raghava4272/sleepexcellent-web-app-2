-- Add the four approved beds from the final padding-bed catalogue.
-- Prices intentionally mirror the reference products supplied by the client.
with catalogue(name, slug, description, price_paise, variant_title) as (
  values
    ('Traditional Model Headboard Bed', 'traditional-model-headboard-bed', 'A traditional upholstered headboard bed with balanced proportions, supportive padding, and a timeless profile suited to elegant everyday bedrooms.', 4960000, 'King size'),
    ('Round European Royal Bed', 'round-european-royal-bed', 'A statement round bed inspired by European royal interiors, combining a generous circular form with a refined upholstered finish for a distinctive luxury bedroom.', 4290000, 'Standard model'),
    ('Premium Butterfly Bed with Leatherite Fabric', 'premium-butterfly-bed-with-leatherite-fabric', 'A premium bed with a sculpted butterfly-inspired headboard and smooth leatherite upholstery, designed to create a bold and sophisticated bedroom centrepiece.', 6690000, 'Standard model'),
    ('Premium Bed with Leatherite Fabric', 'premium-bed-with-leatherite-fabric', 'A premium upholstered bed finished in easy-care leatherite fabric, pairing dependable construction with a clean, contemporary luxury appearance.', 6690000, 'Standard model')
), upserted_products as (
  insert into public.products (category_id, name, slug, short_description, description, purchase_mode, status)
  select category.id, catalogue.name, catalogue.slug, catalogue.description, catalogue.description, 'direct'::public.purchase_mode, 'active'::public.product_status
  from catalogue
  join public.categories category on category.slug = 'padding-beds'
  on conflict (slug) do update
  set category_id = excluded.category_id,
      name = excluded.name,
      short_description = excluded.short_description,
      description = excluded.description,
      purchase_mode = excluded.purchase_mode,
      status = excluded.status,
      updated_at = now()
  returning id, slug
)
insert into public.product_variants (product_id, sku, title, option_values, price_paise, stock_quantity, track_inventory, made_to_order, lead_time_days, is_active)
select product.id, upper(replace(product.slug, '-', '_')) || '_BASE', catalogue.variant_title, '{}'::jsonb, catalogue.price_paise, 0, false, true, 21, true
from upserted_products product
join catalogue on catalogue.slug = product.slug
on conflict (sku) do update
set title = excluded.title,
    price_paise = excluded.price_paise,
    track_inventory = excluded.track_inventory,
    made_to_order = excluded.made_to_order,
    lead_time_days = excluded.lead_time_days,
    is_active = excluded.is_active,
    updated_at = now();

insert into public.site_settings (key, value)
values (
  'catalogue_pricing_v1',
  jsonb_build_object(
    'traditional-model-headboard-bed', jsonb_build_object('kind','indicative_fixed','unit','per item','source','final_bed_catalogue_2026_10','approved',true,'amount_paise',4960000,'configuration','King size'),
    'round-european-royal-bed', jsonb_build_object('kind','indicative_fixed','unit','per item','source','final_bed_catalogue_2026_10','approved',true,'amount_paise',4290000,'configuration','Standard model'),
    'premium-butterfly-bed-with-leatherite-fabric', jsonb_build_object('kind','indicative_fixed','unit','per item','source','final_bed_catalogue_2026_10','approved',true,'amount_paise',6690000,'configuration','Standard model'),
    'premium-bed-with-leatherite-fabric', jsonb_build_object('kind','indicative_fixed','unit','per item','source','final_bed_catalogue_2026_10','approved',true,'amount_paise',6690000,'configuration','Standard model')
  )
)
on conflict (key) do update
set value = public.site_settings.value || excluded.value,
    updated_at = now();
