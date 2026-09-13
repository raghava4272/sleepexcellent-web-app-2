import Link from "next/link";

type RegisterPageProps = { searchParams: Promise<{ error?: string; message?: string; next?: string }> };

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") && !params.next.startsWith("//") ? params.next : "/account";
  const notice = params.error ? "Please use a valid email address and a password of at least eight characters." : params.message;

  return (
    <main className="grid min-h-screen place-items-center bg-canvas p-6 text-ink">
      <section className="w-full max-w-md border border-ink bg-canvas-raised p-7 sm:p-10">
        <p className="eyebrow text-timber">SleepExcellent account</p>
        <h1 className="font-display mt-4 text-4xl font-semibold tracking-[-0.045em]">Create your account.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-ink">We will send a verification link from Supabase&apos;s no-reply email address before you can sign in.</p>
        {notice ? <p className="mt-5 border border-line bg-canvas-soft px-4 py-3 text-sm" role="status">{notice}</p> : null}
        <form action="/auth/email-register" className="mt-7 grid gap-5" method="post">
          <input name="next" type="hidden" value={next} />
          <label className="grid gap-2 text-sm font-medium">Email address<input autoComplete="email" className="border border-ink bg-white px-3 py-3 outline-none" name="email" required type="email" /></label>
          <label className="grid gap-2 text-sm font-medium">Password<input autoComplete="new-password" className="border border-ink bg-white px-3 py-3 outline-none" minLength={8} name="password" required type="password" /></label>
          <button className="bg-ink px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white" type="submit">Create account</button>
        </form>
        <p className="mt-6 text-sm text-muted-ink">Already have an account? <Link className="font-semibold text-ink underline" href={`/auth/login?next=${encodeURIComponent(next)}`}>Sign in</Link></p>
      </section>
    </main>
  );
}
