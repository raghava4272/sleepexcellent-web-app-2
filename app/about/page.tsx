import Image from "next/image";

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
        <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-600">SleepExcellent brings together sleep engineering, thoughtful materials, and made-to-order craftsmanship for Indian homes. Our leadership team keeps every product grounded in comfort, quality, and practical care.</p>
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          {founders.map((founder) => <article className="rounded-2xl border border-[#d6c8b5] bg-white p-4" key={founder.name}><div className="relative aspect-[4/3] overflow-hidden rounded-xl"><Image alt={`${founder.name}, ${founder.role}`} className="object-cover" fill sizes="(max-width: 768px) 100vw, 50vw" src={founder.image} /></div><p className="mt-5 text-xs font-semibold uppercase tracking-[.2em] text-[#9d6b36]">{founder.role}</p><h2 className="mt-2 font-serif text-2xl">{founder.name}</h2></article>)}
        </section>
        <section className="mt-10 rounded-2xl border border-[#d6c8b5] bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#9d6b36]">Our address</p>
          <address className="mt-3 max-w-2xl not-italic leading-7 text-neutral-700">Plot No. 356, Road Number 10A, opposite Srikar Apartments, Gopalnagar Society, Hafeezpet, Hyderabad, Telangana 500085</address>
          <div className="mt-5 flex flex-col gap-2 text-sm font-semibold sm:flex-row sm:flex-wrap sm:gap-x-6">
            <a className="underline underline-offset-4" href="tel:+919849256799">Sanapareddy: +91 98492 56799</a>
            <a className="underline underline-offset-4" href="tel:+919044257999">Obaiah: +91 90442 57999</a>
            <a className="underline underline-offset-4" href="mailto:sleepexcellent999@gmail.com">sleepexcellent999@gmail.com</a>
          </div>
        </section>
      </div>
    </main>
  );
}
