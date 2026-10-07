"use client";

import { useEffect, useRef, useState } from "react";
import { PasswordField } from "@/components/auth/password-field";
import { PhoneOtpForm } from "@/components/auth/phone-otp-form";

export type AuthMode = "login" | "signup";

type AuthModalProps = {
  error?: string | null;
  message?: string | null;
  mode: AuthMode;
  next: string;
  returnTo: string;
  onClose: () => void;
  onModeChange: (mode: AuthMode) => void;
};

const errorMessages: Record<string, string> = {
  invalid_credentials: "That email address or password is incorrect.",
  invalid_registration: "We could not create that account. Check the details and try again.",
  email_exists: "An account already exists for this email address. Sign in instead.",
  email_rate_limit: "Too many verification emails were requested. Please wait a few minutes and try again.",
  email_delivery_failed: "We could not send the verification email. Please try again shortly.",
  phone_in_use: "That mobile number is already connected to another account.",
  missing_credentials: "Enter both your email address and password.",
};

export function AuthModal({ error, message, mode, next, returnTo, onClose, onModeChange }: AuthModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const isSignup = mode === "signup";

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusTimer = window.setTimeout(() => firstFieldRef.current?.focus(), 0);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), a[href]"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [mode, onClose]);

  const switchMode = () => {
    setSubmitting(false);
    onModeChange(isSignup ? "login" : "signup");
  };

  const submit = () => setSubmitting(true);
  const status = error ? errorMessages[error] ?? "Something went wrong. Please try again." : message;

  return (
    <div className="fixed inset-0 z-[200] grid place-items-center bg-black/35 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div aria-describedby={status ? "auth-modal-status" : undefined} aria-labelledby="auth-modal-title" aria-modal="true" className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl border border-[#ded9d2] bg-white p-6 shadow-2xl sm:p-8" ref={dialogRef} role="dialog">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a694c]">SleepExcellent account</p>
            <h2 className="mt-2 font-serif text-3xl text-[#181818]" id="auth-modal-title">{isSignup ? "Create your account" : "Welcome back"}</h2>
          </div>
          <button aria-label="Close sign in dialog" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#d9d1c7] text-xl transition hover:bg-[#f7f5f1]" onClick={onClose} type="button">×</button>
        </div>
        <p className="mt-3 text-sm leading-6 text-[#5d605e]">{isSignup ? "Share your contact details and create an account. SleepExcellent will email you a verification link." : "Enter your mobile number to receive a secure one-time password."}</p>

        {status ? <p aria-live="polite" className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${error ? "border-[#e1b5ae] bg-[#fff5f2] text-[#9f3023]" : "border-[#bfd6c1] bg-[#f2faf3] text-[#275e34]"}`} id="auth-modal-status">{status}</p> : null}

        {!isSignup ? <>
          <PhoneOtpForm next={next} onSubmittingChange={setSubmitting} />
          <a className="mt-3 block text-center text-sm font-semibold text-[#5f4531] underline underline-offset-4" href={`/auth/login?next=${encodeURIComponent(next)}`}>Sign in with email instead</a>
        </> : <form action="/auth/email-register" className="mt-6 space-y-4" method="post" onSubmit={submit}>
          <input name="next" type="hidden" value={next} />
          <input name="returnTo" type="hidden" value={returnTo} />
          <input name="modal" type="hidden" value="1" />
          <>
            <div><label className="mb-1.5 block text-sm font-semibold" htmlFor="auth-modal-name">Full name</label><input autoComplete="name" className="h-12 w-full rounded-xl border border-[#cfc7bd] bg-[#fcfbf8] px-4 outline-none transition focus:border-[#181818] focus:ring-2 focus:ring-[#d7c4ac]" id="auth-modal-name" maxLength={100} name="fullName" ref={firstFieldRef} required /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="mb-1.5 block text-sm font-semibold" htmlFor="auth-modal-phone">Phone number</label><input autoComplete="tel" className="h-12 w-full rounded-xl border border-[#cfc7bd] bg-[#fcfbf8] px-4 outline-none transition focus:border-[#181818] focus:ring-2 focus:ring-[#d7c4ac]" id="auth-modal-phone" inputMode="tel" maxLength={15} name="phone" pattern="[0-9+ ]{10,15}" required type="tel" /></div>
              <div><label className="mb-1.5 block text-sm font-semibold" htmlFor="auth-modal-pincode">Pincode</label><input autoComplete="postal-code" className="h-12 w-full rounded-xl border border-[#cfc7bd] bg-[#fcfbf8] px-4 outline-none transition focus:border-[#181818] focus:ring-2 focus:ring-[#d7c4ac]" id="auth-modal-pincode" inputMode="numeric" maxLength={6} name="pincode" pattern="[0-9]{6}" required /></div>
            </div>
          </>
          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="auth-modal-email">Email address</label>
            <input autoComplete="email" className="h-12 w-full rounded-xl border border-[#cfc7bd] bg-[#fcfbf8] px-4 outline-none transition focus:border-[#181818] focus:ring-2 focus:ring-[#d7c4ac]" id="auth-modal-email" name="email" required type="email" />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between gap-3"><label className="block text-sm font-semibold" htmlFor="auth-modal-password">Password</label>{isSignup ? <span className="text-xs text-[#6b6f6c]">8+ characters</span> : null}</div>
            <PasswordField autoComplete="new-password" id="auth-modal-password" inputClassName="h-12 w-full rounded-xl border border-[#cfc7bd] bg-[#fcfbf8] px-4 outline-none transition focus:border-[#181818] focus:ring-2 focus:ring-[#d7c4ac]" key={mode} minLength={8} />
          </div>
          <button className="h-12 w-full rounded-xl bg-[#181818] px-4 text-sm font-semibold text-white transition hover:bg-[#5f4531] disabled:cursor-wait disabled:opacity-70" disabled={submitting} type="submit">{submitting ? "Please wait…" : "Create account"}</button>
        </form>}

        <p className="mt-5 text-center text-sm text-[#5d605e]">{isSignup ? "Already have an account?" : "New to SleepExcellent?"} <button className="font-semibold text-[#5f4531] underline underline-offset-4" onClick={switchMode} type="button">{isSignup ? "Sign in" : "Create an account"}</button></p>
      </div>
    </div>
  );
}
