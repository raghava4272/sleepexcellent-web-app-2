import Link from "next/link";
import { redirect } from "next/navigation";
import { CategoryManager, type ManagedCategory } from "@/components/admin/category-manager";
import { getCurrentStaffProfile } from "@/lib/auth/profile";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const staff = await getCurrentStaffProfile();
  if (!staff) redirect("/auth/login?next=/admin/categories");
  const supabase = createSupabaseAdminClient();
  const { data: interior } = await supabase.from("categories").select("id").eq("slug", "interior").maybeSingle();
  const { data } = interior ? await supabase.from("categories").select("id, name, slug, description, is_active, sort_order, products(count)").eq("parent_id", interior.id).order("sort_order") : { data: [] };
  const categories = (data ?? []).map((category: { id: string; name: string; slug: string; description: string | null; is_active: boolean; sort_order: number; products: { count: number }[] }) => ({ id: category.id, name: category.name, slug: category.slug, description: category.description, is_active: category.is_active, sort_order: category.sort_order, productCount: category.products?.[0]?.count ?? 0 })) as ManagedCategory[];
  return <main className="min-h-screen bg-[#f8f4ec] px-5 py-8 text-[#171717] md:px-10"><header className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 border-b border-[#d6c8b5] pb-6"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9d6b36]">SleepExcellent admin</p><h1 className="mt-2 font-serif text-4xl">Interior catalogue</h1><p className="mt-2 text-sm text-neutral-600">Control the three customer-facing Interior groups. Pricing is maintained separately because every Interior project is quoted after consultation.</p></div><nav className="flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold"><Link href="/admin">Home</Link><Link href="/admin/products">Products</Link><Link href="/admin/categories">Interior</Link><Link href="/interiors">View Interior</Link></nav></header><section className="mx-auto max-w-7xl py-8"><CategoryManager categories={categories} /></section></main>;
}
