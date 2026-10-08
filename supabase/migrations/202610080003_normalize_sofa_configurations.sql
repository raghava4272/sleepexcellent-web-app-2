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
  select jsonb_agg(
    case
      when item->>'slug' = config.slug then
        jsonb_set(item, '{configuration}', to_jsonb(config.configuration), true)
      else item
    end
    order by item_ordinal
  ) as sofas
  from site_settings settings
  cross join lateral jsonb_array_elements(settings.value->'sofas') with ordinality as entries(item, item_ordinal)
  left join sofa_configuration config on config.slug = item->>'slug'
  where settings.key = 'catalogue_pricing_v1'
)
update site_settings
set value = jsonb_set(value, '{sofas}', updated_catalogue.sofas, true),
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
  and variants.active = true;
