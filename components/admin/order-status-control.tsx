"use client";

import { useState } from "react";
import { customerAuthHeaders } from "@/lib/supabase/client-auth";

const orderStatuses = ["pending_payment", "confirmed", "in_production", "dispatched", "delivered", "cancelled"];
const deliveryStatuses = ["not_ready", "scheduled", "dispatched", "delivered", "failed"];

export function OrderStatusControl({ orderId, initialOrderStatus, initialDeliveryStatus, initialEstimatedDate }: { orderId: string; initialOrderStatus: string; initialDeliveryStatus: string; initialEstimatedDate: string | null }) {
  const [orderStatus, setOrderStatus] = useState(initialOrderStatus);
  const [deliveryStatus, setDeliveryStatus] = useState(initialDeliveryStatus);
  const [estimatedDate, setEstimatedDate] = useState(initialEstimatedDate ?? "");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  async function save() {
    setState("saving");
    const response = await fetch(`/api/admin/orders/${orderId}`, { method: "PATCH", headers: { "Content-Type": "application/json", ...(await customerAuthHeaders()) }, body: JSON.stringify({ orderStatus, deliveryStatus, estimatedDeliveryDate: estimatedDate || null }) });
    setState(response.ok ? "saved" : "error");
  }
  return <div className="grid min-w-[250px] gap-2"><select aria-label="Order status" className="rounded border border-[#d6c8b5] bg-white px-2 py-1.5 text-xs" onChange={(event) => setOrderStatus(event.target.value)} value={orderStatus}>{orderStatuses.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}</select><select aria-label="Delivery status" className="rounded border border-[#d6c8b5] bg-white px-2 py-1.5 text-xs" onChange={(event) => setDeliveryStatus(event.target.value)} value={deliveryStatus}>{deliveryStatuses.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}</select><input aria-label="Estimated delivery date" className="rounded border border-[#d6c8b5] bg-white px-2 py-1.5 text-xs" onChange={(event) => setEstimatedDate(event.target.value)} type="date" value={estimatedDate} /><button className="rounded bg-[#171717] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white disabled:opacity-60" disabled={state === "saving"} onClick={save} type="button">{state === "saving" ? "Saving…" : "Save update"}</button>{state === "saved" ? <p className="text-xs text-green-700">Customer tracking updated.</p> : null}{state === "error" ? <p className="text-xs text-red-700">Could not save. Please retry.</p> : null}</div>;
}
