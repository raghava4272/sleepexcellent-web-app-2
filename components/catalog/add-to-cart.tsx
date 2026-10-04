"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { customerAuthHeaders } from "@/lib/supabase/client-auth";

export function AddToCart({ productSlug, configuration, showBuyNow = false, compact = false }: { productSlug: string; configuration?: Record<string, string>; showBuyNow?: boolean; compact?: boolean }) {
  const [state, setState] = useState<"idle" | "loading" | "added" | "error">("idle");
  const [pendingAction, setPendingAction] = useState<"cart" | "buy" | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function addItem(action: "cart" | "buy") {
    setState("loading");
    setPendingAction(action);
    setMessage("");
    const response = await fetch("/api/cart", {
      method: "POST",
      credentials: "same-origin", headers: { "Content-Type": "application/json", ...await customerAuthHeaders() },
      body: JSON.stringify({ productSlug, quantity: 1, configuration }),
    });
    if (response.status === 401) {
      router.push(`/auth/login?next=${encodeURIComponent(`/products/${productSlug}`)}`);
      return;
    }
    const payload = await response.json();
    if (!response.ok) {
      setState("error");
      setMessage(payload.error ?? "Unable to add this product.");
      return;
    }
    setState("added");
    setPendingAction(null);
    setMessage("Added to your cart.");
    const count = Array.isArray(payload.lines) ? payload.lines.reduce((total: number, line: { quantity?: number }) => total + (line.quantity ?? 0), 0) : 0;
    window.dispatchEvent(new CustomEvent("sleepexcellent-cart-updated", { detail: { count } }));
    if (action === "buy") router.push("/checkout");
  }

  return <div className={`${compact ? "mt-5" : "mt-8"} flex flex-wrap items-center gap-3`}>
    <button className="bg-[#171717] px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white disabled:cursor-wait disabled:opacity-60" disabled={state === "loading"} onClick={() => addItem("cart")} type="button">{pendingAction === "cart" ? "Adding…" : "Add to cart"}</button>
    {showBuyNow ? <button className="border border-[#171717] bg-white px-5 py-3 text-sm font-semibold uppercase tracking-wider text-[#171717] transition hover:bg-[#f3ede4] disabled:cursor-wait disabled:opacity-60" disabled={state === "loading"} onClick={() => addItem("buy")} type="button">{pendingAction === "buy" ? "Preparing…" : "Buy now"}</button> : null}
    {!compact ? <Link className="border border-[#171717] px-5 py-3 text-sm font-semibold uppercase tracking-wider" href="/cart">View cart</Link> : null}
    {message ? <p className={state === "error" ? "w-full text-sm text-red-700" : "w-full text-sm text-green-700"} role="status">{message}</p> : null}
  </div>;
}
