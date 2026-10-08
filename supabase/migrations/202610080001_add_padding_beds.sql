-- Add the three approved padding-bed models from the current price catalogue.
with catalogue(name, slug, description, price_paise) as (
  values
    ('Colony Model Bed', 'colony-model-bed', 'A refined upholstered bed with a balanced headboard profile, created for comfortable and elegant everyday bedrooms.', 2500000),
    ('Lifestyle Bed', 'lifestyle-bed', 'A clean contemporary bed designed to bring practical comfort and understated style to modern living spaces.', 1690000),
    ('Wood Rock Bed', 'wood-rock-bed', 'A sturdy wood-led bed with a distinctive crafted character, combining dependable construction with a warm natural presence.', 2160000)
), inserted_products as (
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
select product.id, upper(replace(product.slug, '-', '_')) || '_STD', 'Standard model', '{}'::jsonb, catalogue.price_paise, 0, false, true, 14, true
from inserted_products product
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
    'colony-model-bed', jsonb_build_object('kind','indicative_fixed','unit','per item','source','price_catalogue_2026_10','approved',true,'amount_paise',2500000,'configuration','Standard model'),
    'lifestyle-bed', jsonb_build_object('kind','indicative_fixed','unit','per item','source','price_catalogue_2026_10','approved',true,'amount_paise',1690000,'configuration','Standard model'),
    'wood-rock-bed', jsonb_build_object('kind','indicative_fixed','unit','per item','source','price_catalogue_2026_10','approved',true,'amount_paise',2160000,'configuration','Standard model')
  )
)
on conflict (key) do update
set value = public.site_settings.value || excluded.value,
    updated_at = now();
