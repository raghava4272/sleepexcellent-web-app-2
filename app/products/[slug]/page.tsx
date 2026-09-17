import Link from "next/link";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/catalog/favorite-button";
import { MattressConfigurator } from "@/components/catalog/mattress-configurator";
import { Header } from "@/components/layout/header";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Product = { id: string; name: string; slug: string; short_description: string | null; description: string | null; purchase_mode: "direct" | "configurable" | "quote_only"; category_id: string };
type Category = { name: string; slug: string };

export default async function CatalogProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: productData } = await supabase.from("products").select("id, name, slug, short_description, description, purchase_mode, category_id").eq("slug", slug).eq("status", "active").maybeSingle();
  const product = productData as Product | null;
  if (!product) notFound();
  const { data: categoryData } = await supabase.from("categories").select("name, slug").eq("id", product.category_id).maybeSingle();
  const category = categoryData as Category | null;
  const isMattress = category?.slug === "mattresses";
  const isQuoteOnly = product.purchase_mode === "quote_only";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f8f4ec] px-5 py-10 text-[#171717] md:px-10">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
        <div className="aspect-square border border-[#d6c8b5] bg-white p-8"><img alt="" className="h-full w-full object-contain" src="/product-placeholder.svg" /></div>
        <section className="self-center">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#9d6b36]">SleepExcellent {category?.name || "catalogue"}</p>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl">{product.name}</h1>
          <p className="mt-5 max-w-xl leading-7 text-neutral-600">{product.description || product.short_description || `${product.name} is part of the SleepExcellent made-to-order catalogue. Material, dimensions, finish, specifications and final pricing are confirmed with you before production and delivery.`}</p>
          {isMattress ? (
            <MattressConfigurator productSlug={slug} />
          ) : (
            <div className="mt-7 rounded-2xl border border-[#d6c8b5] bg-white p-5">
              <p className="text-sm font-semibold">{isQuoteOnly ? "Project pricing on request" : "Specifications and pricing"}</p>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{isQuoteOnly ? "Our Interior team will confirm materials, dimensions, site requirements, and your final estimate after a consultation." : "Select your preferred configuration and our team will confirm the final specification."}</p>
              <Link className="mt-4 inline-block rounded-full bg-[#181818] px-5 py-3 text-sm font-semibold text-white" href="/build-your-mattress">Request a consultation</Link>
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-3"><FavoriteButton productSlug={slug} /><Link className="border border-[#171717] px-5 py-3 text-sm font-semibold uppercase tracking-wider" href={category?.slug === "interior" || ["tv-units", "kitchen", "ceilings"].includes(category?.slug || "") ? "/interiors" : "/shop"}>Browse collection</Link>{isMattress ? <Link className="border border-[#171717] px-5 py-3 text-sm font-semibold uppercase tracking-wider" href="/build-your-mattress">Customize a mattress</Link> : null}</div>
        </section>
        </div>
      </main>
    </>
  );
}
