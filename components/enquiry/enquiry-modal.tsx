"use client";

import { FormEvent, useEffect, useState } from "react";

const DISMISSED_KEY = "sleepexcellent-enquiry-dismissed";

export function EnquiryModal() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => {
    if (sessionStorage.getItem(DISMISSED_KEY)) return;
    const timer = window.setTimeout(() => setOpen(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  const close = () => {
    sessionStorage.setItem(DISMISSED_KEY, "true");
    setOpen(false);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    const form = event.currentTarget;
    const response = await fetch("/api/enquiries", {
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    if (!response.ok) {
      setStatus("error");
      return;
    }
    setStatus("success");
    sessionStorage.setItem(DISMISSED_KEY, "true");
    form.reset();
  };

  if (!open) return null;

  return (
    <div aria-labelledby="enquiry-title" aria-modal="true" className="fixed inset-0 z-[150] grid place-items-center bg-black/55 p-4 backdrop-blur-sm" role="dialog">
      <section className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <button aria-label="Close enquiry form" className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-[#d6c8b5] text-xl" onClick={close} type="button">×</button>
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#9d6b36]">We are here to help</p>
        <h2 className="mt-3 pr-12 font-serif text-3xl" id="enquiry-title">Start an enquiry</h2>
        <p className="mt-3 text-sm leading-6 text-neutral-600">Share your details and our team will contact you about mattresses, sofas, beds, or interiors.</p>
        {status === "success" ? (
          <div className="mt-6 rounded-2xl bg-[#f3ede4] p-5"><p className="font-semibold">Thank you. Your enquiry has been received.</p><button className="mt-4 rounded-full bg-[#171717] px-5 py-3 text-sm font-semibold text-white" onClick={close} type="button">Continue browsing</button></div>
        ) : (
          <form className="mt-6 grid gap-4" onSubmit={submit}>
            <label className="grid gap-1.5 text-sm font-semibold">Name<input autoComplete="name" className="rounded-xl border border-[#cdbfab] px-4 py-3 font-normal outline-none focus:border-[#171717]" maxLength={100} name="name" required /></label>
            <label className="grid gap-1.5 text-sm font-semibold">Pincode<input autoComplete="postal-code" className="rounded-xl border border-[#cdbfab] px-4 py-3 font-normal outline-none focus:border-[#171717]" inputMode="numeric" name="pincode" pattern="[0-9]{6}" placeholder="6-digit pincode" required /></label>
            <label className="grid gap-1.5 text-sm font-semibold">Phone number<input autoComplete="tel" className="rounded-xl border border-[#cdbfab] px-4 py-3 font-normal outline-none focus:border-[#171717]" inputMode="tel" maxLength={15} name="phone" pattern="[0-9+ ]{10,15}" required /></label>
            <label className="grid gap-1.5 text-sm font-semibold">Email address<input autoComplete="email" className="rounded-xl border border-[#cdbfab] px-4 py-3 font-normal outline-none focus:border-[#171717]" name="email" required type="email" /></label>
            <input aria-hidden="true" className="hidden" name="company" tabIndex={-1} />
            {status === "error" ? <p className="text-sm text-red-700" role="alert">We could not submit the enquiry. Please check the details and try again.</p> : null}
            <button className="mt-1 rounded-full bg-[#171717] px-5 py-3.5 text-sm font-semibold text-white disabled:opacity-60" disabled={status === "submitting"} type="submit">{status === "submitting" ? "Sending…" : "Send enquiry"}</button>
          </form>
        )}
      </section>
    </div>
  );
}
