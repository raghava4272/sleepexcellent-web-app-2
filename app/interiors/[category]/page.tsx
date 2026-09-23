import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPricingManifest, priceLabel } from "@/lib/catalog/pricing";

type Category = { id: string; name: string; slug: string; description: string | null };
type ProductImage = { storage_path: string; alt_text: string; sort_order: number };
type Product = { id: string; name: string; slug: string; short_description: string | null; product_images: ProductImage[] | null };
export const dynamic = "force-dynamic";

export default async function InteriorCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("categories").select("id, name, slug, description").eq("slug", slug).eq("is_active", true).maybeSingle();
  const category = data as Category | null;
  if (!category) notFound();
  const { data: productData } = await supabase.from("products").select("id, name, slug, short_description, product_images(storage_path, alt_text, sort_order)").eq("category_id", category.id).eq("status", "active").order("name");
  const products = (productData ?? []) as Product[];
  const pricing = await getPricingManifest();
  return <><main className="min-h-screen bg-[#f8f4ec] px-5 py-10 text-[#171717] md:px-10"><div className="mx-auto max-w-7xl"><Link className="text-sm text-neutral-600 hover:underline" href="/interiors">← All Interior</Link><p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#9d6b36]">SleepExcellent Interior</p><h1 className="mt-3 font-serif text-5xl">{category.name}</h1><p className="mt-4 max-w-2xl text-neutral-600">{category.description || "Made-to-order interior components selected to work around your rest."}</p><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map((product, index) => { const image = [...(product.product_images ?? [])].sort((a, b) => a.sort_order - b.sort_order)[0]; const imageUrl = image ? supabase.storage.from("product-images").getPublicUrl(image.storage_path).data.publicUrl : null; const price = priceLabel(pricing[product.slug]); return <Link className="rounded-2xl border border-[#d6c8b5] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg" href={`/products/${product.slug}`} key={product.id}><div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[#d6c8b5] bg-[#f7f5f1]"><Image alt={image?.alt_text || `${product.name} image placeholder`} className={imageUrl ? "object-cover" : "object-contain p-5"} fill loading={index < 3 ? "eager" : "lazy"} sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw" src={imageUrl || "/product-placeholder.svg"} unoptimized={Boolean(imageUrl)} /></div><h2 className="mt-5 font-serif text-2xl">{product.name}</h2><p className="mt-2 min-h-12 text-sm leading-6 text-neutral-600">{product.short_description || "Made-to-order interior design."}</p>{price ? <p className="mt-3 font-semibold text-[#8a694c]">{price}</p> : null}<span className="mt-4 inline-block text-sm font-semibold">View product →</span></Link>; })}</div>{products.length === 0 ? <p className="mt-10 text-neutral-600">No active products are available in this category yet.</p> : null}</div></main></>;
}
