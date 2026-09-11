import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "inverse" | "ghost";

const variants: Record<Variant, string> = {
  primary: "border border-ink bg-ink text-canvas hover:bg-timber hover:border-timber",
  secondary: "border border-ink bg-transparent text-ink hover:bg-canvas-pressed",
  inverse: "border border-canvas bg-canvas text-ink hover:bg-stone hover:border-stone",
  ghost: "border border-transparent bg-transparent text-ink underline underline-offset-4 hover:text-timber",
};

function classNames(variant: Variant, className = "") {
  return `inline-flex min-h-11 items-center justify-center px-5 text-xs font-semibold tracking-[0.08em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 ${variants[variant]} ${className}`.trim();
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return <button className={classNames(variant, className)} {...props} />;
}

export function LinkButton({
  children,
  className,
  href,
  variant = "primary",
}: {
  children: ReactNode;
  className?: string;
  href: string;
  variant?: Variant;
}) {
  return (
    <Link className={classNames(variant, className)} href={href}>
      {children}
    </Link>
  );
}
