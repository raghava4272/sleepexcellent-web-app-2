"use client";

import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function indianPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return null;
}

export function PhoneOtpForm({ next = "/account", onSubmittingChange }: { next?: string; onSubmittingChange?: (submitting: boolean) => void }) {
  const [phoneInput, setPhoneInput] = useState("");
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const setBusy = (value: boolean) => {
    setSubmitting(value);
    onSubmittingChange?.(value);
  };

  async function sendOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const phone = indianPhone(phoneInput);
    if (!phone) return setMessage("Enter a valid 10-digit Indian mobile number.");
    setBusy(true);
    setMessage(null);
    const { error } = await createSupabaseBrowserClient().auth.signInWithOtp({ phone, options: { shouldCreateUser: false } });
    setBusy(false);
    if (error) {
      setMessage(error.message.toLowerCase().includes("provider") ? "Mobile OTP is not active yet. Please contact SleepExcellent support." : "We could not send the OTP. Check the number and try again.");
      return;
    }
    setVerifiedPhone(phone);
    setMessage(`OTP sent to +91 ${phone.slice(-10, -5)} ${phone.slice(-5)}.`);
  }

  async function verifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!verifiedPhone || !/^\d{6}$/.test(otp)) return setMessage("Enter the 6-digit OTP.");
    setBusy(true);
    setMessage(null);
    const { error } = await createSupabaseBrowserClient().auth.verifyOtp({ phone: verifiedPhone, token: otp, type: "sms" });
    if (error) {
      setBusy(false);
      setMessage("That OTP is incorrect or expired. Please try again.");
      return;
    }
    window.location.assign(next);
  }

  if (verifiedPhone) {
    return (
      <form className="mt-6 grid gap-4" onSubmit={verifyOtp}>
        <label className="grid gap-2 text-sm font-semibold">6-digit OTP<input autoComplete="one-time-code" autoFocus className="h-12 rounded-xl border border-[#cfc7bd] bg-[#fcfbf8] px-4 text-lg tracking-[.35em] outline-none focus:border-[#181818] focus:ring-2 focus:ring-[#d7c4ac]" inputMode="numeric" maxLength={6} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} pattern="[0-9]{6}" required value={otp} /></label>
        {message ? <p aria-live="polite" className="text-sm text-[#5d605e]">{message}</p> : null}
        <button className="h-12 rounded-xl bg-[#181818] px-4 text-sm font-semibold text-white disabled:opacity-60" disabled={submitting} type="submit">{submitting ? "Verifying…" : "Verify OTP"}</button>
        <button className="text-sm font-semibold underline underline-offset-4" onClick={() => { setVerifiedPhone(null); setOtp(""); setMessage(null); }} type="button">Use a different number</button>
      </form>
    );
  }

  return (
    <form className="mt-6 grid gap-4" onSubmit={sendOtp}>
      <label className="grid gap-2 text-sm font-semibold">Mobile number<input autoComplete="tel" autoFocus className="h-12 rounded-xl border border-[#cfc7bd] bg-[#fcfbf8] px-4 outline-none focus:border-[#181818] focus:ring-2 focus:ring-[#d7c4ac]" inputMode="tel" maxLength={14} onChange={(event) => setPhoneInput(event.target.value)} placeholder="10-digit mobile number" required type="tel" value={phoneInput} /></label>
      {message ? <p aria-live="polite" className="rounded-xl border border-[#e1b5ae] bg-[#fff5f2] px-4 py-3 text-sm text-[#9f3023]">{message}</p> : null}
      <button className="h-12 rounded-xl bg-[#181818] px-4 text-sm font-semibold text-white disabled:opacity-60" disabled={submitting} type="submit">{submitting ? "Sending OTP…" : "Send OTP"}</button>
    </form>
  );
}
