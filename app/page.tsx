"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Tile = { title: string; description: string; image: string };

const images = {
  hero: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMoiWICAppfA2MFWvdhlyWKXnogH8sI2y6DAVtq3zQNctm17WHq2G_nvd9PFLDOeo341xatDUcEAiklekANCral9BxpZdZ6f8L1n8aZ690rIkLYpyq3sXe7WWVYc0RlELj4i2_kPB_t8tu6RCg9-TrxAeewhKz7i4-05NDtZqXMbReqwathdHmLkgmPlFywzf8Oge8cNEoE-Gadop4SMPtjI9ByoYDm_RclrEFhWwvEEs4mWSnoTf8bA",
  mattress: "https://lh3.googleusercontent.com/aida-public/AB6AXuCX-8PVL3XC1BXS4Wzu0WoNaAVFS4QJyAV2GkJfOXyaMPVGphOY3BkTa4rs7DHOz4vgtDOBiujEyrV2g3Hv0aoGIzNe7s6RD8zKPA0PupKxT1fEI2H1ZChcE27GGgQI4Etc7-iziDWuj7zSfhOFm3jbz92BIuK5n6SKxAla1QuL4ZOQtvV7nLt_m6mgpkw6PCRgLG4oHaOkIh0xt9jeLZuPrXI0SDIQKdJRhdi_l3QqAf5a0vB5rUQXgw",
  pillow: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIU-LsJqwWlDUniFXJG27Ka3wZdpuHPb1dQDgYoGUvGGNbTfm2TthmJSpZsJntBp1DDxdhKkLQVqHhmQrwf0JWreJxOs1xSMwBTs9wMQm6uAegxyzZjhybfVycIk8tu3AvTEHKlqVqZssoU35oQ_yN7LuHoP1csE3nQmVSf09SJrKjw6OaZPmzvB6pinlvRHVqYCACIN86f9RLxM1AWrDXcP3rVBeXEJ5WVYtoYhlicRioXcfWS-BsPQ",
  latex: "https://lh3.googleusercontent.com/aida-public/AB6AXuCct57uiIB3uwfX0qC7RCyjcw6mxLFWe1WwacXnbb9jl-XUZfz7HylxD0dMR-w4gxri5Yuk7MjDCIA2ZQdXax2KKVtd5F7aEueGbu0mgm4ywh_pcs6zv23tuC5-GZg52C1UC5F2HLu0VOFhLEwkOJ-eVs-t70QGhh90Vb8SIY6mDt2eSa4n0RfRvd0qrE-mPHmes_jtFZMgACCPUFrJXU0i-txfAtwd9HV7YRjj-dUqhGqc-i11nv3bhQ",
  layer: "https://lh3.googleusercontent.com/aida-public/AB6AXuADBnKeUeCnRsvu7ZC4eSWZqZa-duaTgMKeG928qJUTsGBnb9yn0BrIJY5R_dS6utQCWy-PEXqTqa0qCTFw6vuecPdprGPVGHW4WBwGa5ndTFy_r5baY-uyJlkyY7cP_9Ra7iSPGSpplaH89zuXcawXDWT0ZjY7Nh8gc_kkbqw6zpJXANOKhQA95o2xN6AZMEj5euNgoLN9jgmdbdRM8fc1ycCj7u-uuzfQ4zyJO0Wn2Em0-kD9q2vqA",
};

const slides = [
  { eyebrow: "Sleep better, live brighter", title: "Comfort that is made around you.", copy: "Thoughtfully engineered mattresses, built for deeper rest and calmer mornings.", primary: "Shop mattresses", primaryHref: "/shop", secondary: "Customize your mattress", secondaryHref: "/build-your-mattress", image: images.hero, color: "#d8c4a8" },
  { eyebrow: "Personal comfort, simplified", title: "Your sleep. Your build. Your way.", copy: "Choose your support, comfort layers and dimensions. We turn your choices into a mattress that feels like home.", primary: "Build yours now", primaryHref: "/build-your-mattress", secondary: "Explore the collection", secondaryHref: "/shop", image: images.layer, color: "#c8d0bd" },
  { eyebrow: "New season, better sleep", title: "The bedroom is your reset button.", copy: "Find the mattress and sleep essentials that make every wind-down feel intentional.", primary: "See new arrivals", primaryHref: "/shop", secondary: "Find your fit", secondaryHref: "/build-your-mattress", image: images.mattress, color: "#d5c4bb" },
];

const categories: Tile[] = [
  { title: "Mattresses", description: "Support for every kind of sleeper", image: images.mattress },
  { title: "Pillows & cushions", description: "Soft finishing touches", image: images.pillow },
  { title: "Sleep essentials", description: "Every layer of your comfort", image: images.latex },
  { title: "Bedroom furniture", description: "Create a room worth resting in", image: images.hero },
];

