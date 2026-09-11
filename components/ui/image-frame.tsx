import type { ComponentPropsWithoutRef } from "react";

export function ImageFrame({
  children,
  className = "",
  label,
}: ComponentPropsWithoutRef<"figure"> & { label: string }) {
  return (
    <figure aria-label={label} className={`overflow-hidden border border-ink bg-canvas-raised ${className}`.trim()}>
      {children}
    </figure>
  );
}
