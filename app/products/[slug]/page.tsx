import Link from "next/link";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/catalog/favorite-button";
import { MattressConfigurator } from "@/components/catalog/mattress-configurator";
import { getPricingManifest, priceLabel } from "@/lib/catalog/pricing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Product = { id: string; name: string; slug: string; short_description: string | null; description: string | null; purchase_mode: "direct" | "configurable" | "quote_only"; category_id: string };
type Category = { name: string; slug: string };

export default async function CatalogProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const [{ data: productData }, pricing] = await Promise.all([supabase.from("products").select("id, name, slug, short_description, description, purchase_mode, category_id").eq("slug", slug).eq("status", "active").maybeSingle(), getPricingManifest()]);
  const product = productData as Product | null;
  if (!product) notFound();
  const { data: categoryData } = await supabase.from("categories").select("name, slug").eq("id", product.category_id).maybeSingle();
  const category = categoryData as Category | null;
  const isMattress = category?.slug === "mattresses";
  const collectionHref = isMattress ? "/shop" : ["sofas", "padding-beds"].includes(category?.slug || "") ? `/shop?category=${category?.slug}` : ["tv-units", "kitchen", "ceilings"].includes(category?.slug || "") ? `/interiors/${category?.slug}` : "/interiors";
  const isQuoteOnly = product.purchase_mode === "quote_only";
  const pricingLabel = priceLabel(pricing[product.slug]);

  return (
    <>
      <main className="min-h-screen bg-[#f8f4ec] px-5 py-10 text-[#171717] md:px-10">
        <div className="mx-auto max-w-7xl"><nav aria-label="Breadcrumb" className="text-sm text-neutral-600"><Link href="/">Home</Link><span className="mx-2">/</span><Link href={collectionHref}>{category?.name || "Catalogue"}</Link><span className="mx-2">/</span><span>{product.name}</span></nav><div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
        <section><div className="aspect-square rounded-2xl border border-[#d6c8b5] bg-white p-8"><img alt={`${product.name} placeholder`} className="h-full w-full object-contain" src="/product-placeholder.svg" /></div><div className="mt-3 grid grid-cols-4 gap-3">{["Front view", "Materials", "Dimensions", "Detail"].map((label, index) => <div className={`aspect-square rounded-xl border p-3 text-[10px] font-semibold uppercase tracking-[.12em] ${index === 0 ? "border-[#171717] bg-white" : "border-[#d6c8b5] bg-[#f4eee5] text-neutral-500"}`} key={label}>{label}</div>)}</div><div className="mt-8 rounded-2xl border border-[#d6c8b5] bg-white p-5"><h2 className="font-serif text-2xl">Details</h2><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-neutral-500">Category</dt><dd className="mt-1 font-semibold">{category?.name || "Catalogue"}</dd></div><div><dt className="text-neutral-500">Availability</dt><dd className="mt-1 font-semibold">Made to order</dd></div></dl></div></section>
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
              <Link className="mt-4 inline-block rounded-full bg-[#181818] px-5 py-3 text-sm font-semibold text-white" href="/build-your-mattress">Request a consultation</Link>
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-3"><FavoriteButton productSlug={slug} /><Link className="border border-[#171717] px-5 py-3 text-sm font-semibold uppercase tracking-wider" href={collectionHref}>Browse collection</Link>{isMattress ? <Link className="border border-[#171717] px-5 py-3 text-sm font-semibold uppercase tracking-wider" href="/build-your-mattress">Customize a mattress</Link> : null}</div>
        </section>
        </div><section className="mt-12 grid gap-5 border-t border-[#d6c8b5] pt-8 md:grid-cols-3"><div><h2 className="font-serif text-2xl">Product description</h2><p className="mt-3 text-sm leading-6 text-neutral-600">{product.description || product.short_description || "Details will be confirmed with your order."}</p></div><div><h2 className="font-serif text-2xl">Delivery and care</h2><p className="mt-3 text-sm leading-6 text-neutral-600">Production and delivery timing are confirmed once the order configuration is approved.</p></div><div><h2 className="font-serif text-2xl">Questions</h2><details className="mt-3 border-b border-[#d6c8b5] pb-3 text-sm"><summary className="cursor-pointer font-semibold">Can I request a custom size?</summary><p className="mt-2 leading-6 text-neutral-600">Yes. Choose Custom for mattress sizing, or request a consultation for Interior products.</p></details></div></section></div>
      </main>
    </>
  );
}
