import Link from "next/link";
import { FavoriteButton } from "@/components/catalog/favorite-button";
import { MattressConfigurator } from "@/components/catalog/mattress-configurator";
import { Header } from "@/components/layout/header";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function OrthoPlusMattressPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("products").select("name, description, short_description").eq("slug", "ortho-plus-mattress").eq("status", "active").maybeSingle();
  const description = data?.description || data?.short_description || "A made-to-order orthopedic mattress. Select the support series, bed dimensions, and thickness before adding your preferred configuration to cart.";
  return <><Header /><main className="min-h-screen bg-[#f8f4ec] px-5 py-10 text-[#171717] md:px-10"><div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2"><div className="aspect-square border border-[#d6c8b5] bg-white p-8"><img alt="Ortho Plus Mattress placeholder" className="h-full w-full object-contain" src="/product-placeholder.svg" /></div><section><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#9d6b36]">SleepExcellent catalogue</p><h1 className="mt-3 font-serif text-4xl md:text-5xl">{data?.name || "Ortho Plus Mattress"}</h1><p className="mt-5 max-w-xl leading-7 text-neutral-600">{description}</p><MattressConfigurator productSlug="ortho-plus-mattress" /><div className="mt-5 flex flex-wrap gap-3"><FavoriteButton productSlug="ortho-plus-mattress" /><Link className="inline-block border border-[#171717] px-5 py-3 text-sm font-semibold uppercase tracking-wider" href="/shop">Browse collection</Link></div></section></div></main></>;
}
