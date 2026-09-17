"use client";

import { useState } from "react";

export type ManagedCategory = { id: string; name: string; slug: string; description: string | null; is_active: boolean; sort_order: number; productCount: number };

export function CategoryManager({ categories }: { categories: ManagedCategory[] }) {
  const [items, setItems] = useState(categories);
  const [saving, setSaving] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  async function save(category: ManagedCategory) {
    setSaving(category.id); setNotice("");
    const response = await fetch(`/api/admin/categories/${category.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: category.name, description: category.description, isActive: category.is_active, sortOrder: Number(category.sort_order) }) });
    setSaving(null);
    if (!response.ok) { setNotice("Could not save this category. Please check the values and try again."); return; }
    setNotice(`${category.name} saved.`);
  }
  const change = (id: string, patch: Partial<ManagedCategory>) => setItems((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));
  return <><p aria-live="polite" className="mb-4 text-sm text-neutral-600">{notice}</p><div className="grid gap-5 lg:grid-cols-3">{items.map((category) => <article className="rounded-2xl border border-[#d6c8b5] bg-white p-5" key={category.id}><div className="flex items-start justify-between gap-3"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#9d6b36]">{category.productCount} products</p><label className="flex items-center gap-2 text-xs font-semibold"><input checked={category.is_active} onChange={(event) => change(category.id, { is_active: event.target.checked })} type="checkbox" /> Live</label></div><label className="mt-4 block text-xs font-semibold uppercase tracking-wider">Name<input className="mt-2 w-full rounded-lg border border-[#d6c8b5] px-3 py-2 text-base normal-case tracking-normal" maxLength={100} onChange={(event) => change(category.id, { name: event.target.value })} value={category.name} /></label><label className="mt-4 block text-xs font-semibold uppercase tracking-wider">Description<textarea className="mt-2 min-h-24 w-full rounded-lg border border-[#d6c8b5] px-3 py-2 text-sm normal-case tracking-normal" maxLength={1000} onChange={(event) => change(category.id, { description: event.target.value })} value={category.description ?? ""} /></label><label className="mt-4 block text-xs font-semibold uppercase tracking-wider">Display order<input className="mt-2 w-24 rounded-lg border border-[#d6c8b5] px-3 py-2 text-sm normal-case tracking-normal" min="0" onChange={(event) => change(category.id, { sort_order: Number(event.target.value) })} type="number" value={category.sort_order} /></label><button className="mt-5 rounded-full bg-[#181818] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" disabled={saving === category.id} onClick={() => save(category)} type="button">{saving === category.id ? "Saving…" : "Save category"}</button></article>)}</div></>;
}
