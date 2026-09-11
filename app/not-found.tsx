import Link from "next/link";

import { Container } from "@/components/layout/layout";

export default function NotFound() {
  return (
    <Container className="grid min-h-[70vh] place-items-center py-12 text-center">
      <section className="max-w-lg border border-ink bg-canvas-raised p-8 sm:p-12">
        <p className="eyebrow text-timber">404 / Not found</p>
        <h1 className="font-display mt-6 text-5xl font-semibold leading-none tracking-[-0.055em]">
          This room is not here.
        </h1>
        <p className="mt-6 text-sm leading-6 text-muted-ink">
          The page you asked for is not part of the SleepExcellent showroom.
        </p>
        <Link className="mt-8 inline-flex border border-ink bg-ink px-5 py-3 text-xs font-semibold tracking-[0.08em] text-canvas uppercase hover:bg-timber hover:border-timber" href="/">
          Return home
        </Link>
      </section>
    </Container>
  );
}
