"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ProductImage = { alt: string; src: string };
type ProductVideo = { label: string; src: string };
type ProductMedia = (ProductImage & { type: "image" }) | (ProductVideo & { type: "video" });

export function ProductImageGallery({ images, productName, video }: { images: ProductImage[]; productName: string; video?: ProductVideo }) {
  const displayImages = images.length > 0 ? images : [{ alt: productName + " image pending", src: "/product-placeholder.svg" }];
  const media: ProductMedia[] = [
    ...displayImages.map((image) => ({ ...image, type: "image" as const })),
    ...(video ? [{ ...video, type: "video" as const }] : []),
  ];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = media[selectedIndex] ?? media[0];
  const poster = displayImages[0]?.src;
  const selectPrevious = () => setSelectedIndex((current) => (current - 1 + media.length) % media.length);
  const selectNext = () => setSelectedIndex((current) => (current + 1) % media.length);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") setSelectedIndex((current) => (current - 1 + media.length) % media.length);
      if (event.key === "ArrowRight") setSelectedIndex((current) => (current + 1) % media.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [media.length]);

  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:gap-4">
      <div aria-label={productName + " media gallery"} className="max-h-[min(70vh,650px)] space-y-3 overflow-y-auto pr-1">
        {media.map((item, index) => (
          <button aria-label={item.type === "video" ? "Play video of " + productName : "View image " + (index + 1) + " of " + productName} aria-pressed={selectedIndex === index} className={"relative block aspect-square w-full cursor-pointer overflow-hidden rounded-xl border-2 bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] " + (selectedIndex === index ? "border-[#171717]" : "border-[#d6c8b5] hover:border-[#9d6b36]")} key={item.src} onClick={() => setSelectedIndex(index)} type="button">
            {item.type === "video" ? <span className="absolute inset-0 grid place-items-center bg-[#171717] px-1 text-center text-[9px] font-semibold uppercase tracking-wider text-white sm:text-xs">Play video</span> : <Image alt="" className="object-contain p-1" fill loading="lazy" sizes="88px" src={item.src} unoptimized={item.src.startsWith("http")} />}
          </button>
        ))}
      </div>
      <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-2xl border border-[#d6c8b5] bg-white sm:min-h-[480px] lg:min-h-[620px]">
        {selected.type === "video" ? <video aria-label={selected.label} className="h-full max-h-[min(70vh,650px)] w-full bg-black object-contain" controls playsInline poster={poster} preload="metadata"><source src={selected.src} />Your browser does not support this product video.</video> : <Image alt={selected.alt} className="object-contain p-2 sm:p-4" fill loading="eager" sizes="(max-width: 1024px) 80vw, 48vw" src={selected.src} unoptimized={selected.src.startsWith("http")} />}
        {media.length > 1 ? <><button aria-label="Previous product image" className="absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-[#d6c8b5] bg-white/95 text-2xl shadow-md transition hover:bg-[#171717] hover:text-white" onClick={selectPrevious} type="button">‹</button><button aria-label="Next product image" className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-[#d6c8b5] bg-white/95 text-2xl shadow-md transition hover:bg-[#171717] hover:text-white" onClick={selectNext} type="button">›</button><span className="absolute bottom-3 right-3 rounded-full bg-[#171717]/85 px-3 py-1 text-xs font-semibold text-white">{selectedIndex + 1} / {media.length}</span></> : null}
      </div>
    </div>
  );
}
