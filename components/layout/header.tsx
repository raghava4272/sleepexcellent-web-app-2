"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const navigation = [
  { href: "/shop", label: "Mattresses" },
  { href: "/shop?category=sofas", label: "Sofas" },
  { href: "/shop?category=beds", label: "Padding beds" },
];

const interiorGroups = [
  { label: "TV Units", href: "/interiors/tv-units", products: ["Floating Minimalist TV Unit", "Wall Panel TV Unit", "Low-Profile TV Console", "Classic Wooden TV Unit", "Modern Entertainment Wall", "Scandinavian TV Unit", "Compact TV Unit", "Luxury Marble TV Console", "Corner TV Unit", "Industrial TV Unit"] },
  { label: "Kitchens", href: "/interiors/kitchen", products: ["L-Shaped Modular Kitchen", "U-Shaped Modular Kitchen", "Parallel / Galley Kitchen", "Island Kitchen", "Straight Line Kitchen", "G-Shaped Kitchen", "Open Kitchen", "Handleless Kitchen", "Industrial-Style Kitchen", "Luxury Modular Kitchen"] },
  { label: "Ceilings", href: "/interiors/ceilings", products: ["Modern Tray False Ceiling", "Gypsum POP Ceiling", "Wooden Beam Ceiling", "Cove Lighting Ceiling", "Minimalist False Ceiling", "Geometric Pattern Ceiling", "Luxury Layered Ceiling", "PVC Panel Ceiling", "Industrial Exposed Ceiling", "Acoustic Ceiling"] },
];

function MenuIcon({ open }: { open: boolean }) {
  return <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">{open ? <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.5" /> : <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="1.5" />}</svg>;
}

function SearchIcon() {
  return <svg aria-hidden="true" className="h-4 w-4 shrink-0 self-center" viewBox="0 0 24 24"><path d="m20 20-4.5-4.5m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>;
}

function BagIcon() {
  return <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24"><path d="M5 8.5h14l-1 11H6l-1-11ZM9 9V6a3 3 0 0 1 6 0v3" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>;
}

