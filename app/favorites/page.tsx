"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "sleepexcellent-favorites";

function titleFromSlug(slug: string) {
  return slug.split("-").filter(Boolean).map((part) => part === "tv" ? "TV" : part[0].toUpperCase() + part.slice(1)).join(" ");
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  useEffect(() => {
    try { setFavorites(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as string[]); } catch { setFavorites([]); }
  }, []);
  function remove(slug: string) {
    const next = favorites.filter((item) => item !== slug);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setFavorites(next);
  }
  return <main className="min-h-screen bg-[#f8f4ec] px-5 py-10 text-[#171717] md:px-10"><header className="mx-auto flex max-w-5xl items-end justify-between border-b border-[#d6c8b5] pb-6"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#9d6b36]">SleepExcellent</p><h1 className="mt-2 font-serif text-4xl">Favorites</h1></div><Link className="text-sm font-semibold underline" href="/shop">Shop collection</Link></header><section className="mx-auto max-w-5xl py-8">{favorites.length === 0 ? <div className="rounded border border-[#d6c8b5] bg-white p-8"><p className="text-lg">No saved products yet.</p><p className="mt-2 text-neutral-600">Use “Save to favorites” on a product to keep it here.</p></div> : <div className="grid gap-4 sm:grid-cols-2">{favorites.map((slug) => <article className="rounded border border-[#d6c8b5] bg-white p-5" key={slug}><h2 className="font-serif text-2xl">{titleFromSlug(slug)}</h2><div className="mt-5 flex gap-4"><Link className="font-semibold underline" href={`/products/${slug}`}>View product</Link><button className="text-sm font-semibold text-[#9d6b36] underline" onClick={() => remove(slug)} type="button">Remove</button></div></article>)}</div>}</section></main>;
}
