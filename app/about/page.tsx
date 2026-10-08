import Image from "next/image";

const founders = [
  {
    name: "MERVA OBAIAH YADAV",
    role: "CEO",
    image: "/merva-obaiah-yadav.png",
    description:
      "Merva Obaiah Yadav guides our customer experience, market growth, and brand direction, bringing practical sleep and interior solutions to homes with attentive service and a clear focus on value.",
  },
  {
    name: "SANAPAREDDY PRATHAPH REDDY",
    role: "Managing Director",
    image: "/pratap-reddy-snapareddy.png",
    description:
      "Sanapareddy Prathaph Reddy leads our manufacturing strategy, product development, and operations, keeping every Sleep Excellent product focused on dependable quality, lasting comfort, and thoughtful craftsmanship.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f8f4ec] px-5 py-12 text-[#171717] md:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#9d6b36]">About us</p>
        <h1 className="mt-3 font-serif text-3xl leading-tight md:text-6xl">Minds Behind Sleep Excellent</h1>
        <p className="mt-4 max-w-4xl text-base leading-7 text-neutral-600 md:mt-5 md:text-lg md:leading-8">Sleep Excellent is a brand of Excellent India Furniture Manufacturers Pvt. Ltd., a rapidly growing Indian furniture and sleep-solutions company. Our leadership brings together sleep engineering, thoughtful materials, and made-to-order craftsmanship for homes across India.</p>
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-[#d6c8b5] bg-white p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#9d6b36]">Vision of the brand</p>
            <p className="mt-4 leading-7 text-neutral-700">To become a trusted and leading brand in sleep comfort and home interiors by transforming everyday living spaces into environments of luxury, relaxation, and elegance. At Sleep Excellent, we envision a future where every home experiences exceptional comfort, innovative design, and quality living at an affordable price.</p>
          </article>
          <article className="rounded-2xl border border-[#d6c8b5] bg-white p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#9d6b36]">Mission of the brand</p>
            <p className="mt-4 leading-7 text-neutral-700">At Sleep Excellent, our mission is to enhance the quality of everyday living by delivering premium mattresses, stylish beds, comfortable sofas, and innovative interior solutions. We are committed to combining superior craftsmanship, modern technology, elegant designs, and customer-focused service to create products that offer lasting comfort, durability, and value.</p>
            <p className="mt-4 leading-7 text-neutral-700">We strive to make every customer&apos;s home a perfect reflection of comfort, style, and well-being.</p>
          </article>
        </section>
        <section className="mt-10 space-y-6">
          {founders.map((founder) => (
            <article
              className="grid overflow-hidden rounded-2xl border border-[#d6c8b5] bg-white md:grid-cols-[minmax(260px,380px)_1fr]"
              key={founder.name}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#eee7dc]">
                <Image
                  alt={`${founder.name}, ${founder.role}`}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  src={founder.image}
                />
              </div>
              <div className="flex flex-col justify-center p-6 md:p-10 lg:p-12">
                <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#9d6b36]">{founder.role}</p>
                <h2 className="mt-3 font-serif text-3xl md:text-4xl">{founder.name}</h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600 md:text-lg md:leading-8">
                  {founder.description}
                </p>
              </div>
            </article>
          ))}
        </section>
        <section className="mt-10 rounded-2xl border border-[#d6c8b5] bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#9d6b36]">Our address</p>
          <address className="mt-3 max-w-2xl not-italic leading-7 text-neutral-700">Plot No. 356, Road Number 10A, opposite Kidlink School, Gopalnagar Society, Hafeezpet, Hyderabad, Telangana 500085</address>
          <p className="mt-3 font-bold leading-6">EXCELLENT INDIA FURNITURE<br />MANUFACTURERS PRIVATE LIMITED</p>
          <div className="mt-5 flex flex-col gap-2 text-sm font-semibold sm:flex-row sm:flex-wrap sm:gap-x-6">
            <a className="underline underline-offset-4" href="tel:+919044257999">Helpline: +91 90442 57999</a>
            <a className="underline underline-offset-4" href="mailto:sleepexcellent999@gmail.com">sleepexcellent999@gmail.com</a>
            <span>ISO 9001:2015</span>
          </div>
        </section>
      </div>
    </main>
  );
}
