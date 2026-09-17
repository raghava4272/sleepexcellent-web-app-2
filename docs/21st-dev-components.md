# 21st.dev component review

The Pradeep account was authenticated and its 17 saved components were reviewed on September 17, 2026. No third-party source code has been copied into this repository yet.

## Saved components relevant to this storefront

| Saved component | Source | Intended candidate use | Decision boundary |
| --- | --- | --- | --- |
| Stacked Card Carousel | `@shadcnspace/components/carousel-07` | Optional product/story carousel below the homepage hero | Do not replace the required full-width homepage slideshow without reviewing its responsive controls, keyboard support, and package dependencies. |
| Image Gallery | `@prebuiltui/components/image-gallery/image-grid-gallery` | Product-detail gallery enhancement | Compare against the existing gallery before adoption; it must retain the product image fallback and not change the purchase flow. |
| Neural Access Login | `@shivendra9795kumar/components/neural-access-login` | Visual reference for the requested blurred-background login/signup dialog | Rebuild/adapt to existing Supabase authentication rather than inserting demo authentication code. Keep the SleepExcellent theme and accessible dialog behavior. |
| Hero Parallax | `@manuarora700/components/hero-parallax` | Optional future interior/brand storytelling section | Not suitable as a replacement for the shorter, full-width commerce slideshow without explicit client approval. |
| Image Stream Hero | `@ruixen.ui/components/image-stream-hero` | Optional future visual marketing treatment | Not selected for the transactional homepage hero because it can obscure offer copy and calls to action. |
| Testimonials 13 / 3D Testimonials | `@shadcnui-blocks/components/testimonials-13`; `@sean0205/components/3d-testimonails` | Possible review/testimonial section | Use only after verified customer testimonial content is supplied. |
| Marquee Logo Scroller | `@ravikatiyar162/components/marquee-logo-scroller` | Optional partner/trust-mark strip | Requires approved partner logos and performance review. |

Other saved components include Circular Gallery 2, 3D Coverflow Carousel, Background Paths, Globe Pulse, Gradient Orb, Illuminated Hero, Portfolio and Image Gallery, 3D Marquee, Hero Section, and generic visual effects. They are not planned for direct reuse because they would compete with the restrained SleepExcellent commerce theme or add unnecessary motion.

## Adoption rules

1. Inspect the exact source, license, dependencies, and current component documentation immediately before implementation; saved status alone is not a license or compatibility guarantee.
2. Remove demo data, unrelated branding, telemetry, and nonessential dependencies. Do not copy credential, analytics, payment, or authentication logic from a component.
3. Keep product/catalogue data, Supabase authorization, Razorpay payment flow, and route behavior project-owned.
4. Test keyboard navigation, focus handling, reduced motion, mobile layout, and bundle impact before retaining a component.
5. Record the exact revision/source URL and the adaptations made in the relevant implementation phase.
