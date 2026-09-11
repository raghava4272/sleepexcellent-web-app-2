"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Container } from "@/components/layout/layout";

const navigation = [
  { href: "/shop/mattresses", label: "Mattresses" },
  { href: "/shop/sofas", label: "Sofas" },
  { href: "/shop/beds", label: "Beds" },
  { href: "/shop/interiors", label: "Interiors" },
  { href: "/build-your-mattress", label: "Build yours" },
];

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      {open ? (
        <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.5" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="1.5" />
      )}
    </svg>
  );
}

function BagIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24">
      <path d="M5 8.5h14l-1 11H6l-1-11ZM9 9V6a3 3 0 0 1 6 0v3" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/95 backdrop-blur-sm">
      <div className="border-b border-line bg-ink py-2 text-center text-[0.65rem] font-medium tracking-[0.12em] text-canvas sm:text-xs">
        CUSTOM COMFORT, DESIGNED AROUND YOU
      </div>
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
        <button
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          className="grid h-10 w-10 place-items-center border border-line lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          <MenuIcon open={menuOpen} />
        </button>

        <Link className="font-display text-xl font-semibold tracking-[-0.08em] sm:text-2xl" href="/">
          SLEEP<span className="text-timber">EXCELLENT</span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden lg:block">
          <ul className="flex items-center gap-6 text-sm">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link className="underline-offset-8 hover:underline" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link className="hidden text-xs tracking-[0.08em] sm:inline hover:underline" href="/account">
            ACCOUNT
          </Link>
          <Link aria-label="Shopping bag" className="grid h-10 w-10 place-items-center border border-ink" href="/cart">
            <BagIcon />
          </Link>
        </div>
      </Container>

      <div
        aria-hidden={!menuOpen}
        className={`border-t border-line bg-canvas lg:hidden ${menuOpen ? "block" : "hidden"}`}
        id="mobile-navigation"
      >
        <Container className="py-4">
          <nav aria-label="Mobile navigation">
            <ul className="divide-y divide-line border-y border-line">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    className="flex items-center justify-between py-4 text-lg"
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                    <span aria-hidden="true">↗</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </div>
    </header>
  );
}
