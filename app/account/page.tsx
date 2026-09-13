import Link from "next/link";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/account/profile-form";
import { getCurrentProfile } from "@/lib/auth/profile";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default async function AccountPage() {
  const current = await getCurrentProfile();
  if (!current) redirect("/auth/login?next=/account");
  const admin = createSupabaseAdminClient();
  const [{ data: profile }, { data: orders }] = await Promise.all([
    admin.from("profiles").select("full_name, phone, email").eq("id", current.id).single(),
    admin.from("orders").select("order_number, payment_status, order_status, delivery_status, total_paise, created_at").eq("user_id", current.id).order("created_at", { ascending: false }),
  ]);
  return <main className="min-h-screen bg-[#f8f4ec] px-5 py-10 text-[#171717] md:px-10"><header className="mx-auto flex max-w-6xl items-end justify-between border-b border-[#d6c8b5] pb-6"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#9d6b36]">SleepExcellent</p><h1 className="mt-2 font-serif text-4xl">My account</h1></div><nav className="flex gap-4 text-sm font-semibold"><Link href="/shop">Shop</Link><Link href="/cart">Cart</Link><Link href="/auth/sign-out?next=/">Sign out</Link></nav></header><section className="mx-auto grid max-w-6xl gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_1.4fr]"><article className="h-fit rounded border border-[#d6c8b5] bg-white p-6"><h2 className="font-serif text-2xl">Personal information</h2><p className="mt-4 text-sm text-neutral-600">Email</p><p className="font-medium">{profile?.email ?? current.email}</p><ProfileForm initialName={profile?.full_name ?? ""} initialPhone={profile?.phone ?? ""} /></article><article className="rounded border border-[#d6c8b5] bg-white"><div className="border-b border-[#d6c8b5] p-6"><h2 className="font-serif text-2xl">Order history</h2><p className="mt-1 text-sm text-neutral-600">Payment, production, and delivery status in one place.</p></div>{!orders?.length ? <p className="p-6 text-neutral-600">You have no orders yet. <Link className="underline" href="/shop">Browse the collection</Link>.</p> : <div className="divide-y divide-[#e7dccb]">{orders.map((order) => <Link className="block p-5 hover:bg-[#fffdfa]" href={`/account/orders/${order.order_number}`} key={order.order_number}><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold">{order.order_number}</p><p className="mt-1 text-sm text-neutral-600">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p></div><p className="font-semibold">{money.format(order.total_paise / 100)}</p></div><div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider"><span className="rounded bg-[#eee4d5] px-2 py-1">Payment: {order.payment_status}</span><span className="rounded bg-[#eee4d5] px-2 py-1">Order: {order.order_status}</span><span className="rounded bg-[#eee4d5] px-2 py-1">Delivery: {order.delivery_status}</span></div></Link>)}</div>}</article></section></main>;
}
