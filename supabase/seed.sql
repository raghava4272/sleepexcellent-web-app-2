-- Development seed: exact supplied mattress catalogue prices, stored in paise.
insert into public.categories (name, slug, description, sort_order) values ('Mattresses', 'mattresses', 'SleepExcellent mattress catalogue', 1) on conflict (slug) do update set name = excluded.name;

with mattress_products(name, slug, price_paise) as (values
  ('Ortho Mattress','ortho-mattress',1269900), ('Ortho Plus Mattress','ortho-plus-mattress',1639500),
  ('Latex Mattress','latex-mattress',1597500), ('Latex Pro','latex-pro',2831500),
  ('Pocketed Spring Mattress','pocketed-spring-mattress',1559500), ('Bonnell Spring Mattress','bonnell-spring-mattress',1722200),
  ('Foam Mattress','foam-mattress',1447500), ('Memory Foam Mattress','memory-foam-mattress',1661900),
  ('Feel Good Mattress','feel-good-mattress',2692900), ('Shim Mattress','shim-mattress',211900)
), upsert_products as (
  insert into public.products (category_id, name, slug, short_description, purchase_mode, status, featured)
  select c.id, mp.name, mp.slug, 'Catalogue product; imagery pending Supabase Storage upload.', case when mp.slug = 'ortho-plus-mattress' then 'configurable'::public.purchase_mode else 'direct'::public.purchase_mode end, 'active'::public.product_status, mp.slug in ('ortho-mattress','ortho-plus-mattress') from mattress_products mp cross join public.categories c where c.slug = 'mattresses'
  on conflict (slug) do update set name = excluded.name, status = excluded.status returning id, slug
)
insert into public.product_variants (product_id, sku, title, price_paise, compare_at_price_paise, stock_quantity, track_inventory, made_to_order, lead_time_days)
select p.id, upper(replace(mp.slug,'-','_')) || '_BASE', 'Base configuration', mp.price_paise, null, 0, false, true, 7 from upsert_products p join mattress_products mp using (slug)
on conflict (sku) do update set price_paise = excluded.price_paise, title = excluded.title;

insert into public.configurator_option_groups (code, name, selection_type, sort_order) values ('size','Size','single',1),('thickness','Thickness','single',2),('comfort','Comfort layer','single',3),('core','Core topology','single',4),('fabric','Cover fabric','single',5) on conflict (code) do nothing;

insert into public.site_settings (key, value) values ('delivery_policy', '{"mode":"manual_all_india","message":"Delivery availability is confirmed by the operations team."}') on conflict (key) do update set value = excluded.value;
