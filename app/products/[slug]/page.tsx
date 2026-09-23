import Link from "next/link";
import { ProductImageGallery } from "@/components/catalog/product-image-gallery";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/catalog/favorite-button";
import { MattressConfigurator } from "@/components/catalog/mattress-configurator";
import { getPricingManifest, priceLabel } from "@/lib/catalog/pricing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Product = { id: string; name: string; slug: string; short_description: string | null; description: string | null; purchase_mode: "direct" | "configurable" | "quote_only"; category_id: string };
type Category = { name: string; slug: string };
type ProductImage = { storage_path: string; alt_text: string; sort_order: number };

export default async function CatalogProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const [{ data: productData }, pricing] = await Promise.all([supabase.from("products").select("id, name, slug, short_description, description, purchase_mode, category_id").eq("slug", slug).eq("status", "active").maybeSingle(), getPricingManifest()]);
  const product = productData as Product | null;
  if (!product) notFound();
  const [{ data: categoryData }, { data: imageData }] = await Promise.all([
    supabase.from("categories").select("name, slug").eq("id", product.category_id).maybeSingle(),
    supabase.from("product_images").select("storage_path, alt_text, sort_order").eq("product_id", product.id).order("sort_order"),
  ]);
  const category = categoryData as Category | null;
  const productImages = ((imageData ?? []) as ProductImage[]).map((image) => ({
    alt: image.alt_text,
    src: supabase.storage.from("product-images").getPublicUrl(image.storage_path).data.publicUrl,
  }));
  const isMattress = category?.slug === "mattresses";
  const videoKey = category?.slug === "mattresses" ? "mattresses.m4v" : category?.slug === "sofas" ? "sofas.m4v" : category?.slug === "padding-beds" ? "padding-beds.mp4" : ["tv-units", "kitchen", "ceilings"].includes(category?.slug || "") ? "interiors.mp4" : null;
  const productVideo = videoKey ? { label: product.name + " product video", src: supabase.storage.from("product-images").getPublicUrl("videos/" + videoKey).data.publicUrl } : undefined;
  const collectionHref = isMattress ? "/shop" : ["sofas", "padding-beds"].includes(category?.slug || "") ? `/shop?category=${category?.slug}` : ["tv-units", "kitchen", "ceilings"].includes(category?.slug || "") ? `/interiors/${category?.slug}` : "/interiors";
  const isQuoteOnly = product.purchase_mode === "quote_only";
  const pricingLabel = priceLabel(pricing[product.slug]);

  return (
    <>
      <main className="min-h-screen bg-white px-5 py-10 text-[#171717] md:px-10">
        <div className="mx-auto max-w-7xl"><nav aria-label="Breadcrumb" className="text-sm text-neutral-600"><Link href="/">Home</Link><span className="mx-2">/</span><Link href={collectionHref}>{category?.name || "Catalogue"}</Link><span className="mx-2">/</span><span>{product.name}</span></nav><div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
        <section><ProductImageGallery images={productImages} productName={product.name} video={productVideo} /><div className="mt-8 rounded-2xl border border-[#d6c8b5] bg-white p-5"><h2 className="font-serif text-2xl">Details</h2><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-neutral-500">Category</dt><dd className="mt-1 font-semibold">{category?.name || "Catalogue"}</dd></div><div><dt className="text-neutral-500">Availability</dt><dd className="mt-1 font-semibold">Made to order</dd></div></dl></div></section>
        <section className="self-start lg:sticky lg:top-28">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#9d6b36]">SleepExcellent {category?.name || "catalogue"}</p>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl">{product.name}</h1>
          <p className="mt-5 max-w-xl leading-7 text-neutral-600">{product.description || product.short_description || `${product.name} is part of the SleepExcellent made-to-order catalogue. Material, dimensions, finish, specifications and final pricing are confirmed with you before production and delivery.`}</p>
          {pricingLabel ? <p className="mt-4 text-sm font-semibold text-[#8a694c]">{pricingLabel} <span className="font-normal text-neutral-500">· Final quotation confirmed before ordering</span></p> : null}
          {isMattress ? (
            <MattressConfigurator productSlug={slug} />
          ) : (
            <div className="mt-7 rounded-2xl border border-[#d6c8b5] bg-white p-5">
              <p className="text-sm font-semibold">{isQuoteOnly ? "Project pricing on request" : "Specifications and pricing"}</p>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{isQuoteOnly ? "Our Interior team will confirm materials, dimensions, site requirements, and your final estimate after a consultation." : "Select your preferred configuration and our team will confirm the final specification."}</p>
              <Link className="mt-4 inline-block rounded-full bg-[#181818] px-5 py-3 text-sm font-semibold" href="/build-your-mattress" style={{ color: "#ffffff" }}>Request a consultation</Link>
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-3"><FavoriteButton productSlug={slug} /><Link className="border border-[#171717] px-5 py-3 text-sm font-semibold uppercase tracking-wider" href={collectionHref}>Browse collection</Link>{isMattress ? <Link className="border border-[#171717] px-5 py-3 text-sm font-semibold uppercase tracking-wider" href="/build-your-mattress">Customize a mattress</Link> : null}</div>
        </section>
        </div><section className="mt-12 grid gap-5 border-t border-[#d6c8b5] pt-8 md:grid-cols-3"><div><h2 className="font-serif text-2xl">Product description</h2><p className="mt-3 text-sm leading-6 text-neutral-600">{product.description || product.short_description || "Details will be confirmed with your order."}</p></div><div><h2 className="font-serif text-2xl">Delivery and care</h2><p className="mt-3 text-sm leading-6 text-neutral-600">Production and delivery timing are confirmed once the order configuration is approved.</p></div><div><h2 className="font-serif text-2xl">Questions</h2><details className="mt-3 border-b border-[#d6c8b5] pb-3 text-sm"><summary className="cursor-pointer font-semibold">Can I request a custom size?</summary><p className="mt-2 leading-6 text-neutral-600">Yes. Choose Custom for mattress sizing, or request a consultation for Interior products.</p></details></div></section></div>
      </main>
    </>
  );
}