export function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [interiorOpen, setInteriorOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    setMenuOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const closeAllMenus = () => { setMenuOpen(false); setInteriorOpen(false); };

  return (
    <header className="storefront-header sticky top-0 z-[80] border-b border-line bg-white/95 shadow-sm backdrop-blur-md">
      <div className="hidden border-b border-[#2a2826] bg-[#181818] px-4 py-2 text-center text-[0.65rem] font-medium tracking-[0.1em] text-[#fef9f0] sm:block">SLEEP BETTER SALE — UP TO 45% OFF + EXTRA 10% WITH CODE EXCELLENT10</div>
      <div className="site-container flex min-h-16 items-center gap-3 py-2 sm:min-h-20 sm:gap-5">
        <button aria-controls="mobile-navigation" aria-expanded={menuOpen} className="grid h-10 w-10 shrink-0 place-items-center border border-line lg:hidden" onClick={() => setMenuOpen((open) => !open)} type="button"><span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span><MenuIcon open={menuOpen} /></button>
        <Link aria-label="SleepExcellent home" className="storefront-logo shrink-0" href="/">
          <Image alt="SleepExcellent mattresses" className="h-[34px] w-[168px] object-cover object-center sm:h-[42px] sm:w-[205px]" height={42} priority src="/logo.png" width={205} />
          <span className="block text-center text-[8px] font-medium uppercase tracking-[0.26em] text-[#5f5f5f] sm:text-[9px]">Mattresses</span>
        </Link>
        <form className="hidden min-w-0 flex-1 lg:block" onSubmit={submitSearch} role="search">
          <label className="sr-only" htmlFor="storefront-search-desktop">Search the catalogue</label>
          <div className="flex rounded-full border border-[#ded9d2] bg-[#f7f5f1] p-1 shadow-inner focus-within:border-[#181818]"><SearchIcon /><input className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-[#747878]" id="storefront-search-desktop" onChange={(event) => setQuery(event.target.value)} placeholder="Search mattresses and catalogue products" type="search" value={query} /><button className="rounded-full bg-[#181818] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#5f4531]" type="submit">Search</button></div>
        </form>
        <nav aria-label="Store tools" className="ml-auto flex shrink-0 items-center gap-2 text-xs font-semibold sm:gap-3"><Link className="hidden whitespace-nowrap hover:underline sm:inline" href="/account">Track order</Link><Link className="hidden whitespace-nowrap hover:underline md:inline" href="/favorites">Favorites</Link><Link className="hidden whitespace-nowrap hover:underline xl:inline" href="/account">Account</Link><Link aria-label="Shopping bag" className="grid h-10 w-10 place-items-center border border-[#181818]" href="/cart"><BagIcon /></Link></nav>
      </div>
      <form className="border-t border-line px-4 py-2 lg:hidden" onSubmit={submitSearch} role="search"><label className="sr-only" htmlFor="storefront-search-mobile">Search the catalogue</label><div className="flex rounded-full border border-[#ded9d2] bg-[#f7f5f1] p-1 focus-within:border-[#181818]"><SearchIcon /><input className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-[#747878]" id="storefront-search-mobile" onChange={(event) => setQuery(event.target.value)} placeholder="Search the catalogue" type="search" value={query} /><button className="rounded-full bg-[#181818] px-4 py-2 text-xs font-semibold text-white" type="submit">Search</button></div></form>
      <nav aria-label="Primary navigation" className="hidden border-t border-line lg:block"><ul className="site-container flex items-center gap-6 py-3 text-xs font-semibold uppercase tracking-[0.08em]">{navigation.map((item) => <li key={item.href}><Link className="whitespace-nowrap underline-offset-8 hover:underline" href={item.href}>{item.label}</Link></li>)}<li className="relative" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setInteriorOpen(false); }} onMouseEnter={() => setInteriorOpen(true)} onMouseLeave={() => setInteriorOpen(false)}><button aria-expanded={interiorOpen} className="whitespace-nowrap underline-offset-8 hover:underline" onClick={() => setInteriorOpen((open) => !open)} type="button">Interior</button>{interiorOpen ? <div className="absolute left-0 top-8 z-[100] w-[min(900px,calc(100vw-3rem))] rounded-2xl border border-[#ded9d2] bg-white p-5 normal-case tracking-normal shadow-2xl"><div className="grid grid-cols-3 gap-5">{interiorGroups.map((group) => <section key={group.label}><Link className="block border-b border-[#d9d1c7] pb-2 text-sm font-bold text-[#5f4531] hover:underline" href={group.href} onClick={closeAllMenus}>{group.label}</Link><ul className="mt-2 space-y-1.5">{group.products.map((product) => <li key={product}><Link className="block text-xs leading-4 text-[#4f5353] hover:text-black hover:underline" href={group.href} onClick={closeAllMenus}>{product}</Link></li>)}</ul></section>)}</div></div> : null}</li><li className="ml-auto"><Link className="whitespace-nowrap rounded-full border border-[#8a694c] px-3 py-1.5 normal-case tracking-normal hover:bg-[#f7f5f1]" href="/build-your-mattress">Make your own mattress →</Link></li></ul></nav>
      <div aria-hidden={!menuOpen} className={`border-t border-line bg-white lg:hidden ${menuOpen ? "block" : "hidden"}`} id="mobile-navigation"><nav aria-label="Mobile navigation" className="site-container py-3"><ul className="divide-y divide-line border-y border-line">{navigation.map((item) => <li key={item.href}><Link className="flex items-center justify-between py-3 text-sm font-semibold" href={item.href} onClick={closeAllMenus}>{item.label}<span aria-hidden="true">→</span></Link></li>)}<li><button aria-expanded={interiorOpen} className="flex w-full items-center justify-between py-3 text-left text-sm font-semibold" onClick={() => setInteriorOpen((open) => !open)} type="button">Interior <span aria-hidden="true">{interiorOpen ? "−" : "+"}</span></button>{interiorOpen ? <div className="pb-3">{interiorGroups.map((group) => <section className="border-t border-line py-3" key={group.label}><Link className="text-sm font-bold text-[#5f4531]" href={group.href} onClick={closeAllMenus}>{group.label}</Link><ul className="mt-2 grid gap-1">{group.products.map((product) => <li key={product}><Link className="text-xs text-[#4f5353]" href={group.href} onClick={closeAllMenus}>{product}</Link></li>)}</ul></section>)}</div> : null}</li></ul></nav></div>
    </header>
  );
}
