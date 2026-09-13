"use client";

import { useState } from "react";
import Link from "next/link";

export function AddToCart({ productSlug }: { productSlug: string }) {
  const [state, setState] = useState<"idle" | "loading" | "added" | "error">("idle");
  const [message, setMessage] = useState("");

  async function addItem() {
    setState("loading");
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productSlug, quantity: 1 }),
    });
    if (response.status === 401) {
      window.location.href = `/auth/login?next=${encodeURIComponent(`/products/${productSlug}`)}`;
      return;
    }
    const payload = await response.json();
    if (!response.ok) {
      setState("error");
      setMessage(payload.error ?? "Unable to add this product.");
      return;
    }
    setState("added");
    setMessage("Added to your cart.");
  }

  return <div className="mt-8 flex flex-wrap items-center gap-3">
    <button className="bg-[#171717] px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white disabled:cursor-wait disabled:opacity-60" disabled={state === "loading"} onClick={addItem} type="button">{state === "loading" ? "Adding…" : "Add to cart"}</button>
    <Link className="border border-[#171717] px-5 py-3 text-sm font-semibold uppercase tracking-wider" href="/cart">View cart</Link>
    {message ? <p className={state === "error" ? "w-full text-sm text-red-700" : "w-full text-sm text-green-700"} role="status">{message}</p> : null}
  </div>;
}
