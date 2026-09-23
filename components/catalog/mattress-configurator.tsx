"use client";

import { useMemo, useState } from "react";
import { AddToCart } from "@/components/catalog/add-to-cart";

const sizes = [
  { name: "Single", width: '30" / 36" / 42"' },
  { name: "Diwan", width: '48"' },
  { name: "Queen", width: '60" / 66"' },
  { name: "King", width: '72" / 75" / 78"' },
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

export function ProductConfigurator({ productSlug, showSizes = false }: { productSlug: string; showSizes?: boolean }) {
  const [size, setSize] = useState<(typeof sizes)[number]["name"]>("Single");
  const [color, setColor] = useState<(typeof colors)[number][0]>("Ivory");
  const configuration = useMemo(() => ({ ...(showSizes ? { size } : {}), color }), [color, showSizes, size]);

  return <section className="mt-8 border-t border-[#d6c8b5] pt-7">
    {showSizes ? <>
      <h2 className="font-serif text-2xl">Choose mattress size</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{sizes.map((option) => <button aria-pressed={size === option.name} className={`rounded-xl border p-4 text-center transition ${size === option.name ? "border-[#5d2bea] bg-[#eee6ff] text-[#5d2bea]" : "border-[#cdbfab] bg-white hover:border-[#171717]"}`} key={option.name} onClick={() => setSize(option.name)} type="button"><strong className="block text-base">{option.name}</strong><span className="mt-1 block text-xs">{option.width}</span></button>)}</div>
    </> : null}
    <h2 className={`font-serif text-2xl ${showSizes ? "mt-8" : ""}`}>Choose color</h2>
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">{colors.map(([name, value]) => <button aria-pressed={color === name} className={`rounded-xl border p-3 text-left transition ${color === name ? "border-[#171717] ring-2 ring-[#171717] ring-offset-2" : "border-[#cdbfab] hover:border-[#171717]"}`} key={name} onClick={() => setColor(name)} type="button"><span className="block h-10 rounded-lg border border-black/10" style={{ backgroundColor: value }} /><span className="mt-2 block text-xs font-semibold">{name}</span></button>)}</div>
    <p className="mt-4 text-xs leading-5 text-neutral-600">Actual fabric and finish tones may vary slightly by screen and material batch.</p>
    <AddToCart configuration={configuration} productSlug={productSlug} />
  </section>;
}
