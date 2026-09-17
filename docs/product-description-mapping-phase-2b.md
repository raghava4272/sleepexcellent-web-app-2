# Product description mapping phase 2B

Source: `docs/reference-sources/Sleep_Excellent_Product_Descriptions.docx`.

## Imported verified descriptions

The import script matches source and live product names only after lowercasing and removing punctuation/spacing. It imported 41 descriptions: all 10 mattresses, all 16 sofas, all 10 padding beds, plus these five Interior products.

| Source number | Source name | Canonical slug |
| --- | --- | --- |
| 37 | Floating Minimalist TV Unit | `floating-minimalist-tv-unit` |
| 47 | L-Shaped Modular Kitchen | `l-shaped-modular-kitchen` |
| 48 | U-Shaped Modular Kitchen | `u-shaped-modular-kitchen` |
| 49 | Parallel / Galley Kitchen | `parallel-galley-kitchen` |
| 57 | Modern Tray False Ceiling | `modern-tray-false-ceiling` |

## Kept unresolved

The other 25 supplied Interior descriptions were not attached because the live catalogue currently uses a different design name. They remain ready for a reviewed product rename/addition decision in the next catalogue update.

- TV Units 38–46: Fluted Panel, Marble Backdrop, Wooden Slat, Luxury Full-Wall, Japandi, Modular Storage, Curved Edge, LED Backlit, Smart Media Wall.
- Kitchens 50–56: Straight-Line Modular, Island Modular, Peninsula Modular, G-Shaped Modular, Open-Plan Modern, One-Wall with Tall Pantry, Luxury Handleless with Island.
- Ceilings 58–66: Floating, Wooden Panel, Cove Lighting, Geometric Gypsum, Layered POP, Coffered, Circular Feature, Wooden Slat, Wall-to-Ceiling Panel.

The import does not rename products, change categories, variants, prices, media, purchase mode, or status. Run `node scripts/import-product-descriptions.mjs` for a read-only mapping preview, and add `--apply` only after reviewing the output.
