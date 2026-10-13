import Link from "next/link";
import { PasswordField } from "@/components/auth/password-field";

type RegisterPageProps = { searchParams: Promise<{ error?: string; message?: string; next?: string }> };

const errorMessages: Record<string, string> = {
  invalid_registration: "Check your contact details, email address, and password, then try again.",
  email_exists: "An account already exists for this email address. Sign in instead.",
  email_rate_limit: "Too many verification emails were requested. Please wait a few minutes and try again.",
  email_delivery_failed: "We could not send the verification email. Please try again shortly.",
  google_unavailable: "Google signup is temporarily unavailable. Please enter your details manually.",
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") && !params.next.startsWith("//") ? params.next : "/";
  const notice = params.error ? errorMessages[params.error] ?? errorMessages.invalid_registration : params.message;

  return (
    <main className="grid min-h-screen place-items-center bg-canvas p-6 text-ink">
      <section className="w-full max-w-md border border-ink bg-canvas-raised p-7 sm:p-10">
        <p className="eyebrow text-timber">SleepExcellent account</p>
        <h1 className="font-display mt-4 text-4xl font-semibold tracking-[-0.045em]">Create your account.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-ink">Sign up with Google, or enter your contact details manually with email and password.</p>
        {notice ? <p className="mt-5 border border-line bg-canvas-soft px-4 py-3 text-sm" role="status">{notice}</p> : null}
        <a className="mt-7 flex items-center justify-center gap-3 border border-ink bg-white px-5 py-3 text-sm font-semibold" href={`/auth/sign-in?next=${encodeURIComponent(next)}`}><span aria-hidden="true" className="font-bold text-[#4285f4]">G</span>Sign up with Google</a>
        <p className="mt-3 text-xs leading-5 text-muted-ink">After Google signup, add your phone number and pincode in Account information.</p>
        <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-muted-ink"><span className="h-px flex-1 bg-line" /><span>or enter details manually</span><span className="h-px flex-1 bg-line" /></div>
        <form action="/auth/email-register" className="grid gap-5" method="post">
          <input name="next" type="hidden" value={next} />
          <label className="grid gap-2 text-sm font-medium">Full name<input autoComplete="name" className="border border-ink bg-white px-3 py-3 outline-none" maxLength={100} name="fullName" required /></label>
          <div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium">Phone number<input autoComplete="tel" className="border border-ink bg-white px-3 py-3 outline-none" inputMode="tel" maxLength={15} name="phone" pattern="[0-9+ ]{10,15}" required type="tel" /></label><label className="grid gap-2 text-sm font-medium">Pincode<input autoComplete="postal-code" className="border border-ink bg-white px-3 py-3 outline-none" inputMode="numeric" maxLength={6} name="pincode" pattern="[0-9]{6}" required /></label></div>
          <label className="grid gap-2 text-sm font-medium">Email address<input autoComplete="email" className="border border-ink bg-white px-3 py-3 outline-none" name="email" required type="email" /></label>
          <label className="grid gap-2 text-sm font-medium">Password<PasswordField autoComplete="new-password" inputClassName="w-full border border-ink bg-white px-3 py-3 outline-none" minLength={8} /></label>
          <button className="bg-ink px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white" type="submit">Create account</button>
        </form>
        <p className="mt-6 text-sm text-muted-ink">Already have an account? <Link className="font-semibold text-ink underline" href={`/auth/login?next=${encodeURIComponent(next)}`}>Sign in</Link></p>
      </section>
    </main>
  );
}
