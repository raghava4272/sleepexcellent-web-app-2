import Link from "next/link";

type LoginPageProps = { searchParams: Promise<{ error?: string; message?: string; next?: string }> };

const messages: Record<string, string> = {
  invalid_credentials: "The email address or password is incorrect.",
  not_staff: "This account does not have access to delivery operations.",
  missing_credentials: "Enter both your email address and password.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") && !params.next.startsWith("//") ? params.next : "/account";
  const notice = params.error ? messages[params.error] ?? "Unable to sign in. Please try again." : params.message;

  return (
    <main className="grid min-h-screen place-items-center bg-canvas p-6 text-ink">
      <section className="w-full max-w-md border border-ink bg-canvas-raised p-7 sm:p-10">
        <p className="eyebrow text-timber">SleepExcellent account</p>
        <h1 className="font-display mt-4 text-4xl font-semibold tracking-[-0.045em]">Welcome back.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-ink">Sign in to view orders and manage your account.</p>
        {notice ? <p className="mt-5 border border-line bg-canvas-soft px-4 py-3 text-sm" role="status">{notice}</p> : null}
        <form action="/auth/email-login" className="mt-7 grid gap-5" method="post">
          <input name="next" type="hidden" value={next} />
          <label className="grid gap-2 text-sm font-medium">Email address<input autoComplete="email" className="border border-ink bg-white px-3 py-3 outline-none" name="email" required type="email" /></label>
          <label className="grid gap-2 text-sm font-medium">Password<input autoComplete="current-password" className="border border-ink bg-white px-3 py-3 outline-none" name="password" required type="password" /></label>
          <button className="bg-ink px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white" type="submit">Sign in</button>
        </form>
        <p className="mt-6 text-sm text-muted-ink">New here? <Link className="font-semibold text-ink underline" href={`/auth/register?next=${encodeURIComponent(next)}`}>Create an account</Link></p>
      </section>
    </main>
  );
}
