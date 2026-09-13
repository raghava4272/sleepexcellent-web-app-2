"use client";

import { FormEvent, useState } from "react";

export function ProfileForm({ initialName, initialPhone }: { initialName: string; initialPhone: string }) {
  const [status, setStatus] = useState("");
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("Saving…");
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName: data.get("fullName"), phone: data.get("phone") }) });
    const payload = await response.json();
    setStatus(response.ok ? "Saved." : payload.error ?? "Could not save your details.");
  }
  return <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={save}><label className="grid gap-2 text-sm font-medium">Full name<input className="rounded border border-[#b9aa96] bg-[#fffdfa] px-3 py-2" defaultValue={initialName} name="fullName" /></label><label className="grid gap-2 text-sm font-medium">Phone<input className="rounded border border-[#b9aa96] bg-[#fffdfa] px-3 py-2" defaultValue={initialPhone} name="phone" type="tel" /></label><div className="flex items-center gap-4 sm:col-span-2"><button className="bg-[#171717] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white" type="submit">Save details</button>{status ? <span className="text-sm text-neutral-600" role="status">{status}</span> : null}</div></form>;
}
