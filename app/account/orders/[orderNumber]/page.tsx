import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/profile";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default async function OrderTrackingPage({ params, searchParams }: { params: Promise<{ orderNumber: string }>; searchParams: Promise<{ payment?: string }> }) {
  const current = await getCurrentProfile();
  const { orderNumber } = await params;
  const query = await searchParams;
  if (!current) redirect(`/auth/login?next=${encodeURIComponent(`/account/orders/${orderNumber}`)}`);
  const admin = createSupabaseAdminClient();
  const { data: order } = await admin.from("orders").select("id, order_number, payment_status, order_status, delivery_status, total_paise, delivery_address, order_items(product_name, quantity, unit_price_paise, line_total_paise, variant_snapshot)").eq("order_number", orderNumber).eq("user_id", current.id).maybeSingle();
  if (!order) notFound();
  const address = order.delivery_address as Record<string, string>;
  const items = (order.order_items ?? []) as Array<{ product_name: string; quantity: number; line_total_paise: number; variant_snapshot: { title?: string } }>;
  return <main className="min-h-screen bg-[#f8f4ec] px-5 py-10 text-[#171717] md:px-10"><header className="mx-auto flex max-w-5xl items-center justify-between border-b border-[#d6c8b5] pb-6"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#9d6b36]">SleepExcellent</p><h1 className="mt-2 font-serif text-4xl">Order {order.order_number}</h1></div><Link className="text-sm font-semibold underline" href="/account">Back to account</Link></header>{query.payment === "verified" ? <p className="mx-auto mt-6 max-w-5xl rounded border border-green-700 bg-green-50 p-4 text-green-800">Payment verified. Your order is confirmed and visible to the delivery team.</p> : null}<section className="mx-auto grid max-w-5xl gap-8 py-8 md:grid-cols-[1.4fr_1fr]"><article className="rounded border border-[#d6c8b5] bg-white"><div className="border-b border-[#d6c8b5] p-6"><h2 className="font-serif text-2xl">Order items</h2></div><div className="divide-y divide-[#e7dccb]">{items.map((item) => <div className="flex justify-between gap-4 p-5" key={`${item.product_name}-${item.quantity}`}><div><p className="font-semibold">{item.product_name}</p><p className="mt-1 text-sm text-neutral-600">{item.variant_snapshot?.title ?? "Base configuration"} · Qty {item.quantity}</p></div><strong>{money.format(item.line_total_paise / 100)}</strong></div>)}</div><div className="flex justify-between border-t border-[#d6c8b5] p-5 text-lg"><strong>Total paid</strong><strong>{money.format(order.total_paise / 100)}</strong></div></article><aside className="space-y-5"><section className="rounded border border-[#d6c8b5] bg-white p-5"><h2 className="font-serif text-2xl">Status</h2><dl className="mt-4 grid gap-3 text-sm"><div><dt className="text-neutral-600">Payment</dt><dd className="font-semibold capitalize">{order.payment_status}</dd></div><div><dt className="text-neutral-600">Order</dt><dd className="font-semibold capitalize">{order.order_status.replace("_", " ")}</dd></div><div><dt className="text-neutral-600">Delivery</dt><dd className="font-semibold capitalize">{order.delivery_status.replace("_", " ")}</dd></div></dl></section><section className="rounded border border-[#d6c8b5] bg-white p-5"><h2 className="font-serif text-2xl">Delivery address</h2><p className="mt-4 text-sm leading-6">{address.recipient_name}<br />{address.line1}<br />{address.city}, {address.state} {address.postal_code}<br />{address.phone}</p></section></aside></section></main>;
}
