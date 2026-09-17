-- Phase 2: navigable catalogue groups. Interior work is quote-only until a project
-- consultation confirms final scope. Fixed checkout prices are imported separately.

insert into public.categories (name, slug, description, sort_order, is_active)
values
  ('Sofas', 'sofas', 'Made-to-order sofa designs.', 20, true),
  ('Padding Beds', 'padding-beds', 'Upholstered and solid-wood bed designs.', 30, true),
  ('Interior', 'interior', 'Interior systems for the space around your rest.', 40, true)
on conflict (slug) do update set name = excluded.name, description = excluded.description, sort_order = excluded.sort_order, is_active = excluded.is_active;

insert into public.categories (parent_id, name, slug, description, sort_order, is_active)
select parent.id, item.name, item.slug, item.description, item.sort_order, true
from (values
  ('TV Units', 'tv-units', 'Made-to-order entertainment and television units.', 10),
  ('Kitchens', 'kitchen', 'Modular kitchens tailored to your space.', 20),
  ('Ceilings', 'ceilings', 'False ceiling, lighting, and acoustic ceiling systems.', 30)
) as item(name, slug, description, sort_order)
cross join public.categories parent
where parent.slug = 'interior'
on conflict (slug) do update set parent_id = excluded.parent_id, name = excluded.name, description = excluded.description, sort_order = excluded.sort_order, is_active = excluded.is_active;

