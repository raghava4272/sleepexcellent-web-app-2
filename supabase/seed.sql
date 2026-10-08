-- Development seed: exact supplied mattress catalogue prices, stored in paise.
insert into public.categories (name, slug, description, sort_order) values ('Mattresses', 'mattresses', 'SleepExcellent mattress catalogue', 1) on conflict (slug) do update set name = excluded.name;

with mattress_products(name, slug) as (values
  ('Ortho Mattress','ortho-mattress'), ('Ortho Plus Mattress','ortho-plus-mattress'),
  ('Latex Mattress','latex-mattress'), ('Natural Latex Mattress','latex-pro'),
  ('Pocketed Spring Mattress','pocketed-spring-mattress'), ('Bonnell Spring Mattress','bonnell-spring-mattress'),
  ('Foam Mattress','foam-mattress'), ('Memory Foam Mattress','memory-foam-mattress'),
  ('Feel Good Mattress','feel-good-mattress'), ('Slim Mattress','shim-mattress')
)
insert into public.products (category_id, name, slug, short_description, purchase_mode, status, featured)
select c.id, mp.name, mp.slug, 'Catalogue product; imagery pending Supabase Storage upload.', 'configurable'::public.purchase_mode, 'active'::public.product_status, mp.slug in ('ortho-mattress','ortho-plus-mattress')
from mattress_products mp cross join public.categories c where c.slug = 'mattresses'
on conflict (slug) do update set name = excluded.name, purchase_mode = excluded.purchase_mode, status = excluded.status;

insert into public.configurator_option_groups (code, name, selection_type, sort_order) values ('size','Size','single',1),('thickness','Thickness','single',2),('comfort','Comfort layer','single',3),('core','Core topology','single',4),('fabric','Cover fabric','single',5) on conflict (code) do nothing;

insert into public.site_settings (key, value) values ('delivery_policy', '{"mode":"manual_all_india","message":"Delivery availability is confirmed by the operations team."}') on conflict (key) do update set value = excluded.value;
