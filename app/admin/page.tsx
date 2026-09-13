import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentStaffProfile } from "@/lib/auth/profile";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type OrderRow = {
  id: string;
  order_number: string;
  order_status: string;
  delivery_status: string;
  payment_status: string;
  total_paise: number;
  estimated_delivery_date: string | null;
};

function formatRupees(paise: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(paise / 100);
}

export default async function AdminPage() {
  const staff = await getCurrentStaffProfile();
  if (!staff) redirect("/auth/login?next=/admin");

  // This server-only client is used only after the signed-in user's staff role
  // (or the configured initial-admin email) has been verified above.
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("orders")
    .select("id, order_number, order_status, delivery_status, payment_status, total_paise, estimated_delivery_date")
    .order("created_at", { ascending: false })
    .limit(30);
  const orders = (data ?? []) as OrderRow[];
  const active = orders.filter((order) => !["delivered", "cancelled"].includes(order.order_status));
  const dispatch = orders.filter((order) => order.delivery_status === "dispatched");

  return (
    <main className="min-h-screen bg-[#f8f4ec] px-5 py-8 text-[#171717] md:px-10">
      <header className="mx-auto flex max-w-7xl items-end justify-between border-b border-[#d6c8b5] pb-6">
        <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9d6b36]">SleepExcellent</p><h1 className="mt-2 font-serif text-4xl">Delivery operations</h1></div>
        <div className="text-right"><p className="text-sm text-neutral-600">Signed in as {staff.email}</p><Link className="mt-2 inline-block text-xs font-semibold uppercase tracking-wider underline" href="/auth/sign-out?next=/auth/login">Sign out</Link></div>
      </header>
      <section className="mx-auto grid max-w-7xl gap-4 py-8 md:grid-cols-3">
        {[["Active orders", active.length], ["Out for delivery", dispatch.length], ["Orders in queue", orders.length]].map(([label, value]) => <div className="border border-[#d6c8b5] bg-white p-5" key={String(label)}><p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{label}</p><p className="mt-2 font-serif text-4xl">{value}</p></div>)}
      </section>
      <section className="mx-auto max-w-7xl overflow-x-auto border border-[#d6c8b5] bg-white">
        <div className="border-b border-[#d6c8b5] p-5"><h2 className="font-serif text-2xl">Order and delivery queue</h2></div>
        {orders.length === 0 ? <p className="p-8 text-neutral-600">No orders yet. Paid Razorpay orders will appear here for production and delivery handling.</p> : <table className="w-full text-left text-sm"><thead className="bg-[#eee4d5] text-xs uppercase tracking-wider"><tr><th className="p-4">Order</th><th className="p-4">Payment</th><th className="p-4">Fulfillment</th><th className="p-4">Delivery</th><th className="p-4">Total</th><th className="p-4">ETA</th></tr></thead><tbody>{orders.map((order) => <tr className="border-t border-[#e7dccb]" key={order.id}><td className="p-4 font-semibold">{order.order_number}</td><td className="p-4">{order.payment_status}</td><td className="p-4">{order.order_status}</td><td className="p-4">{order.delivery_status}</td><td className="p-4">{formatRupees(order.total_paise)}</td><td className="p-4">{order.estimated_delivery_date ?? "—"}</td></tr>)}</tbody></table>}
      </section>
    </main>
  );
}
