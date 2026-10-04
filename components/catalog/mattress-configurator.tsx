"use client";

import { useMemo, useState } from "react";
import { AddToCart } from "@/components/catalog/add-to-cart";

const sizes = [
  "Diwan Mattress — 72 × 36 in",
  "Single Mattress — 75 × 36 in",
  "Double Mattress — 75 × 48 in",
  "Queen Mattress — 75 × 60 in",
  "King Mattress — 75 × 72 in",
  "King Mattress — 78 × 72 in",
] as const;

const colors = [
  ["Ivory", "#eee8dc"],
  ["Taupe", "#b4a18b"],
  ["Camel", "#a56f43"],
  ["Chocolate", "#5a3826"],
  ["Navy", "#172840"],
  ["Teal", "#456766"],
  ["Ash Grey", "#8c8b87"],
  ["Charcoal", "#393b38"],
  ["Emerald", "#173f34"],
  ["Onyx", "#171717"],
] as const;

const thicknesses = ["6 in", "8 in", "10 in", "12 in"] as const;

export function ProductConfigurator({ productSlug, showColors = true, showSizes = false }: { productSlug: string; showColors?: boolean; showSizes?: boolean }) {
  const [size, setSize] = useState<(typeof sizes)[number]>(sizes[0]);
  const [thickness, setThickness] = useState<(typeof thicknesses)[number]>(thicknesses[0]);
  const [color, setColor] = useState<(typeof colors)[number][0]>("Ivory");
  const configuration = useMemo(() => ({ ...(showSizes ? { size, thickness } : {}), ...(showColors ? { color } : {}) }), [color, showColors, showSizes, size, thickness]);

  return <section className="mt-8 border-t border-[#d6c8b5] pt-7">
    {showSizes ? <>
      <h2 className="font-serif text-2xl">Choose mattress size</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{sizes.map((option) => <button aria-pressed={size === option} className={`rounded-xl border p-4 text-center transition ${size === option ? "border-[#5d2bea] bg-[#eee6ff] text-[#5d2bea]" : "border-[#cdbfab] bg-white hover:border-[#171717]"}`} key={option} onClick={() => setSize(option)} type="button"><strong className="block text-base">{option}</strong></button>)}</div>
      <h2 className="mt-8 font-serif text-2xl">Choose mattress thickness</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{thicknesses.map((option) => <button aria-pressed={thickness === option} className={`rounded-xl border p-4 text-center font-semibold transition ${thickness === option ? "border-[#5d2bea] bg-[#eee6ff] text-[#5d2bea]" : "border-[#cdbfab] bg-white hover:border-[#171717]"}`} key={option} onClick={() => setThickness(option)} type="button">{option}</button>)}</div>
    </> : null}
    {showColors ? <><h2 className={`font-serif text-2xl ${showSizes ? "mt-8" : ""}`}>Choose color</h2>
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">{colors.map(([name, value]) => <button aria-pressed={color === name} className={`rounded-xl border p-3 text-left transition ${color === name ? "border-[#171717] ring-2 ring-[#171717] ring-offset-2" : "border-[#cdbfab] hover:border-[#171717]"}`} key={name} onClick={() => setColor(name)} type="button"><span className="block h-10 rounded-lg border border-black/10" style={{ backgroundColor: value }} /><span className="mt-2 block text-xs font-semibold">{name}</span></button>)}</div>
    <p className="mt-4 text-xs leading-5 text-neutral-600">Actual fabric and finish tones may vary slightly by screen and material batch.</p></> : null}
    <AddToCart configuration={configuration} productSlug={productSlug} showBuyNow />
  </section>;
}
