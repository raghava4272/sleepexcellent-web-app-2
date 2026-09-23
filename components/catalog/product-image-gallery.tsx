"use client";

import Image from "next/image";
import { useState } from "react";

type ProductImage = {
  alt: string;
  src: string;
};

type ProductVideo = {
  label: string;
  src: string;
};

type ProductMedia =
  | (ProductImage & { type: "image" })
  | (ProductVideo & { type: "video" });

export function ProductImageGallery({ images, productName, video }: { images: ProductImage[]; productName: string; video?: ProductVideo }) {
  const displayImages = images.length > 0 ? images : [{ alt: productName + " image pending", src: "/product-placeholder.svg" }];
  const media: ProductMedia[] = [
    ...displayImages.map((image) => ({ ...image, type: "image" as const })),
    ...(video ? [{ ...video, type: "video" as const }] : []),
  ];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = media[selectedIndex] ?? media[0];
  const poster = displayImages[0]?.src;

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#d6c8b5] bg-white">
        {selected.type === "video" ? (
          <video aria-label={selected.label} className="h-full w-full bg-black object-contain" controls playsInline poster={poster} preload="metadata">
            <source src={selected.src} />
            Your browser does not support this product video.
          </video>
        ) : (
          <Image
            alt={selected.alt}
            className={selected.src.startsWith("http") ? "object-cover" : "object-contain p-8"}
            fill
            loading="eager"
            sizes="(max-width: 1024px) 100vw, 52vw"
            src={selected.src}
            unoptimized={selected.src.startsWith("http")}
          />
        )}
      </div>
      {media.length > 1 ? (
        <div aria-label={productName + " image gallery"} className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {media.map((item, index) => (
            <button
              aria-label={item.type === "video" ? "Play video of " + productName : "View image " + (index + 1) + " of " + productName}
              aria-pressed={selectedIndex === index}
              className={"relative aspect-square cursor-pointer overflow-hidden rounded-xl border-2 bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] " + (selectedIndex === index ? "border-[#171717]" : "border-[#d6c8b5] hover:border-[#9d6b36]")}
              key={item.src}
              onClick={() => setSelectedIndex(index)}
              type="button"
            >
              {item.type === "video" ? (
                <span className="absolute inset-0 grid place-items-center bg-[#171717] text-xs font-semibold uppercase tracking-wider" style={{ color: "#ffffff" }}>Play video</span>
              ) : (
                <Image
                  alt=""
                  className="object-cover"
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 25vw, 10vw"
                  src={item.src}
                  unoptimized={item.src.startsWith("http")}
                />
              )}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
