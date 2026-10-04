-- Prices transcribed from the approved handwritten web catalogue sheets.
insert into public.site_settings (key, value)
values (
  'catalogue_pricing_v1',
  jsonb_build_object(
    'cabin-style-sofa', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',3600000,'configuration','3-seater'),
    'camel-back-sofa', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',7499900,'configuration','3 + 2 configuration'),
    'chester-model-sofa', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',11849900,'configuration','3 + 2 + 1 configuration'),
    'classic-style-sofa', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',4950000,'configuration','2-seater + lounger'),
    'cloud-sofa', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',9759900,'configuration','3 + 2 configuration'),
    'corner-sofa', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',6600000,'configuration','6-seater'),
    'european-sofa', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',3950000,'configuration','3-seater'),
    'fiber-back-sofa', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',12569900,'configuration','Lounger + storage box'),
    'head-rest-model-sofa', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',5479900,'configuration','5-seater'),
    'indian-traditional-sofa', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',13950000,'configuration','3 + 2 + 1 configuration'),
    'l-shape-sofa', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',6639900,'configuration','Lounger + 3-seater'),
    'premium-sofa', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',3589900,'configuration','2-seater'),
    'sectional-sofa', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',4950000,'configuration','5-seater'),
    'prussian-style-sofa', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',9500000,'configuration','3 + 2 configuration'),
    'sofa-with-recliner', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',4940000,'configuration','1 recliner + 2 seats'),
    'u-shape-sofa', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',9849900,'configuration','9-seater'),
    'shim-mattress', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',149900,'configuration','Standard size'),
    'memory-foam-mattress', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',2049900,'configuration','72 × 75 × 6 in'),
    'ortho-mattress', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',1329900,'configuration','72 × 75 × 6 in'),
    'latex-mattress', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',1569900,'configuration','72 × 75 × 6 in'),
    'bonnell-spring-mattress', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',1499900,'configuration','72 × 75 × 8 in'),
    'feel-good-mattress', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',2239900,'configuration','72 × 75 × 6 in'),
    'ortho-plus-mattress', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',1679900,'configuration','72 × 75 × 6 in'),
    'latex-pro', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',2149900,'configuration','72 × 75 × 6 in'),
    'pocketed-spring-mattress', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',1850000,'configuration','72 × 75 × 8 in'),
    'foam-mattress', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',1249900,'configuration','72 × 75 × 6 in'),
    'classic-model-headboard-bed', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',7549900,'configuration','Standard model'),
    'dream-night-bed', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',4250000,'configuration','Standard model'),
    'inbuilt-plywood-bed', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',5559900,'configuration','Standard model'),
    'kerala-teak-bed', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',2699900,'configuration','Standard model'),
    'luxury-headboard-bed', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',4950000,'configuration','Standard model'),
    'polished-bed', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',2699900,'configuration','Standard model'),
    'roman-model-bed', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',5299900,'configuration','Standard model'),
    'round-shape-bed', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',9699900,'configuration','Standard model'),
    'shadhi-model-bed', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',13969900,'configuration','Standard model'),
    'teak-wood-bed', jsonb_build_object('kind','indicative_fixed','unit','per item','source','handwritten_price_list_2026_10','approved',true,'amount_paise',5150000,'configuration','Standard model')
  )
)
on conflict (key) do update
set value = public.site_settings.value || excluded.value,
    updated_at = now();
