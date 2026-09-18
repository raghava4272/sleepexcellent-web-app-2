import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Category = { id: string; name: string; slug: string; description: string | null };
type Product = { id: string; name: string; slug: string; short_description: string | null };
export const dynamic = "force-dynamic";

export default async function InteriorCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("categories").select("id, name, slug, description").eq("slug", slug).eq("is_active", true).maybeSingle();
  const category = data as Category | null;
  if (!category) notFound();
  const { data: productData } = await supabase.from("products").select("id, name, slug, short_description").eq("category_id", category.id).eq("status", "active").order("name");
  const products = (productData ?? []) as Product[];
  return <><main className="min-h-screen bg-[#f8f4ec] px-5 py-10 text-[#171717] md:px-10"><div className="mx-auto max-w-7xl"><Link className="text-sm text-neutral-600 hover:underline" href="/interiors">← All Interior</Link><p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#9d6b36]">SleepExcellent Interior</p><h1 className="mt-3 font-serif text-5xl">{category.name}</h1><p className="mt-4 max-w-2xl text-neutral-600">{category.description || "Bespoke interior components, selected to work around your rest."} Final specifications and project pricing are confirmed after a consultation.</p><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <Link className="rounded-2xl border border-[#d6c8b5] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg" href={`/products/${product.slug}`} key={product.id}><div className="aspect-[4/3] rounded-xl border border-dashed border-[#d6c8b5] bg-[#f7f5f1] p-4 text-center text-xs uppercase tracking-[0.14em] text-neutral-500">Image coming soon</div><h2 className="mt-5 font-serif text-2xl">{product.name}</h2><p className="mt-2 min-h-12 text-sm leading-6 text-neutral-600">{product.short_description || "Made-to-order design. Ask our Interior team for materials, dimensions, and an estimate."}</p><span className="mt-4 inline-block text-sm font-semibold">Request details →</span></Link>)}</div>{products.length === 0 ? <p className="mt-10 text-neutral-600">No active products are available in this category yet.</p> : null}</div></main></>;
}
