"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { customerAuthHeaders } from "@/lib/supabase/client-auth";

type CartLine = { id: string; productName: string; pricePaise: number; quantity: number; configuration: Record<string, string> | null };
type PendingPayment = { orderNumber: string; amount: number; currency: string };
const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export function CheckoutClient() {
  const router = useRouter();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("Loading your checkout…");
  const [busy, setBusy] = useState(false);
  const [payment, setPayment] = useState<PendingPayment | null>(null);

  useEffect(() => {
    void customerAuthHeaders().then((headers) => fetch("/api/cart", { cache: "no-store", credentials: "same-origin", headers })).then(async (response) => {
      if (response.status === 401) { router.push("/auth/login?next=/checkout"); return; }
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Unable to load the cart.");
      if (payload.lines.length === 0) { router.push("/cart"); return; }
      setLines(payload.lines);
      setReady(true);
      setMessage("");
    }).catch((error: Error) => setMessage(error.message));
  }, [router]);

  async function createPendingOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const address = { recipientName: String(form.get("recipientName") ?? ""), phone: String(form.get("phone") ?? ""), line1: String(form.get("line1") ?? ""), city: String(form.get("city") ?? ""), state: String(form.get("state") ?? ""), postalCode: String(form.get("postalCode") ?? "") };
    try {
      const response = await fetch("/api/checkout/create-order", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json", ...await customerAuthHeaders() }, body: JSON.stringify({ address }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to create your order.");
      setPayment(result);
      setMessage("Your order is reserved. Complete the payment below and share the transaction reference with our team.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create your order.");
    } finally {
      setBusy(false);
    }
  }

  const total = lines.reduce((sum, line) => sum + line.pricePaise * line.quantity, 0);
  const whatsappMessage = payment ? encodeURIComponent(`Hello SleepExcellent, I paid for order ${payment.orderNumber}. My transaction reference is: `) : "";

  return <main className="min-h-screen bg-[#f8f4ec] px-5 py-10 text-[#171717] md:px-10">
    <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 border-b border-[#d6c8b5] pb-6"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#9d6b36]">SleepExcellent</p><h1 className="mt-2 font-serif text-3xl sm:text-4xl">Checkout</h1></div><Link className="text-sm font-semibold underline" href="/cart">Return to cart</Link></header>
    <section className="mx-auto grid max-w-6xl gap-8 py-8 lg:grid-cols-[1fr_320px]">
      {payment ? <section className="border border-[#d6c8b5] bg-white p-6 text-center sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#9d6b36]">Order {payment.orderNumber}</p><h2 className="mt-3 font-serif text-3xl">Scan to pay {money.format(payment.amount / 100)}</h2>
        <div className="relative mx-auto mt-6 aspect-[414/364] w-full max-w-sm overflow-hidden rounded-2xl border border-[#d6c8b5] bg-[#d6e5ed]"><Image alt="SleepExcellent Tap and Pay QR code" className="object-contain" fill priority sizes="384px" src="/payment-qr.png" /></div>
        <div className="mx-auto mt-6 max-w-xl rounded-2xl bg-[#f8f4ec] p-5 text-left text-sm leading-6 text-neutral-700"><strong className="text-[#171717]">After paying</strong><ol className="mt-2 list-decimal space-y-1 pl-5"><li>Copy your bank transaction or UTR reference.</li><li>Send it to our team with order number <strong>{payment.orderNumber}</strong>.</li><li>Your order will appear in your account after our team verifies the payment.</li></ol></div>
        <a className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#25D366] px-6 text-sm font-bold text-white" href={`https://wa.me/919044257999?text=${whatsappMessage}`} rel="noreferrer" target="_blank">Send payment reference on WhatsApp</a>
      </section> : <form className="border border-[#d6c8b5] bg-white p-6" onSubmit={createPendingOrder}><h2 className="font-serif text-2xl">Delivery details</h2><p className="mt-2 text-sm text-neutral-600">Enter the delivery address before continuing to QR payment.</p><div className="mt-6 grid gap-4 sm:grid-cols-2">{[["recipientName", "Full name", "text"], ["phone", "Phone number", "tel"], ["line1", "Address", "text"], ["city", "City", "text"], ["state", "State", "text"], ["postalCode", "6-digit PIN code", "text"]].map(([name, label, type]) => <label className={name === "line1" ? "grid gap-2 sm:col-span-2" : "grid gap-2"} key={name}><span className="text-sm font-medium">{label}</span><input className="rounded border border-[#b9aa96] bg-[#fffdfa] px-3 py-3 outline-none focus:border-[#171717]" inputMode={name === "postalCode" ? "numeric" : undefined} maxLength={name === "postalCode" ? 6 : undefined} name={name} required type={type} /></label>)}</div><button className="mt-7 w-full bg-[#171717] px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white disabled:cursor-wait disabled:opacity-60" disabled={!ready || busy} type="submit">{busy ? "Creating order…" : "Continue to QR payment"}</button>{message ? <p className="mt-4 text-sm text-neutral-700" role="status">{message}</p> : null}</form>}
      <aside className="h-fit border border-[#d6c8b5] bg-white p-5"><h2 className="font-serif text-2xl">Order summary</h2><div className="mt-5 space-y-3 text-sm">{lines.map((line) => <div className="flex justify-between gap-3" key={line.id}><span>{line.productName} × {line.quantity}</span><span>{money.format((line.pricePaise * line.quantity) / 100)}</span></div>)}</div><div className="mt-5 flex justify-between border-t border-[#e7dccb] pt-4 text-lg"><strong>Total</strong><strong>{money.format(total / 100)}</strong></div><p className="mt-4 text-xs leading-5 text-neutral-600">QR payments are manually verified by our team before an order is confirmed.</p></aside>
    </section>
  </main>;
}
