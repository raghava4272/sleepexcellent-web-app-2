import Link from "next/link";
import { FavoriteButton } from "@/components/catalog/favorite-button";
import { MattressConfigurator } from "@/components/catalog/mattress-configurator";

function titleFromSlug(slug: string) {
  return slug.split("-").filter(Boolean).map((part) => part === "tv" ? "TV" : part === "pop" ? "POP" : part[0].toUpperCase() + part.slice(1)).join(" ");
}

export default async function CatalogProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = titleFromSlug(slug);

  return (
    <main className="min-h-screen bg-[#f8f4ec] px-5 py-10 text-[#171717] md:px-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
        <div className="aspect-square border border-[#d6c8b5] bg-white p-8"><img alt="" className="h-full w-full object-contain" src="/product-placeholder.svg" /></div>
        <section className="self-center">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#9d6b36]">SleepExcellent catalogue</p>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl">{title}</h1>
          <p className="mt-5 max-w-xl leading-7 text-neutral-600">{title} is part of the SleepExcellent made-to-order catalogue. Material, dimensions, finish, specifications and final pricing are confirmed with you before production and delivery.</p>
          <MattressConfigurator productSlug={slug} />
          <div className="mt-5 flex flex-wrap gap-3"><FavoriteButton productSlug={slug} /><Link className="border border-[#171717] px-5 py-3 text-sm font-semibold uppercase tracking-wider" href="/shop">Browse collection</Link><Link className="border border-[#171717] px-5 py-3 text-sm font-semibold uppercase tracking-wider" href="/build-your-mattress">Customize a mattress</Link></div>
        </section>
      </div>
    </main>
  );
}
