"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { customerAuthHeaders } from "@/lib/supabase/client-auth";

type Line = { id: string; productSlug: string; productName: string; imageUrl: string | null; variantTitle: string; pricePaise: number; quantity: number; configuration: Record<string, string> | null };
const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const announceCartQuantity = (lines: Line[]) => window.dispatchEvent(new CustomEvent("sleepexcellent-cart-updated", { detail: { count: lines.reduce((total, line) => total + line.quantity, 0) } }));

export function CartClient() {
  const [lines, setLines] = useState<Line[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");
  const subtotal = useMemo(() => lines.reduce((total, line) => total + line.pricePaise * line.quantity, 0), [lines]);

  async function loadCart() {
    const response = await fetch("/api/cart", { cache: "no-store", credentials: "same-origin", headers: await customerAuthHeaders() });
    if (response.status === 401) {
      window.location.href = "/auth/login?next=/cart";
      return;
    }
    const payload = await response.json();
    if (!response.ok) {
      setStatus("error");
      setMessage(payload.error ?? "Unable to load your cart.");
      return;
    }
    setLines(payload.lines);
    announceCartQuantity(payload.lines);
    setStatus("ready");
  }

  useEffect(() => {
    const task = window.setTimeout(() => { void loadCart(); }, 0);
    return () => window.clearTimeout(task);
  }, []);

  async function updateItem(itemId: string, quantity: number) {
    setStatus("loading");
    const response = await fetch("/api/cart", { method: "PATCH", credentials: "same-origin", headers: { "Content-Type": "application/json", ...await customerAuthHeaders() }, body: JSON.stringify({ itemId, quantity }) });
    const payload = await response.json();
    if (!response.ok) {
      setStatus("error");
      setMessage(payload.error ?? "Unable to update your cart.");
      return;
    }
    setLines(payload.lines);
    announceCartQuantity(payload.lines);
    setStatus("ready");
  }

  return <main className="min-h-screen min-w-0 overflow-x-hidden bg-[#f8f4ec] px-4 py-8 text-[#171717] sm:px-5 sm:py-10 md:px-10">
    <header className="mx-auto flex max-w-6xl flex-col items-start gap-5 border-b border-[#d6c8b5] pb-6 sm:flex-row sm:items-end sm:justify-between"><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#9d6b36]">SleepExcellent</p><h1 className="mt-2 font-serif text-4xl">Your cart</h1></div><nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold"><Link href="/shop">Continue shopping</Link><Link href="/account">Account</Link></nav></header>
    {status === "loading" && lines.length === 0 ? <p className="mx-auto max-w-6xl py-12 text-neutral-600">Loading your cart…</p> : null}
    {status === "error" ? <p className="mx-auto max-w-6xl py-12 text-red-700">{message}</p> : null}
    {status !== "error" && status !== "loading" && lines.length === 0 ? <section className="mx-auto max-w-6xl py-16"><p className="text-lg text-neutral-600">Your cart is empty.</p><Link className="mt-5 inline-block bg-[#171717] px-5 py-3 text-sm font-semibold uppercase tracking-wider" href="/shop" style={{ color: "#ffffff" }}>Browse mattresses</Link></section> : null}
    {lines.length > 0 ? <section className="mx-auto grid min-w-0 max-w-6xl gap-6 py-6 sm:py-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
      <div className="min-w-0 divide-y divide-[#e7dccb] border border-[#d6c8b5] bg-white">{lines.map((line) => {
        const configurationValues = line.configuration ? Object.values(line.configuration) : [];
        const showVariantTitle = line.variantTitle && !configurationValues.includes(line.variantTitle);
        return <article className="grid min-w-0 grid-cols-[80px_minmax(0,1fr)] gap-4 p-4 sm:grid-cols-[96px_minmax(0,1fr)_auto] sm:gap-5 sm:p-5" key={line.id}><Link className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-[#e7dccb] bg-[#f8f4ec] sm:h-24 sm:w-24" href={`/products/${line.productSlug}`}>{line.imageUrl ? <Image alt={`${line.productName} hero image`} className="object-cover" fill sizes="(max-width: 639px) 80px, 96px" src={line.imageUrl} unoptimized /> : <span className="grid h-full place-items-center text-center text-[10px] uppercase tracking-wider text-neutral-500">Image pending</span>}</Link><div className="min-w-0"><Link className="block break-words font-serif text-xl leading-tight hover:underline sm:text-2xl" href={`/products/${line.productSlug}`}>{line.productName}</Link>{showVariantTitle ? <p className="mt-1 text-sm text-neutral-600">{line.variantTitle}</p> : null}{configurationValues.length > 0 ? <p className="mt-2 break-words text-xs font-medium uppercase tracking-wider text-[#765025]">{configurationValues.join(" · ")}</p> : null}<p className="mt-3 font-semibold sm:hidden">{money.format((line.pricePaise * line.quantity) / 100)}</p><p className="mt-3 hidden text-sm text-neutral-600 sm:block">{money.format(line.pricePaise / 100)} each</p><div className="mt-4 flex flex-wrap items-center gap-3"><button aria-label={`Decrease ${line.productName} quantity`} className="h-10 w-10 border border-[#171717]" disabled={status === "loading"} onClick={() => updateItem(line.id, line.quantity - 1)} type="button">−</button><span className="min-w-5 text-center">{line.quantity}</span><button aria-label={`Increase ${line.productName} quantity`} className="h-10 w-10 border border-[#171717]" disabled={status === "loading" || line.quantity >= 10} onClick={() => updateItem(line.id, line.quantity + 1)} type="button">+</button><button className="text-sm underline" disabled={status === "loading"} onClick={() => updateItem(line.id, 0)} type="button">Remove</button></div></div><p className="hidden whitespace-nowrap font-semibold sm:block">{money.format((line.pricePaise * line.quantity) / 100)}</p></article>;
      })}</div>
      <aside className="h-fit min-w-0 border border-[#d6c8b5] bg-white p-4 sm:p-5"><h2 className="font-serif text-2xl">Order summary</h2><div className="mt-5 flex min-w-0 items-center justify-between gap-4 border-y border-[#e7dccb] py-4"><span>Subtotal</span><strong className="whitespace-nowrap">{money.format(subtotal / 100)}</strong></div><p className="mt-4 text-sm leading-6 text-neutral-600">Delivery is confirmed by our operations team after payment.</p><Link className="mt-6 block w-full bg-[#171717] px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider sm:px-5 sm:text-sm" href="/checkout" style={{ color: "#ffffff" }}>Proceed to secure checkout</Link></aside>
    </section> : null}
  </main>;
}
