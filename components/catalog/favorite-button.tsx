"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "sleepexcellent-favorites";

function readFavorites(): string[] {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function FavoriteButton({ productSlug }: { productSlug: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => setSaved(readFavorites().includes(productSlug)), [productSlug]);

  function toggleFavorite() {
    const favorites = readFavorites();
    const next = favorites.includes(productSlug)
      ? favorites.filter((slug) => slug !== productSlug)
      : [...favorites, productSlug];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSaved(next.includes(productSlug));
  }

  return <button aria-pressed={saved} className="border border-[#171717] px-5 py-3 text-sm font-semibold uppercase tracking-wider transition hover:bg-[#171717] hover:text-white" onClick={toggleFavorite} type="button">{saved ? "Saved to favorites" : "Save to favorites"}</button>;
}
