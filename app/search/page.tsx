import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/server";

type SearchPageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

type SearchProduct = {
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  categories: { name: string }[] | null;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const rawQuery = (await searchParams).q;
  const query = (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery ?? "").trim();
  let products: SearchProduct[] = [];
  let loadFailed = false;

  if (query) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from("products")
        .select("name, slug, short_description, description, categories(name)")
        .eq("status", "active")
        .ilike("name", `%${query.replace(/[%,_]/g, "\\$&")}%`)
        .order("name")
        .limit(24);
      if (error) throw error;
      products = (data ?? []) as SearchProduct[];
    } catch {
      loadFailed = true;
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f4ec] text-[#171717]">
      <section className="mx-auto max-w-6xl px-5 py-10 md:px-10">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#8a694c]">Catalogue search</p>
        <h1 className="mt-2 font-display text-4xl">{query ? `Results for “${query}”` : "Search the catalogue"}</h1>
        {!query ? <p className="mt-4 text-neutral-600">Enter a product name in the search bar to find available catalogue items.</p> : null}
        {loadFailed ? <p className="mt-6 rounded border border-[#c93b2b] bg-white p-5 text-sm">Search is temporarily unavailable. Please try again shortly.</p> : null}
        {query && !loadFailed && products.length === 0 ? <p className="mt-6 rounded border border-[#d6c8b5] bg-white p-5 text-neutral-600">No active products match this search. Try a different mattress name.</p> : null}
        {products.length > 0 ? <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <article className="rounded border border-[#d6c8b5] bg-white p-5" key={product.slug}><p className="text-xs font-semibold uppercase tracking-[.14em] text-[#8a694c]">{product.categories?.[0]?.name ?? "SleepExcellent catalogue"}</p><h2 className="mt-2 font-display text-2xl">{product.name}</h2><p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-600">{product.short_description || product.description || "Product details are available on the product page."}</p><Link className="mt-5 inline-block text-sm font-semibold underline underline-offset-4" href={`/products/${product.slug}`}>View product</Link></article>)}</div> : null}
      </section>
    </main>
  );
}
