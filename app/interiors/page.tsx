import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Category = { id: string; name: string; slug: string; description: string | null };
type Product = { id: string; name: string; slug: string; short_description: string | null; category_id: string };

export const dynamic = "force-dynamic";

export default async function InteriorsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: interior } = await supabase.from("categories").select("id").eq("slug", "interior").maybeSingle();
  const { data: categoryData } = interior ? await supabase.from("categories").select("id, name, slug, description").eq("parent_id", interior.id).eq("is_active", true).order("sort_order") : { data: [] };
  const categories = (categoryData ?? []) as Category[];
  const ids = categories.map((category) => category.id);
  const { data: productData } = ids.length ? await supabase.from("products").select("id, name, slug, short_description, category_id").in("category_id", ids).eq("status", "active").order("name") : { data: [] };
  const products = (productData ?? []) as Product[];

  return <><main className="min-h-screen bg-[#f8f4ec] px-5 py-10 text-[#171717] md:px-10"><div className="mx-auto max-w-7xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9d6b36]">SleepExcellent Interior</p><h1 className="mt-3 font-serif text-4xl md:text-6xl">Designed for the room around your rest.</h1><p className="mt-4 max-w-2xl leading-7 text-neutral-600">Explore made-to-order TV units, modular kitchens, and ceiling systems. Every project is scoped with our Interior team before an estimate is confirmed.</p><div className="mt-10 grid gap-5 lg:grid-cols-3">{categories.map((category) => { const group = products.filter((product) => product.category_id === category.id); return <section className="rounded-2xl border border-[#d6c8b5] bg-white p-6 shadow-sm" key={category.id}><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9d6b36]">Interior category</p><h2 className="mt-2 font-serif text-3xl">{category.name}</h2><p className="mt-3 min-h-12 text-sm leading-6 text-neutral-600">{category.description || "Made-to-order specifications and finishes for your space."}</p><Link className="mt-5 inline-block border-b border-[#171717] pb-1 text-sm font-semibold" href={`/interiors/${category.slug}`}>Explore {category.name} →</Link><ul className="mt-6 space-y-2 border-t border-[#eadfce] pt-4">{group.slice(0, 6).map((product) => <li key={product.id}><Link className="text-sm hover:underline" href={`/products/${product.slug}`}>{product.name}</Link></li>)}{group.length > 6 ? <li className="text-sm text-neutral-500">+ {group.length - 6} more designs</li> : null}</ul></section>; })}</div>{categories.length === 0 ? <p className="mt-10 rounded-2xl border border-dashed border-[#d6c8b5] p-8 text-neutral-600">Interior catalogue setup is in progress. Please check back shortly.</p> : null}</div></main></>;
}
