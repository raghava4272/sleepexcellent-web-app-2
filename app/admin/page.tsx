import Link from "next/link";
import { redirect } from "next/navigation";
import { OrderStatusControl } from "@/components/admin/order-status-control";
import { getCurrentStaffProfile } from "@/lib/auth/profile";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type OrderRow = { id: string; order_number: string; user_id: string; order_status: string; delivery_status: string; payment_status: string; total_paise: number; estimated_delivery_date: string | null; created_at: string };
type Customer = { id: string; full_name: string | null; email: string; phone: string | null };
const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const label = (value: string) => value.replaceAll("_", " ");

export default async function AdminPage() {
  const staff = await getCurrentStaffProfile();
  if (!staff) redirect("/auth/login?next=/admin");
  const supabase = createSupabaseAdminClient();
  const [{ data: orderData }, { count: customerCount }] = await Promise.all([
    supabase.from("orders").select("id, order_number, user_id, order_status, delivery_status, payment_status, total_paise, estimated_delivery_date, created_at").order("created_at", { ascending: false }).limit(30),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "customer"),
  ]);
  const orders = (orderData ?? []) as OrderRow[];
  const customerIds = [...new Set(orders.map((order) => order.user_id))];
  const { data: customersData } = customerIds.length ? await supabase.from("profiles").select("id, full_name, email, phone").in("id", customerIds) : { data: [] };
  const customers = new Map((customersData ?? []).map((customer) => [customer.id, customer as Customer]));
  const active = orders.filter((order) => !["delivered", "cancelled"].includes(order.order_status));
  const dispatched = orders.filter((order) => order.delivery_status === "dispatched");
  const paid = orders.filter((order) => order.payment_status === "paid" || order.payment_status === "captured");
  const paidRevenue = paid.reduce((sum, order) => sum + order.total_paise, 0);

  return <main className="min-h-screen bg-[#f8f4ec] px-5 py-8 text-[#171717] md:px-10"><header className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 border-b border-[#d6c8b5] pb-6"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9d6b36]">SleepExcellent</p><h1 className="mt-2 font-serif text-4xl">Operations dashboard</h1><p className="mt-2 text-sm text-neutral-600">Orders, delivery updates, customer details, and sales activity.</p></div><div className="text-right"><p className="text-sm text-neutral-600">Signed in as {staff.email}</p><div className="mt-2 flex justify-end gap-4 text-xs font-semibold uppercase tracking-wider"><Link href="/account">Customer view</Link><Link href="/auth/sign-out?next=/auth/login">Sign out</Link></div></div></header><section className="mx-auto grid max-w-7xl gap-4 py-8 sm:grid-cols-2 xl:grid-cols-4">{[["Paid revenue", money.format(paidRevenue / 100)], ["Active orders", String(active.length)], ["Out for delivery", String(dispatched.length)], ["Customer accounts", String(customerCount ?? 0)]].map(([title, value]) => <article className="rounded border border-[#d6c8b5] bg-white p-5" key={title}><p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{title}</p><p className="mt-2 font-serif text-3xl">{value}</p></article>)}</section><section className="mx-auto max-w-7xl overflow-x-auto rounded border border-[#d6c8b5] bg-white"><div className="border-b border-[#d6c8b5] p-5"><h2 className="font-serif text-2xl">Order, customer, and delivery queue</h2><p className="mt-1 text-sm text-neutral-600">Saving an update immediately publishes the latest production and delivery status to the customer’s order tracking page.</p></div>{orders.length === 0 ? <p className="p-8 text-neutral-600">No orders yet. New paid Razorpay orders will appear here.</p> : <table className="w-full min-w-[1080px] text-left text-sm"><thead className="bg-[#eee4d5] text-xs uppercase tracking-wider"><tr><th className="p-4">Order</th><th className="p-4">Customer</th><th className="p-4">Payment</th><th className="p-4">Total</th><th className="p-4">Created</th><th className="p-4">Status & ETA</th></tr></thead><tbody>{orders.map((order) => { const customer = customers.get(order.user_id); return <tr className="border-t border-[#e7dccb] align-top" key={order.id}><td className="p-4 font-semibold">{order.order_number}</td><td className="p-4"><p className="font-medium">{customer?.full_name || "Customer"}</p><p className="mt-1 text-xs text-neutral-600">{customer?.email ?? "—"}</p><p className="text-xs text-neutral-600">{customer?.phone ?? "No phone"}</p></td><td className="p-4 capitalize">{label(order.payment_status)}</td><td className="p-4 font-semibold">{money.format(order.total_paise / 100)}</td><td className="p-4 text-xs text-neutral-600">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td><td className="p-4"><OrderStatusControl initialDeliveryStatus={order.delivery_status} initialEstimatedDate={order.estimated_delivery_date} initialOrderStatus={order.order_status} orderId={order.id} /></td></tr>; })}</tbody></table>}</section></main>;
}
