import Image from "next/image";
import Link from "next/link";

const founders = [
  { name: "Pratap Reddy Snapareddy", role: "CEO", image: "/ceo-pratap_reddy_snapareddy.jpg" },
  { name: "Merva Obaiah", role: "Managing Director", image: "/managing_director_merva_obaiah.jpg" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f8f4ec] px-5 py-12 text-[#171717] md:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#9d6b36]">About us</p>
        <h1 className="mt-3 font-serif text-4xl md:text-6xl">Minds Behind Sleep Excellent</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-600">SleepExcellent brings together sleep engineering, considered materials, and made-to-order craftsmanship for Indian homes.</p>
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          {founders.map((founder) => <article className="rounded-2xl border border-[#d6c8b5] bg-white p-4" key={founder.name}><div className="relative aspect-[4/3] overflow-hidden rounded-xl"><Image alt={`${founder.name}, ${founder.role}`} className="object-cover" fill sizes="(max-width: 768px) 100vw, 50vw" src={founder.image} /></div><p className="mt-5 text-xs font-semibold uppercase tracking-[.2em] text-[#9d6b36]">{founder.role}</p><h2 className="mt-2 font-serif text-2xl">{founder.name}</h2></article>)}
        </section>
        <Link className="mt-8 inline-block rounded-full bg-[#171717] px-6 py-3 text-sm font-semibold text-white" href="/">Return home</Link>
      </div>
    </main>
  );
}
