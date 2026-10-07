"use client";

import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { customerAuthHeaders } from "@/lib/supabase/client-auth";

type CartLine = { id: string; productName: string; pricePaise: number; quantity: number; configuration: Record<string, string> | null };
type RazorpayOrder = { order_id: string; orderNumber: string; amount: number; currency: string; key_id: string };
type RazorpaySuccess = { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };
type RazorpayFailure = { error?: { description?: string } };
type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  modal: { ondismiss: () => void };
  handler: (response: RazorpaySuccess) => void | Promise<void>;
};
type RazorpayInstance = { open: () => void; on: (event: "payment.failed", callback: (response: RazorpayFailure) => void) => void };

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export function CheckoutClient({ customerEmail }: { customerEmail: string }) {
  const router = useRouter();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [message, setMessage] = useState("Loading your checkout…");
  const [busy, setBusy] = useState(false);

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

  async function verifyPayment(payment: RazorpaySuccess) {
    setMessage("Verifying your payment securely…");
    const response = await fetch("/api/checkout/verify", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", ...await customerAuthHeaders() },
      body: JSON.stringify(payment),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "Payment verification failed.");
    setMessage("Payment verified. Opening your order…");
    router.push(`/account/orders/${result.orderNumber}?payment=verified`);
    router.refresh();
  }

  async function startPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!window.Razorpay || !scriptReady) { setMessage("Secure checkout is still loading. Please try again in a moment."); return; }
    setBusy(true);
    setMessage("Creating your secure payment order…");
    const form = new FormData(event.currentTarget);
    const address = { recipientName: String(form.get("recipientName") ?? ""), phone: String(form.get("phone") ?? ""), line1: String(form.get("line1") ?? ""), city: String(form.get("city") ?? ""), state: String(form.get("state") ?? ""), postalCode: String(form.get("postalCode") ?? "") };
    try {
      const response = await fetch("/api/checkout/create-order", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json", ...await customerAuthHeaders() }, body: JSON.stringify({ address }) });
      const order = await response.json() as RazorpayOrder & { error?: string };
      if (!response.ok) throw new Error(order.error ?? "Unable to create your order.");
      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || order.key_id;
      if (!key) throw new Error("Razorpay checkout is not configured.");
      const checkout = new window.Razorpay({
        key,
        amount: order.amount,
        currency: order.currency,
        name: "SleepExcellent",
        description: `Order ${order.orderNumber}`,
        order_id: order.order_id,
        prefill: { name: address.recipientName, email: customerEmail, contact: address.phone },
        theme: { color: "#171717" },
        modal: { ondismiss: () => { setBusy(false); setMessage("Payment cancelled. Your cart has not been charged."); } },
        handler: async (payment) => {
          try { await verifyPayment(payment); }
          catch (error) { setMessage(error instanceof Error ? error.message : "Payment verification failed. Please contact us before retrying."); setBusy(false); }
        },
      });
      checkout.on("payment.failed", (failure) => {
        setBusy(false);
        setMessage(failure.error?.description || "Payment failed. Please try again or use another payment method.");
      });
      checkout.open();
    } catch (error) {
      setBusy(false);
      setMessage(error instanceof Error ? error.message : "Unable to start payment.");
    }
  }

  const total = lines.reduce((sum, line) => sum + line.pricePaise * line.quantity, 0);

  return <main className="min-h-screen bg-[#f8f4ec] px-5 py-10 text-[#171717] md:px-10">
    <Script onError={() => setMessage("Secure checkout could not be loaded. Please check your connection and try again.")} onLoad={() => setScriptReady(true)} src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
    <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 border-b border-[#d6c8b5] pb-6"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#9d6b36]">SleepExcellent</p><h1 className="mt-2 font-serif text-3xl sm:text-4xl">Checkout</h1></div><Link className="text-sm font-semibold underline" href="/cart">Return to cart</Link></header>
    <section className="mx-auto grid max-w-6xl gap-8 py-8 lg:grid-cols-[1fr_320px]">
      <form className="border border-[#d6c8b5] bg-white p-6" onSubmit={startPayment}><h2 className="font-serif text-2xl">Delivery details</h2><p className="mt-2 text-sm text-neutral-600">Enter your delivery address, then pay securely with Razorpay.</p><div className="mt-6 grid gap-4 sm:grid-cols-2">{[["recipientName", "Full name", "text"], ["phone", "Phone number", "tel"], ["line1", "Address", "text"], ["city", "City", "text"], ["state", "State", "text"], ["postalCode", "6-digit PIN code", "text"]].map(([name, label, type]) => <label className={name === "line1" ? "grid gap-2 sm:col-span-2" : "grid gap-2"} key={name}><span className="text-sm font-medium">{label}</span><input className="rounded border border-[#b9aa96] bg-[#fffdfa] px-3 py-3 outline-none focus:border-[#171717]" inputMode={name === "postalCode" ? "numeric" : undefined} maxLength={name === "postalCode" ? 6 : undefined} name={name} required type={type} /></label>)}</div><button className="mt-7 w-full bg-[#171717] px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white disabled:cursor-wait disabled:opacity-60" disabled={!ready || !scriptReady || busy} type="submit">{busy ? "Opening secure payment…" : `Pay ${money.format(total / 100)} securely`}</button>{message ? <p className="mt-4 text-sm text-neutral-700" role="status">{message}</p> : null}</form>
      <aside className="h-fit border border-[#d6c8b5] bg-white p-5"><h2 className="font-serif text-2xl">Order summary</h2><div className="mt-5 space-y-3 text-sm">{lines.map((line) => <div className="flex justify-between gap-3" key={line.id}><span>{line.productName} × {line.quantity}</span><span>{money.format((line.pricePaise * line.quantity) / 100)}</span></div>)}</div><div className="mt-5 flex justify-between border-t border-[#e7dccb] pt-4 text-lg"><strong>Total</strong><strong>{money.format(total / 100)}</strong></div><p className="mt-4 text-xs leading-5 text-neutral-600">Payment is processed securely by Razorpay. Your order is confirmed only after signature verification.</p></aside>
    </section>
  </main>;
}
