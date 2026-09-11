export default function HomePage() {
  return (
    <main className="grid min-h-screen place-items-center border-[1px] border-[var(--line)] bg-[var(--canvas)] p-6 text-center">
      <section className="max-w-xl border-[1px] border-[var(--ink)] bg-white p-8 sm:p-12">
        <p className="mb-6 text-xs font-semibold tracking-[0.16em] text-[var(--timber)]">
          SLEEPEXCELLENT
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          A better night is being built.
        </h1>
        <p className="mt-6 text-base leading-7 text-[var(--muted-ink)]">
          The SleepExcellent storefront is in development. The approved design,
          product catalog, custom mattress builder, and delivery dashboard are
          now being prepared for launch.
        </p>
      </section>
    </main>
  );
}