const products: Tile[] = [
  { title: "Ortho Plus Mattress", description: "3-Zone orthopedic support · From ₹18,999", image: images.mattress },
  { title: "Natural Latex Mattress", description: "Responsive, breathable comfort · From ₹24,999", image: images.latex },
  { title: "Comfort Pillow Set", description: "A balanced sleep surface · From ₹1,699", image: images.pillow },
];

export default function HomePage() {
  const [active, setActive] = useState(0);
  const slide = slides[active];

  useEffect(() => {
    const timer = window.setInterval(() => setActive((value) => (value + 1) % slides.length), 5200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f4ec] text-[#171717]">
      <div className="bg-[#171717] px-4 py-2 text-center text-xs font-semibold tracking-wide text-[#f8f4ec] sm:text-sm">Free delivery across India · 10-year warranty on selected mattresses</div>
      <header className="border-b border-[#ddd0bd] bg-[#f8f4ec]">
        <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-5 py-4 lg:px-8">
          <Link href="/" className="shrink-0"><img alt="SleepExcellent" className="h-9 w-auto" src="/logo.png" /></Link>
          <form action="/shop" className="hidden flex-1 md:block"><label className="flex items-center gap-3 border border-[#b7a78f] bg-white px-4 py-3 text-sm text-neutral-500"><span aria-hidden="true">⌕</span><input aria-label="Search SleepExcellent" className="w-full bg-transparent outline-none" name="q" placeholder="Search mattresses, pillows and more" /></label></form>
          <nav className="ml-auto flex items-center gap-4 text-sm font-semibold"><Link className="hidden md:block" href="/auth/login">Sign in</Link><Link href="/cart">Bag (0)</Link></nav>
        </div>
        <nav className="mx-auto flex max-w-[1440px] gap-6 overflow-x-auto px-5 pb-4 text-sm font-semibold lg:px-8" aria-label="Shop categories">
          <Link href="/shop">Mattresses</Link><Link href="/shop">Pillows</Link><Link href="/shop">Sleep essentials</Link><Link href="/build-your-mattress" className="text-[#9d6b36]">Customize your mattress</Link><Link href="/shop">Offers</Link>
        </nav>
      </header>

      <section className="mx-auto max-w-[1440px] px-5 pb-8 pt-5 lg:px-8" aria-label="Featured offers">
        <div className="relative grid min-h-[500px] overflow-hidden border border-[#b7a78f] md:grid-cols-[1.05fr_.95fr]">
          <div className="relative z-10 flex flex-col justify-center px-7 py-12 sm:px-12 lg:px-16" style={{ backgroundColor: slide.color }}>
            <p className="eyebrow text-[#72563a]">{slide.eyebrow}</p>
            <h1 className="mt-4 max-w-xl font-display text-5xl font-semibold leading-[.94] tracking-[-.06em] sm:text-6xl">{slide.title}</h1>
            <p className="mt-6 max-w-md text-base leading-7 text-[#3f3a34]">{slide.copy}</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link className="bg-[#171717] px-5 py-3 text-sm font-bold uppercase tracking-wider text-white" href={slide.primaryHref}>{slide.primary}</Link><Link className="border border-[#171717] px-5 py-3 text-sm font-bold uppercase tracking-wider" href={slide.secondaryHref}>{slide.secondary}</Link></div>
          </div>
          <div className="relative min-h-[300px] overflow-hidden bg-[#e9e1d4]"><img alt="SleepExcellent bedroom comfort collection" className="h-full w-full object-cover transition-opacity duration-700" key={slide.image} src={slide.image} /><div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" /></div>
          <button aria-label="Previous slide" className="absolute bottom-5 right-20 z-20 grid h-10 w-10 place-items-center rounded-full bg-white text-lg shadow-sm" onClick={() => setActive((active + slides.length - 1) % slides.length)}>←</button>
          <button aria-label="Next slide" className="absolute bottom-5 right-7 z-20 grid h-10 w-10 place-items-center rounded-full bg-white text-lg shadow-sm" onClick={() => setActive((active + 1) % slides.length)}>→</button>
          <div className="absolute bottom-8 left-7 z-20 flex gap-2 sm:left-12">{slides.map((item, index) => <button aria-label={`Show ${item.title}`} className={`h-2.5 w-2.5 rounded-full ${index === active ? "bg-[#171717]" : "bg-white/80"}`} key={item.title} onClick={() => setActive(index)} />)}</div>
        </div>
        <div className="grid border-x border-b border-[#d8cbb8] bg-white sm:grid-cols-3">
          <Benefit icon="◎" title="100-night trial" copy="Take your time to decide" />
          <Benefit icon="↗" title="Free delivery" copy="To your doorstep, on us" />
          <Benefit icon="✦" title="Made for India" copy="Comfort for every season" />
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-12 lg:px-8">
        <SectionHeading eyebrow="Explore the collection" title="Shop by category" link="View all products" />
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{categories.map((item) => <CategoryCard item={item} key={item.title} />)}</div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-6 lg:px-8">
        <div className="relative overflow-hidden bg-[#29231f] px-7 py-10 text-white sm:px-12 lg:grid lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-12 lg:py-14">
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(90deg,transparent_49%,#f8f4ec_50%,transparent_51%)] [background-size:28px_28px]" />
          <div className="relative"><p className="eyebrow text-[#e2b87c]">A better way to choose</p><h2 className="mt-3 max-w-lg font-display text-4xl font-semibold tracking-[-.05em] sm:text-5xl">Customize your mattress, without the guesswork.</h2><p className="mt-5 max-w-xl leading-7 text-white/75">Start with your sleep style and choose the right comfort layers, size and feel. Your ideal mattress takes only a few steps.</p><Link className="mt-7 inline-block bg-[#f8f4ec] px-5 py-3 text-sm font-bold uppercase tracking-wider text-[#171717]" href="/build-your-mattress">Start customizing</Link></div>
          <div className="relative mt-9 border border-white/30 bg-[#403832] p-6 lg:mt-0"><p className="font-display text-2xl font-semibold">Your comfort checklist</p><ol className="mt-5 grid gap-4 text-sm text-white/85"><li><b className="mr-3 text-[#e2b87c]">01</b>Choose your preferred support</li><li><b className="mr-3 text-[#e2b87c]">02</b>Set the size and mattress height</li><li><b className="mr-3 text-[#e2b87c]">03</b>See a clear price before checkout</li></ol></div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-14 lg:px-8">
        <SectionHeading eyebrow="Most-loved essentials" title="Rest easy favourites" link="Shop all" />
        <div className="mt-7 grid gap-5 md:grid-cols-3">{products.map((item) => <ProductCard item={item} key={item.title} />)}</div>
      </section>

      <section className="border-y border-[#d8cbb8] bg-[#e6d9c8]"><div className="mx-auto grid max-w-[1440px] gap-6 px-5 py-10 sm:grid-cols-2 lg:px-8"><div><p className="eyebrow text-[#8f5d2c]">Sleep, considered</p><h2 className="mt-2 font-display text-4xl font-semibold tracking-[-.05em]">Good rest changes everything.</h2></div><p className="max-w-xl self-end leading-7 text-[#4d453c]">From careful material choices to honest comfort guidance, every SleepExcellent product is designed to make the room you return to feel better.</p></div></section>
      <footer className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 py-8 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between lg:px-8"><span>© 2026 SleepExcellent</span><div className="flex gap-5"><Link href="/shop">Shop</Link><Link href="/build-your-mattress">Customizer</Link><Link href="/auth/login">My account</Link></div></footer>
    </main>
  );
}

function Benefit({ icon, title, copy }: { icon: string; title: string; copy: string }) {
  return <div className="flex items-center gap-3 border-b border-[#d8cbb8] p-5 last:border-b-0 sm:border-b-0 sm:border-r last:sm:border-r-0"><span className="text-2xl">{icon}</span><div><b className="block">{title}</b><span className="text-sm text-neutral-600">{copy}</span></div></div>;
}

function SectionHeading({ eyebrow, title, link }: { eyebrow: string; title: string; link: string }) {
  return <div className="flex items-end justify-between gap-4"><div><p className="eyebrow text-[#9d6b36]">{eyebrow}</p><h2 className="mt-2 font-display text-4xl font-semibold tracking-[-.05em]">{title}</h2></div><Link className="text-sm font-bold underline" href="/shop">{link}</Link></div>;
}

function CategoryCard({ item }: { item: Tile }) {
  return <Link className="group overflow-hidden border border-[#d8cbb8] bg-white" href="/shop"><div className="aspect-[4/3] overflow-hidden bg-[#eee5d8]"><img alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={item.image} /></div><div className="p-5"><h3 className="font-display text-xl font-semibold">{item.title}</h3><p className="mt-1 text-sm text-neutral-600">{item.description}</p><span className="mt-4 inline-block text-sm font-bold underline">Explore</span></div></Link>;
}

function ProductCard({ item }: { item: Tile }) {
  return <Link className="group bg-white" href="/products/ortho-plus-mattress"><div className="aspect-[5/4] overflow-hidden bg-[#ede3d4]"><img alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={item.image} /></div><div className="border border-t-0 border-[#d8cbb8] p-5"><p className="text-xs font-bold uppercase tracking-wider text-[#9d6b36]">SleepExcellent pick</p><h3 className="mt-2 font-display text-2xl font-semibold">{item.title}</h3><p className="mt-1 text-sm text-neutral-600">{item.description}</p></div></Link>;
}
