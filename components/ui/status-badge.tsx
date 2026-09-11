import type { ReactNode } from "react";

const tones = {
  neutral: "border-line bg-canvas-raised text-muted-ink",
  success: "border-[#b7ceb9] bg-[#e9f2e8] text-[#315c38]",
  signal: "border-[#e7aaa1] bg-[#fff0ed] text-signal",
} as const;

export function StatusBadge({
  children,
  className = "",
  tone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  tone?: keyof typeof tones;
}) {
  return <span className={`inline-flex border px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.1em] uppercase ${tones[tone]} ${className}`}>{children}</span>;
}
