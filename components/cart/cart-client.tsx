"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { customerAuthHeaders } from "@/lib/supabase/client-auth";

type Line = { id: string; productSlug: string; productName: string; variantTitle: string; pricePaise: number; quantity: number; configuration: Record<string, string> | null };
const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

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
    setStatus("ready");
  }

  return <main className="min-h-screen bg-[#f8f4ec] px-5 py-10 text-[#171717] md:px-10">
    <header className="mx-auto flex max-w-6xl items-center justify-between border-b border-[#d6c8b5] pb-6"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#9d6b36]">SleepExcellent</p><h1 className="mt-2 font-serif text-4xl">Your cart</h1></div><nav className="flex gap-4 text-sm font-semibold"><Link href="/shop">Continue shopping</Link><Link href="/account">Account</Link></nav></header>
    {status === "loading" && lines.length === 0 ? <p className="mx-auto max-w-6xl py-12 text-neutral-600">Loading your cart…</p> : null}
    {status === "error" ? <p className="mx-auto max-w-6xl py-12 text-red-700">{message}</p> : null}
    {status !== "error" && status !== "loading" && lines.length === 0 ? <section className="mx-auto max-w-6xl py-16"><p className="text-lg text-neutral-600">Your cart is empty.</p><Link className="mt-5 inline-block bg-[#171717] px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white" href="/shop">Browse mattresses</Link></section> : null}
    {lines.length > 0 ? <section className="mx-auto grid max-w-6xl gap-8 py-8 lg:grid-cols-[1fr_320px]">
      <div className="divide-y divide-[#e7dccb] border border-[#d6c8b5] bg-white">{lines.map((line) => <article className="flex gap-5 p-5" key={line.id}><div className="grid h-24 w-24 shrink-0 place-items-center border border-[#e7dccb] bg-[#f8f4ec] text-center text-[10px] uppercase tracking-wider text-neutral-500">Image<br />pending</div><div className="min-w-0 flex-1"><Link className="font-serif text-2xl hover:underline" href={`/products/${line.productSlug}`}>{line.productName}</Link><p className="mt-1 text-sm text-neutral-600">{line.variantTitle}</p>{line.configuration ? <p className="mt-2 text-xs font-medium uppercase tracking-wider text-[#765025]">{Object.values(line.configuration).join(" · ")}</p> : null}<p className="mt-3 font-semibold">{money.format(line.pricePaise / 100)}</p><div className="mt-4 flex items-center gap-3"><button aria-label={`Decrease ${line.productName} quantity`} className="border border-[#171717] px-3 py-1" disabled={status === "loading"} onClick={() => updateItem(line.id, line.quantity - 1)} type="button">−</button><span className="min-w-5 text-center">{line.quantity}</span><button aria-label={`Increase ${line.productName} quantity`} className="border border-[#171717] px-3 py-1" disabled={status === "loading" || line.quantity >= 10} onClick={() => updateItem(line.id, line.quantity + 1)} type="button">+</button><button className="ml-3 text-sm underline" disabled={status === "loading"} onClick={() => updateItem(line.id, 0)} type="button">Remove</button></div></div><p className="font-semibold">{money.format((line.pricePaise * line.quantity) / 100)}</p></article>)}</div>
      <aside className="h-fit border border-[#d6c8b5] bg-white p-5"><h2 className="font-serif text-2xl">Order summary</h2><div className="mt-5 flex justify-between border-y border-[#e7dccb] py-4"><span>Subtotal</span><strong>{money.format(subtotal / 100)}</strong></div><p className="mt-4 text-sm leading-6 text-neutral-600">Delivery is confirmed by our operations team after payment.</p><Link className="mt-6 block bg-[#171717] px-5 py-3 text-center text-sm font-semibold uppercase tracking-wider text-white" href="/checkout">Proceed to secure checkout</Link></aside>
    </section> : null}
  </main>;
}
