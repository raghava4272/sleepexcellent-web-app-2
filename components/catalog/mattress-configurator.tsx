"use client";

import { useMemo, useState } from "react";
import { AddToCart } from "@/components/catalog/add-to-cart";

const series = [
  ["Essential", "Best value", "Balanced orthopedic support", "₹6,537"],
  ["Classic", "Bestseller", "Orthopedic foam for side and back sleepers", "₹8,397"],
  ["Infinity", "Advanced", "Lumbar-reinforced support for long-term comfort", "₹13,867"],
  ["Ultra", "Premium", "Full-body contouring with advanced air flow", "₹21,217"],
] as const;
const dimensions = {
  Single: ["72 × 30 in", "72 × 35 in", "72 × 36 in", "72 × 42 in"],
  Diwan: ["75 × 30 in", "75 × 35 in", "75 × 36 in", "75 × 42 in"],
  Queen: ["78 × 30 in", "78 × 35 in", "78 × 36 in", "78 × 42 in"],
  King: ["72 × 75 in", "72 × 78 in", "75 × 78 in", "78 × 78 in"],
} as const;

export function MattressConfigurator({ productSlug }: { productSlug: string }) {
  const [selectedSeries, setSelectedSeries] = useState<(typeof series)[number][0]>("Essential");
  const [sizeGroup, setSizeGroup] = useState<keyof typeof dimensions>("Single");
  const [dimension, setDimension] = useState("72 × 36 in");
  const [thickness, setThickness] = useState("6 in");
  const [customSize, setCustomSize] = useState(false);
  const configuration = useMemo(() => ({ series: selectedSeries, size_group: customSize ? "Custom" : sizeGroup, dimension: customSize ? "Custom size – confirm with team" : dimension, thickness }), [customSize, dimension, selectedSeries, sizeGroup, thickness]);

  function chooseGroup(group: keyof typeof dimensions) { setCustomSize(false); setSizeGroup(group); setDimension(dimensions[group][0]); }
  return <section className="mt-8 border-t border-[#d6c8b5] pt-7">
    <div className="flex items-center justify-between gap-3"><h2 className="font-serif text-2xl">Choose your mattress</h2><span className="rounded-full border border-[#9d6b36] px-3 py-1 text-xs font-semibold text-[#9d6b36]">Compare series</span></div>
    <div className="mt-4 overflow-hidden rounded-xl border border-[#d6c8b5] bg-white">{series.map(([name, label, description, price]) => <button className={`grid w-full grid-cols-[22px_1fr_auto] gap-3 border-b border-[#eadfce] p-4 text-left last:border-0 ${selectedSeries === name ? "bg-[#f3ecff]" : "hover:bg-[#fffdfa]"}`} key={name} onClick={() => setSelectedSeries(name)} type="button"><span className={`mt-1 h-5 w-5 rounded-full border-2 ${selectedSeries === name ? "border-[#5d2bea] bg-[#5d2bea] shadow-[inset_0_0_0_4px_white]" : "border-neutral-300"}`} /><span><span className="font-semibold">{name}</span><span className="ml-2 rounded bg-[#eee4d5] px-2 py-0.5 text-[10px] font-bold uppercase text-[#765025]">{label}</span><span className="mt-1 block text-sm text-neutral-600">{description}</span></span><strong className="whitespace-nowrap">{price}</strong></button>)}</div>
    <div className="mt-8 flex items-center gap-3"><h3 className="font-serif text-2xl">Choose size</h3><span className="rounded bg-[#5d2bea] px-3 py-1 text-xs font-semibold text-white">Order any size</span></div>
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">{(["Single", "Diwan", "Queen", "King"] as const).map((group) => <button className={`rounded border px-3 py-3 text-sm font-semibold ${!customSize && sizeGroup === group ? "border-[#5d2bea] bg-[#eee6ff] text-[#5d2bea]" : "border-[#cdbfab] bg-white"}`} key={group} onClick={() => chooseGroup(group)} type="button">{group}</button>)}<button className={`rounded border px-3 py-3 text-sm font-semibold ${customSize ? "border-[#5d2bea] bg-[#eee6ff] text-[#5d2bea]" : "border-[#cdbfab] bg-white"}`} onClick={() => setCustomSize(true)} type="button">Custom</button></div>
    {!customSize ? <><h3 className="mt-7 text-lg font-semibold">Dimensions</h3><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">{dimensions[sizeGroup].map((value) => <button className={`rounded border px-3 py-3 text-sm font-medium ${dimension === value ? "border-[#5d2bea] bg-[#eee6ff] text-[#5d2bea]" : "border-[#cdbfab] bg-white"}`} key={value} onClick={() => setDimension(value)} type="button">{value}</button>)}</div></> : <p className="mt-5 rounded border border-[#d6c8b5] bg-white p-4 text-sm text-neutral-600">Our mattress team will confirm your exact custom dimensions before production.</p>}
    <h3 className="mt-7 text-lg font-semibold">Thickness</h3><div className="mt-3 grid max-w-md grid-cols-4 gap-3">{["4 in", "5 in", "6 in", "8 in"].map((value) => <button className={`rounded border px-3 py-3 text-sm font-semibold ${thickness === value ? "border-[#5d2bea] bg-[#eee6ff] text-[#5d2bea]" : "border-[#cdbfab] bg-white"}`} key={value} onClick={() => setThickness(value)} type="button">{value}</button>)}</div>
    <p className="mt-5 text-sm text-[#9d6b36]">Configuration: {configuration.series} · {configuration.size_group} · {configuration.dimension} · {configuration.thickness}</p>
    <AddToCart configuration={configuration} productSlug={productSlug} />
  </section>;
}
