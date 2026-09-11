"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export function Drawer({
  children,
  onClose,
  open,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  open: boolean;
  title: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/40" role="presentation" onMouseDown={onClose}>
      <aside aria-label={title} aria-modal="true" className="h-full w-full max-w-md border-l border-ink bg-canvas p-6 sm:p-8" onMouseDown={(event) => event.stopPropagation()} role="dialog">
        <div className="flex items-start justify-between gap-4 border-b border-line pb-5">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.04em]">{title}</h2>
          <Button aria-label="Close" className="min-h-9 px-3" onClick={onClose} type="button" variant="secondary">
            Close
          </Button>
        </div>
        <div className="py-6">{children}</div>
      </aside>
    </div>
  );
}
