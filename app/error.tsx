"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-canvas p-6 text-center text-ink">
      <section className="max-w-lg border border-ink bg-canvas-raised p-8 sm:p-12">
        <p className="eyebrow text-signal">A temporary interruption</p>
        <h1 className="font-display mt-6 text-5xl font-semibold leading-none tracking-[-0.055em]">
          Let&apos;s restore the room.
        </h1>
        <p className="mt-6 text-sm leading-6 text-muted-ink">
          Something did not load as expected. Your information has not been changed.
        </p>
        <Button className="mt-8" onClick={retry} type="button">
          Try again
        </Button>
      </section>
    </main>
  );
}
