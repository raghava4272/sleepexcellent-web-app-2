"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

declare global {
  interface Window { Razorpay?: new (options: Record<string, unknown>) => { open: () => void } }
}

type CartLine = { id: string; productName: string; pricePaise: number; quantity: number };
const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export function CheckoutClient() {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("Loading your checkout…");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    void fetch("/api/cart", { cache: "no-store" }).then(async (response) => {
      if (response.status === 401) { window.location.href = "/auth/login?next=/checkout"; return; }
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Unable to load the cart.");
      if (payload.lines.length === 0) { window.location.href = "/cart"; return; }
      setLines(payload.lines);
      setReady(true);
      setMessage("");
    }).catch((error: Error) => setMessage(error.message));
    return () => script.remove();
  }, []);

  async function beginPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!window.Razorpay) { setMessage("Secure checkout is still loading. Please try again in a moment."); return; }
    setBusy(true); setMessage("");
    const form = new FormData(event.currentTarget);
    const address = {
      recipientName: String(form.get("recipientName") ?? ""), phone: String(form.get("phone") ?? ""), line1: String(form.get("line1") ?? ""), city: String(form.get("city") ?? ""), state: String(form.get("state") ?? ""), postalCode: String(form.get("postalCode") ?? ""),
    };
    try {
      const response = await fetch("/api/checkout/create-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address }) });
      const payment = await response.json();
      if (!response.ok) throw new Error(payment.error ?? "Unable to start payment.");
      const razorpay = new window.Razorpay({
        key: payment.keyId, amount: payment.amount, currency: payment.currency, name: "SleepExcellent", description: `Order ${payment.orderNumber}`, order_id: payment.razorpayOrderId,
        prefill: { name: payment.customer.name, email: payment.customer.email, contact: address.phone }, theme: { color: "#9d6b36" },
        handler: async (result: Record<string, string>) => {
          const verify = await fetch("/api/checkout/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...result, orderNumber: payment.orderNumber }) });
          const verified = await verify.json();
          if (!verify.ok) { setBusy(false); setMessage(verified.error ?? "Payment succeeded but its verification failed. Please contact us with your Razorpay payment ID."); return; }
          window.location.href = `/account/orders/${verified.orderNumber}?payment=verified`;
        },
        modal: { ondismiss: () => { setBusy(false); setMessage("Payment was not completed. Your cart is still saved."); } },
      });
      razorpay.open();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to start payment.");
      setBusy(false);
    }
  }

  const total = lines.reduce((sum, line) => sum + line.pricePaise * line.quantity, 0);
  return <main className="min-h-screen bg-[#f8f4ec] px-5 py-10 text-[#171717] md:px-10"><header className="mx-auto flex max-w-6xl items-center justify-between border-b border-[#d6c8b5] pb-6"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#9d6b36]">SleepExcellent</p><h1 className="mt-2 font-serif text-4xl">Secure checkout</h1></div><Link className="text-sm font-semibold underline" href="/cart">Return to cart</Link></header><section className="mx-auto grid max-w-6xl gap-8 py-8 lg:grid-cols-[1fr_320px]"><form className="border border-[#d6c8b5] bg-white p-6" onSubmit={beginPayment}><h2 className="font-serif text-2xl">Delivery details</h2><p className="mt-2 text-sm text-neutral-600">Our team confirms delivery timing after your verified payment.</p><div className="mt-6 grid gap-4 sm:grid-cols-2">{[["recipientName", "Full name", "text"], ["phone", "Phone number", "tel"], ["line1", "Address", "text"], ["city", "City", "text"], ["state", "State", "text"], ["postalCode", "6-digit PIN code", "text"]].map(([name, label, type]) => <label className={name === "line1" ? "grid gap-2 sm:col-span-2" : "grid gap-2"} key={name}><span className="text-sm font-medium">{label}</span><input className="rounded border border-[#b9aa96] bg-[#fffdfa] px-3 py-3 outline-none focus:border-[#171717]" inputMode={name === "postalCode" ? "numeric" : undefined} maxLength={name === "postalCode" ? 6 : undefined} name={name} required type={type} /></label>)}</div><button className="mt-7 w-full bg-[#171717] px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white disabled:cursor-wait disabled:opacity-60" disabled={!ready || busy} type="submit">{busy ? "Opening payment…" : "Pay securely with Razorpay"}</button>{message ? <p className="mt-4 text-sm text-neutral-700" role="status">{message}</p> : null}</form><aside className="h-fit border border-[#d6c8b5] bg-white p-5"><h2 className="font-serif text-2xl">Order summary</h2><div className="mt-5 space-y-3 text-sm">{lines.map((line) => <div className="flex justify-between gap-3" key={line.id}><span>{line.productName} × {line.quantity}</span><span>{money.format((line.pricePaise * line.quantity) / 100)}</span></div>)}</div><div className="mt-5 flex justify-between border-t border-[#e7dccb] pt-4 text-lg"><strong>Total</strong><strong>{money.format(total / 100)}</strong></div><p className="mt-4 text-xs leading-5 text-neutral-600">Test mode only. Your card or UPI details are entered in Razorpay’s secure checkout, not on SleepExcellent.</p></aside></section></main>;
}