with catalogue(category_slug, name, slug, short_description) as (values
  ('sofas','L Shape Sofa','l-shape-sofa','A tailored L-shape sofa for modern living rooms.'),
  ('sofas','European Sofa','european-sofa','European-inspired sofa profile with made-to-order finishes.'),
  ('sofas','Indian Traditional Sofa','indian-traditional-sofa','Traditional proportions crafted for Indian homes.'),
  ('sofas','Head Rest Model Sofa','head-rest-model-sofa','Comfort-led sofa with an integrated headrest profile.'),
  ('sofas','Chester Model Sofa','chester-model-sofa','Tufted Chester-style sofa with custom upholstery options.'),
  ('sofas','Fiber Back Sofa','fiber-back-sofa','Supportive fibre-back sofa for everyday comfort.'),
  ('sofas','Prussian Style Sofa','prussian-style-sofa','Structured sofa silhouette with refined detailing.'),
  ('sofas','Camel Back Sofa','camel-back-sofa','Classic camel-back sofa for formal lounge spaces.'),
  ('sofas','Classic Style Sofa','classic-style-sofa','A versatile classic sofa designed around your room.'),
  ('sofas','Sofa with Recliner','sofa-with-recliner','Reclining sofa configuration with comfort options.'),
  ('sofas','Cloud Sofa','cloud-sofa','Deep, relaxed seating with a cloud-like profile.'),
  ('sofas','Premium Sofa','premium-sofa','Premium sofa with custom material and finish selection.'),
  ('sofas','Cabin Style Sofa','cabin-style-sofa','Cosy cabin-inspired sofa for relaxed interiors.'),
  ('sofas','Sectional Sofa','sectional-sofa','Flexible sectional seating for larger layouts.'),
  ('sofas','U Shape Sofa','u-shape-sofa','Generous U-shape seating for family and entertaining.'),
  ('sofas','Corner Sofa','corner-sofa','Space-efficient corner seating built to fit your room.'),
  ('padding-beds','Classic Model Headboard Bed','classic-model-headboard-bed','Classic bed with a tailored headboard design.'),
  ('padding-beds','Roman Model Bed','roman-model-bed','Statement Roman-style bed built to order.'),
  ('padding-beds','Luxury Headboard Bed','luxury-headboard-bed','Luxury upholstered headboard with custom finishes.'),
  ('padding-beds','Round Shape Bed','round-shape-bed','Distinctive rounded bed form for contemporary rooms.'),
  ('padding-beds','Dream Night Bed','dream-night-bed','Comfortable everyday bed frame with finish options.'),
  ('padding-beds','Teak Wood Bed','teak-wood-bed','Solid teak wood bed made for long-lasting warmth.'),
  ('padding-beds','Polished Bed','polished-bed','Polished bed frame with a refined presentation.'),
  ('padding-beds','Shadhi Model Bed','shadhi-model-bed','Decorative bed model for celebratory bedroom interiors.'),
  ('padding-beds','Kerala Teak Bed','kerala-teak-bed','Kerala teak bed with made-to-order sizing.'),
  ('padding-beds','Inbuilt Plywood Bed','inbuilt-plywood-bed','Integrated plywood bed built around your room dimensions.'),
  ('tv-units','Floating Minimalist TV Unit','floating-minimalist-tv-unit','Wall-mounted TV unit with a clean minimalist profile.'),
  ('tv-units','Wall Panel TV Unit','wall-panel-tv-unit','Feature wall panel with integrated TV storage.'),
  ('tv-units','Low-Profile TV Console','low-profile-tv-console','Low, streamlined TV console for a modern media wall.'),
  ('tv-units','Classic Wooden TV Unit','classic-wooden-tv-unit','Classic wooden entertainment unit with tailored storage.'),
  ('tv-units','Modern Entertainment Wall','modern-entertainment-wall','Complete entertainment wall designed around your screen.'),
  ('tv-units','Scandinavian TV Unit','scandinavian-tv-unit','Light, practical Scandinavian-inspired TV unit.'),
  ('tv-units','Compact TV Unit','compact-tv-unit','Compact TV storage for smaller rooms.'),
  ('tv-units','Luxury Marble TV Console','luxury-marble-tv-console','Premium marble-accented TV console.'),
  ('tv-units','Corner TV Unit','corner-tv-unit','Corner-fit television unit for efficient layouts.'),
  ('tv-units','Industrial TV Unit','industrial-tv-unit','Industrial-style TV unit with durable materials.'),
  ('kitchen','L-Shaped Modular Kitchen','l-shaped-modular-kitchen','Efficient L-shaped kitchen for everyday cooking.'),
  ('kitchen','U-Shaped Modular Kitchen','u-shaped-modular-kitchen','High-storage U-shaped modular kitchen.'),
  ('kitchen','Parallel / Galley Kitchen','parallel-galley-kitchen','Two-run galley kitchen designed for efficient workflow.'),
  ('kitchen','Island Kitchen','island-kitchen','Open kitchen with a central island work zone.'),
  ('kitchen','Straight Line Kitchen','straight-line-kitchen','Streamlined straight kitchen for compact spaces.'),
  ('kitchen','G-Shaped Kitchen','g-shaped-kitchen','G-shaped layout offering generous counter space.'),
  ('kitchen','Open Kitchen','open-kitchen','Open-plan kitchen designed to connect with living space.'),
  ('kitchen','Handleless Kitchen','handleless-kitchen','Contemporary handleless kitchen with clean lines.'),
  ('kitchen','Industrial-Style Kitchen','industrial-style-kitchen','Industrial kitchen with robust material expression.'),
  ('kitchen','Luxury Modular Kitchen','luxury-modular-kitchen','Luxury modular kitchen with premium finishes.'),
  ('ceilings','Modern Tray False Ceiling','modern-tray-false-ceiling','Layered tray ceiling with modern proportions.'),
  ('ceilings','Gypsum POP Ceiling','gypsum-pop-ceiling','Gypsum POP ceiling formed for a polished finish.'),
  ('ceilings','Wooden Beam Ceiling','wooden-beam-ceiling','Warm wood beam ceiling for characterful interiors.'),
  ('ceilings','Cove Lighting Ceiling','cove-lighting-ceiling','Soft cove lighting ceiling for ambient illumination.'),
  ('ceilings','Minimalist False Ceiling','minimalist-false-ceiling','Minimal false ceiling with restrained detailing.'),
  ('ceilings','Geometric Pattern Ceiling','geometric-pattern-ceiling','Geometric ceiling pattern for a distinctive feature.'),
  ('ceilings','Luxury Layered Ceiling','luxury-layered-ceiling','Multi-layer ceiling with premium lighting integration.'),
  ('ceilings','PVC Panel Ceiling','pvc-panel-ceiling','Practical PVC panel ceiling system.'),
  ('ceilings','Industrial Exposed Ceiling','industrial-exposed-ceiling','Exposed industrial ceiling treatment.'),
  ('ceilings','Acoustic Ceiling','acoustic-ceiling','Acoustic ceiling treatment for sound comfort.')
)
insert into public.products (category_id, name, slug, short_description, description, purchase_mode, status)
select category.id, catalogue.name, catalogue.slug, catalogue.short_description, catalogue.short_description, 'quote_only'::public.purchase_mode, 'active'
from catalogue join public.categories category on category.slug = catalogue.category_slug
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name, short_description = coalesce(public.products.short_description, excluded.short_description), description = coalesce(public.products.description, excluded.description), status = 'active';
