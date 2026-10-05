"use client";

import { FormEvent, useEffect, useState } from "react";
import { customerAuthHeaders } from "@/lib/supabase/client-auth";

export function ProfileForm({ initialName, initialPhone }: { initialName: string; initialPhone: string }) {
  const [status, setStatus] = useState("");
  const [pincode, setPincode] = useState("");
  useEffect(() => {
    void customerAuthHeaders()
      .then((headers) => fetch("/api/profile", { cache: "no-store", credentials: "same-origin", headers }))
      .then((response) => response.json())
      .then((profile) => setPincode(profile.pincode ?? ""))
      .catch(() => undefined);
  }, []);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("Saving…");
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/profile", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json", ...await customerAuthHeaders() }, body: JSON.stringify({ fullName: data.get("fullName"), phone: data.get("phone"), pincode: data.get("pincode") }) });
    const payload = await response.json();
    setStatus(response.ok ? "Saved." : payload.error ?? "Could not save your details.");
  }
  return <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={save}><label className="grid gap-2 text-sm font-medium">Full name<input className="rounded border border-[#b9aa96] bg-[#fffdfa] px-3 py-2" defaultValue={initialName} name="fullName" required /></label><label className="grid gap-2 text-sm font-medium">Phone<input className="rounded border border-[#b9aa96] bg-[#fffdfa] px-3 py-2" defaultValue={initialPhone} name="phone" pattern="[0-9+ ]{10,15}" required type="tel" /></label><label className="grid gap-2 text-sm font-medium">Pincode<input className="rounded border border-[#b9aa96] bg-[#fffdfa] px-3 py-2" inputMode="numeric" maxLength={6} name="pincode" onChange={(event) => setPincode(event.target.value)} pattern="[0-9]{6}" required value={pincode} /></label><div className="flex items-end gap-4"><button className="bg-[#171717] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white" type="submit">Save details</button>{status ? <span className="text-sm text-neutral-600" role="status">{status}</span> : null}</div></form>;
}
