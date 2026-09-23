import { StitchFrame } from "@/components/stitch/stitch-frame";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPricingManifest, priceLabel } from "@/lib/catalog/pricing";

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category: requestedCategory } = await searchParams;
  const slug = requestedCategory === "beds" ? "padding-beds" : requestedCategory;
  if (slug && slug !== "mattresses") {
    if (!["sofas", "padding-beds"].includes(slug)) notFound();
    const supabase = await createSupabaseServerClient();
    const { data: category, error: categoryError } = await supabase.from("categories").select("id, name, description").eq("slug", slug).eq("is_active", true).maybeSingle();
    if (categoryError) throw new Error("Unable to load this collection.");
    if (!category) notFound();
    const [{ data: products, error }, pricing] = await Promise.all([
      supabase.from("products").select("id, name, slug, short_description, product_images(storage_path, alt_text, sort_order)").eq("category_id", category.id).eq("status", "active").order("name"),
      getPricingManifest(),
    ]);
    if (error) throw new Error("Unable to load collection products.");
    return <><main className="bg-[#f8f4ec] px-5 py-10 text-[#171717] md:px-10"><div className="mx-auto max-w-7xl"><Link className="text-sm text-neutral-600 hover:underline" href="/">Home</Link><p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#9d6b36]">SleepExcellent collection</p><h1 className="mt-3 font-serif text-4xl md:text-5xl">{category.name}</h1><p className="mt-4 max-w-2xl text-neutral-600">{category.description}</p><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{(products ?? []).map((product, index) => { const image = [...(product.product_images ?? [])].sort((a, b) => a.sort_order - b.sort_order)[0]; const imageUrl = image ? supabase.storage.from("product-images").getPublicUrl(image.storage_path).data.publicUrl : null; return <Link className="rounded-2xl border border-[#d6c8b5] bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg" href={`/products/${product.slug}`} key={product.id}><div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#f7f5f1]"><Image alt={image?.alt_text || `${product.name} image placeholder`} fill loading={index < 3 ? "eager" : "lazy"} sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw" src={imageUrl || "/product-placeholder.svg"} className={`rounded-xl ${imageUrl ? "object-cover" : "object-contain"}`} unoptimized={Boolean(imageUrl)} /></div><h2 className="mt-5 font-serif text-2xl">{product.name}</h2><p className="mt-2 text-sm leading-6 text-neutral-600">{product.short_description}</p><p className="mt-3 text-sm font-semibold text-[#8a694c]">{priceLabel(pricing[product.slug]) || "Pricing on request"}</p><span className="mt-4 inline-block text-sm font-semibold">View product →</span></Link>; })}</div>{!products?.length ? <p className="mt-10 text-neutral-600">No active products are available in this collection yet.</p> : null}</div></main></>;
  }
  const supabase = await createSupabaseServerClient();
  const { data: mattressCategory, error: mattressCategoryError } = await supabase.from("categories").select("id").eq("slug", "mattresses").eq("is_active", true).maybeSingle();
  if (mattressCategoryError) throw new Error("Unable to load mattress images.");
  const { data: mattresses, error: mattressError } = mattressCategory
    ? await supabase.from("products").select("slug, product_images(storage_path, sort_order)").eq("category_id", mattressCategory.id).eq("status", "active")
    : { data: [], error: null };
  if (mattressError) throw new Error("Unable to load mattress images.");
  const mattressImages = Object.fromEntries((mattresses ?? []).flatMap((product) => {
    const hero = [...(product.product_images ?? [])].sort((left, right) => left.sort_order - right.sort_order)[0];
    return hero ? [[product.slug, supabase.storage.from("product-images").getPublicUrl(hero.storage_path).data.publicUrl]] : [];
  }));
  return (
    <main aria-label="SleepExcellent mattress catalog">
      <StitchFrame
        className="stitch-frame--listing"
        hideEmbeddedHeader
        productImages={mattressImages}
        src="/stitch-product-listing.html"
        title="SleepExcellent approved product listing"
      />
    </main>
  );
}
