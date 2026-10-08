-- Normalize the customer-facing sofa seating configurations from the approved catalogue.
with sofa_configuration(slug, configuration) as (
  values
    ('cabin-style-sofa', '3-seater'),
    ('camel-back-sofa', '3 + 2 = 5-seater'),
    ('chester-model-sofa', '3 + 2 + 1 = 6-seater'),
    ('classic-style-sofa', '2-seater + lounger'),
    ('cloud-sofa', '3 + 2 = 5-seater'),
    ('corner-sofa', '6-seater'),
    ('european-sofa', '3-seater'),
    ('fiber-back-sofa', 'Lounger + storage box'),
    ('head-rest-model-sofa', '5-seater'),
    ('indian-traditional-sofa', '3 + 2 + 1 = 6-seater'),
    ('l-shape-sofa', 'Lounger + 3-seater'),
    ('premium-sofa', '2-seater'),
    ('sectional-sofa', '5-seater'),
    ('prussian-style-sofa', '3 + 2 = 5-seater'),
    ('sofa-with-recliner', '1 recliner + 2 seats = 3-seater'),
    ('u-shape-sofa', '9-seater')
), updated_catalogue as (
  select jsonb_object_agg(
    config.slug,
    coalesce(settings.value -> config.slug, '{}'::jsonb)
      || jsonb_build_object('configuration', config.configuration)
  ) as entries
  from site_settings settings
  cross join sofa_configuration config
  where settings.key = 'catalogue_pricing_v1'
)
update site_settings
set value = value || updated_catalogue.entries,
    updated_at = now()
from updated_catalogue
where key = 'catalogue_pricing_v1';

with sofa_configuration(slug, configuration) as (
  values
    ('cabin-style-sofa', '3-seater'),
    ('camel-back-sofa', '3 + 2 = 5-seater'),
    ('chester-model-sofa', '3 + 2 + 1 = 6-seater'),
    ('classic-style-sofa', '2-seater + lounger'),
    ('cloud-sofa', '3 + 2 = 5-seater'),
    ('corner-sofa', '6-seater'),
    ('european-sofa', '3-seater'),
    ('fiber-back-sofa', 'Lounger + storage box'),
    ('head-rest-model-sofa', '5-seater'),
    ('indian-traditional-sofa', '3 + 2 + 1 = 6-seater'),
    ('l-shape-sofa', 'Lounger + 3-seater'),
    ('premium-sofa', '2-seater'),
    ('sectional-sofa', '5-seater'),
    ('prussian-style-sofa', '3 + 2 = 5-seater'),
    ('sofa-with-recliner', '1 recliner + 2 seats = 3-seater'),
    ('u-shape-sofa', '9-seater')
)
update product_variants variants
set title = config.configuration,
    option_values = jsonb_build_object('seating', config.configuration),
    updated_at = now()
from products
join sofa_configuration config on config.slug = products.slug
where variants.product_id = products.id
  and variants.is_active = true;
