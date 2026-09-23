"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AuthModal, AuthMode } from "@/components/auth/auth-modal";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type ProductMenuLink = { label: string; slug: string };
type CatalogueMenuGroup = { label: string; href: string; products?: ProductMenuLink[]; children?: { label: string; href: string; products: ProductMenuLink[] }[] };

const product = (label: string, slug: string): ProductMenuLink => ({ label, slug });

const catalogueMenuGroups: CatalogueMenuGroup[] = [
  { label: "Mattresses", href: "/shop", products: [
    product("Ortho Mattress", "ortho-mattress"), product("Ortho Plus Mattress", "ortho-plus-mattress"), product("Latex Mattress", "latex-mattress"), product("Latex Pro", "latex-pro"), product("Pocketed Spring Mattress", "pocketed-spring-mattress"), product("Bonnell Spring Mattress", "bonnell-spring-mattress"), product("Foam Mattress", "foam-mattress"), product("Memory Foam Mattress", "memory-foam-mattress"),
  ] },
  { label: "Sofas", href: "/shop?category=sofas", products: [
    product("L Shape Sofa", "l-shape-sofa"), product("European Sofa", "european-sofa"), product("Indian Traditional Sofa", "indian-traditional-sofa"), product("Head Rest Model Sofa", "head-rest-model-sofa"), product("Chester Model Sofa", "chester-model-sofa"), product("Fiber Back Sofa", "fiber-back-sofa"), product("Prussian Style Sofa", "prussian-style-sofa"), product("Camel Back Sofa", "camel-back-sofa"), product("Classic Style Sofa", "classic-style-sofa"), product("Sofa with Recliner", "sofa-with-recliner"), product("Cloud Sofa", "cloud-sofa"), product("Premium Sofa", "premium-sofa"), product("Cabin Style Sofa", "cabin-style-sofa"), product("Sectional Sofa", "sectional-sofa"), product("U Shape Sofa", "u-shape-sofa"), product("Corner Sofa", "corner-sofa"),
  ] },
  { label: "Padding beds", href: "/shop?category=padding-beds", products: [
    product("Classic Model Headboard Bed", "classic-model-headboard-bed"), product("Roman Model Bed", "roman-model-bed"), product("Luxury Headboard Bed", "luxury-headboard-bed"), product("Round Shape Bed", "round-shape-bed"), product("Dream Night Bed", "dream-night-bed"), product("Teak Wood Bed", "teak-wood-bed"), product("Polished Bed", "polished-bed"), product("Shadhi Model Bed", "shadhi-model-bed"), product("Kerala Teak Bed", "kerala-teak-bed"), product("Inbuilt Plywood Bed", "inbuilt-plywood-bed"),
  ] },
  { label: "Interior", href: "/interiors", children: [
    { label: "TV Units", href: "/interiors/tv-units", products: [product("Floating Minimalist TV Unit", "floating-minimalist-tv-unit"), product("Wall Panel TV Unit", "wall-panel-tv-unit"), product("Low-Profile TV Console", "low-profile-tv-console"), product("Classic Wooden TV Unit", "classic-wooden-tv-unit"), product("Modern Entertainment Wall", "modern-entertainment-wall"), product("Scandinavian TV Unit", "scandinavian-tv-unit"), product("Compact TV Unit", "compact-tv-unit"), product("Luxury Marble TV Console", "luxury-marble-tv-console"), product("Corner TV Unit", "corner-tv-unit"), product("Industrial TV Unit", "industrial-tv-unit")] },
    { label: "Kitchens", href: "/interiors/kitchen", products: [product("L-Shaped Modular Kitchen", "l-shaped-modular-kitchen"), product("U-Shaped Modular Kitchen", "u-shaped-modular-kitchen"), product("Parallel / Galley Kitchen", "parallel-galley-kitchen"), product("Island Kitchen", "island-kitchen"), product("Straight Line Kitchen", "straight-line-kitchen"), product("G-Shaped Kitchen", "g-shaped-kitchen"), product("Open Kitchen", "open-kitchen"), product("Handleless Kitchen", "handleless-kitchen"), product("Industrial-Style Kitchen", "industrial-style-kitchen"), product("Luxury Modular Kitchen", "luxury-modular-kitchen")] },
    { label: "Ceilings", href: "/interiors/ceilings", products: [product("Modern Tray False Ceiling", "modern-tray-false-ceiling"), product("Gypsum POP Ceiling", "gypsum-pop-ceiling"), product("Wooden Beam Ceiling", "wooden-beam-ceiling"), product("Cove Lighting Ceiling", "cove-lighting-ceiling"), product("Minimalist False Ceiling", "minimalist-false-ceiling"), product("Geometric Pattern Ceiling", "geometric-pattern-ceiling"), product("Luxury Layered Ceiling", "luxury-layered-ceiling"), product("PVC Panel Ceiling", "pvc-panel-ceiling"), product("Industrial Exposed Ceiling", "industrial-exposed-ceiling"), product("Acoustic Ceiling", "acoustic-ceiling")] },
  ] },
  { label: "About us", href: "/about", products: [] },
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
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCatalogueMenu, setActiveCatalogueMenu] = useState<string | null>(null);
  const catalogueCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [query, setQuery] = useState("");
  const authParam = searchParams.get("auth");
  const authMode: AuthMode | null = authParam === "login" || authParam === "signup" ? authParam : null;

  const currentPath = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("auth");
    params.delete("error");
    params.delete("message");
    const queryString = params.toString();
    return `${pathname}${queryString ? `?${queryString}` : ""}`;
  }, [pathname, searchParams]);

  const openAuth = useCallback((mode: AuthMode) => {
    setMenuOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("error");
    params.delete("message");
    params.set("auth", mode);
    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  const closeAuth = useCallback(() => router.replace(currentPath), [currentPath, router]);
  const openAccount = async () => {
    closeAllMenus();
    const { data: { user } } = await createSupabaseBrowserClient().auth.getUser();
    if (user) router.push("/account");
    else openAuth("login");
  };
  const changeAuthMode = useCallback((mode: AuthMode) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("error");
    params.delete("message");
    params.set("auth", mode);
    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") { setMenuOpen(false); setActiveCatalogueMenu(null); } };
    window.addEventListener("keydown", close);
    return () => {
      window.removeEventListener("keydown", close);
      if (catalogueCloseTimer.current) clearTimeout(catalogueCloseTimer.current);
    };
  }, []);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    setMenuOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const cancelCatalogueClose = () => {
    if (catalogueCloseTimer.current) clearTimeout(catalogueCloseTimer.current);
    catalogueCloseTimer.current = null;
  };
  const openCatalogueMenu = (label: string) => {
    cancelCatalogueClose();
    setActiveCatalogueMenu(label);
  };
  const scheduleCatalogueClose = () => {
    cancelCatalogueClose();
    catalogueCloseTimer.current = setTimeout(() => {
      setActiveCatalogueMenu(null);
      catalogueCloseTimer.current = null;
    }, 2000);
  };
  const closeAllMenus = () => { cancelCatalogueClose(); setMenuOpen(false); setActiveCatalogueMenu(null); };

  return (
    <>
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
          <nav aria-label="Store tools" className="ml-auto flex shrink-0 items-center gap-2 text-xs font-semibold sm:gap-3"><Link className="hidden whitespace-nowrap hover:underline sm:inline" href="/account">Track order</Link><Link className="hidden whitespace-nowrap hover:underline md:inline" href="/favorites">Favorites</Link><button className="hidden whitespace-nowrap hover:underline xl:inline" onClick={openAccount} type="button">Account</button><Link aria-label="Shopping bag" className="grid h-10 w-10 place-items-center border border-[#181818]" href="/cart"><BagIcon /></Link></nav>
        </div>
        <form className="border-t border-line px-4 py-2 lg:hidden" onSubmit={submitSearch} role="search"><label className="sr-only" htmlFor="storefront-search-mobile">Search the catalogue</label><div className="flex rounded-full border border-[#ded9d2] bg-[#f7f5f1] p-1 focus-within:border-[#181818]"><SearchIcon /><input className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-[#747878]" id="storefront-search-mobile" onChange={(event) => setQuery(event.target.value)} placeholder="Search the catalogue" type="search" value={query} /><button className="rounded-full bg-[#181818] px-4 py-2 text-xs font-semibold text-white" type="submit">Search</button></div></form>
        <nav aria-label="Primary navigation" className="hidden border-t border-line lg:block"><ul className="site-container flex items-center gap-6 py-3 text-xs font-semibold uppercase tracking-[0.08em]"><li><Link className="whitespace-nowrap underline-offset-8 hover:underline" href="/">Home</Link></li>{catalogueMenuGroups.map((group) => <li className="group relative" key={group.label} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setActiveCatalogueMenu(null); }} onFocus={() => openCatalogueMenu(group.label)} onMouseEnter={() => openCatalogueMenu(group.label)} onMouseMove={() => openCatalogueMenu(group.label)} onMouseLeave={scheduleCatalogueClose}><button aria-expanded={activeCatalogueMenu === group.label} className="whitespace-nowrap underline-offset-8 hover:underline" onClick={() => setActiveCatalogueMenu((open) => open === group.label ? null : group.label)} type="button">{group.label}</button><div className={`absolute left-0 top-full z-[100] pt-2 normal-case tracking-normal ${activeCatalogueMenu === group.label ? "block" : "hidden"} group-hover:block ${group.children ? "w-[min(900px,calc(100vw-3rem))]" : "w-[min(340px,calc(100vw-3rem))]"}`}><div className={`border border-[#ded9d2] bg-white p-5 shadow-2xl ${group.children ? "rounded-2xl" : "rounded-2xl"}`}><div className={group.children ? "grid grid-cols-3 gap-5" : ""}>{group.children ? group.children.map((child) => <section key={child.label}><Link className="block border-b border-[#d9d1c7] pb-2 text-sm font-bold text-[#5f4531] hover:underline" href={child.href} onClick={closeAllMenus}>{child.label}</Link><ul className="mt-2 space-y-0.5">{child.products.map((item) => <li key={item.slug}><Link className="block rounded px-1 py-1 text-xs leading-4 text-[#4f5353] hover:bg-[#f7f5f1] hover:text-black hover:underline" href={`/products/${item.slug}`} onClick={closeAllMenus}>{item.label}</Link></li>)}</ul></section>) : <section><Link className="block border-b border-[#d9d1c7] pb-2 text-sm font-bold text-[#5f4531] hover:underline" href={group.href} onClick={closeAllMenus}>View all {group.label}</Link><ul className="mt-2 space-y-0.5">{group.products?.map((item) => <li key={item.slug}><Link className="block rounded px-1 py-1 text-sm leading-5 text-[#4f5353] hover:bg-[#f7f5f1] hover:text-black hover:underline" href={`/products/${item.slug}`} onClick={closeAllMenus}>{item.label}</Link></li>)}</ul></section>}</div></div></div></li>)}<li className="ml-auto"><Link className="whitespace-nowrap rounded-full border border-[#8a694c] px-3 py-1.5 normal-case tracking-normal hover:bg-[#f7f5f1]" href="/build-your-mattress">Make your own mattress →</Link></li></ul></nav>
        <div aria-hidden={!menuOpen} className={`border-t border-line bg-white lg:hidden ${menuOpen ? "block" : "hidden"}`} id="mobile-navigation"><nav aria-label="Mobile navigation" className="site-container py-3"><ul className="divide-y divide-line border-y border-line"><li><Link className="flex items-center justify-between py-3 text-sm font-semibold" href="/" onClick={closeAllMenus}>Home<span aria-hidden="true">→</span></Link></li>{catalogueMenuGroups.map((group) => <li key={group.label}><button aria-expanded={activeCatalogueMenu === group.label} className="flex w-full items-center justify-between py-3 text-left text-sm font-semibold" onClick={() => setActiveCatalogueMenu((open) => open === group.label ? null : group.label)} type="button">{group.label}<span aria-hidden="true">{activeCatalogueMenu === group.label ? "−" : "+"}</span></button>{activeCatalogueMenu === group.label ? <div className="pb-3">{group.children ? group.children.map((child) => <section className="border-t border-line py-3" key={child.label}><Link className="text-sm font-bold text-[#5f4531]" href={child.href} onClick={closeAllMenus}>{child.label}</Link><ul className="mt-2 grid gap-1">{child.products.map((item) => <li key={item.slug}><Link className="text-xs text-[#4f5353]" href={`/products/${item.slug}`} onClick={closeAllMenus}>{item.label}</Link></li>)}</ul></section>) : <section className="border-t border-line py-3"><Link className="text-sm font-bold text-[#5f4531]" href={group.href} onClick={closeAllMenus}>View all {group.label}</Link><ul className="mt-2 grid gap-1">{group.products?.map((item) => <li key={item.slug}><Link className="text-xs text-[#4f5353]" href={`/products/${item.slug}`} onClick={closeAllMenus}>{item.label}</Link></li>)}</ul></section>}</div> : null}</li>)}<li><button className="flex w-full items-center justify-between py-3 text-left text-sm font-semibold" onClick={openAccount} type="button">Account <span aria-hidden="true">→</span></button></li></ul></nav></div>
      </header>
      {authMode ? <AuthModal error={searchParams.get("error")} message={searchParams.get("message")} mode={authMode} next="/account" returnTo={currentPath} onClose={closeAuth} onModeChange={changeAuthMode} /> : null}
    </>
  );
}
