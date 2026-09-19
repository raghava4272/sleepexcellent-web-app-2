import Image from "next/image";
import Link from "next/link";

export type GalleryItem = {
  description?: string | null;
  eyebrow: string;
  href: string;
  imageAlt: string;
  imageSrc?: string | null;
  title: string;
};

export function ImageGallery({ items }: { items: GalleryItem[] }) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="interior-gallery-title" className="py-14">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9d6b36]">Made for Indian homes</p>
        <h2 className="mt-3 font-serif text-3xl md:text-5xl" id="interior-gallery-title">Our latest interior collections</h2>
        <p className="mt-3 max-w-2xl leading-7 text-neutral-600">Explore considered TV units, modular kitchens, and ceiling systems. Product photography will appear here as it is added to the catalogue.</p>
      </div>

      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:flex lg:h-[430px] lg:items-stretch">
        {items.map((item, index) => (
          <Link
            className="group relative min-h-72 overflow-hidden rounded-2xl border border-[#d6c8b5] bg-[#eee7dc] shadow-sm transition-[flex,transform,box-shadow] duration-500 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171717] lg:min-w-0 lg:flex-1 lg:hover:flex-[2.25] lg:focus-visible:flex-[2.25] motion-reduce:transition-none"
            href={item.href}
            key={item.href}
          >
            <Image
              alt={item.imageAlt}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
              src={item.imageSrc || "/product-placeholder.svg"}
              loading={index === 0 ? "eager" : "lazy"}
              unoptimized={Boolean(item.imageSrc?.startsWith("http"))}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">{item.eyebrow}</p>
              <h3 className="mt-1 font-serif text-2xl leading-tight">{item.title}</h3>
              {item.description ? <p className="mt-2 line-clamp-2 max-w-md text-sm leading-5 text-white/80 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100 motion-reduce:transition-none">{item.description}</p> : null}
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">View collection <span aria-hidden="true">↗</span></span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
