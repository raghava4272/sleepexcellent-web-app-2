"use client";

import Image from "next/image";
import { useState } from "react";

type ProductImage = {
  alt: string;
  src: string;
};

export function ProductImageGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const displayImages = images.length > 0 ? images : [{ alt: productName + " image pending", src: "/product-placeholder.svg" }];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = displayImages[selectedIndex] ?? displayImages[0];

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#d6c8b5] bg-white">
        <Image
          alt={selected.alt}
          className={selected.src.startsWith("http") ? "object-cover" : "object-contain p-8"}
          fill
          loading="eager"
          sizes="(max-width: 1024px) 100vw, 52vw"
          src={selected.src}
          unoptimized={selected.src.startsWith("http")}
        />
      </div>
      {displayImages.length > 1 ? (
        <div aria-label={productName + " image gallery"} className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {displayImages.map((image, index) => (
            <button
              aria-label={"View image " + (index + 1) + " of " + productName}
              aria-pressed={selectedIndex === index}
              className={"relative aspect-square cursor-pointer overflow-hidden rounded-xl border-2 bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] " + (selectedIndex === index ? "border-[#171717]" : "border-[#d6c8b5] hover:border-[#9d6b36]")}
              key={image.src}
              onClick={() => setSelectedIndex(index)}
              type="button"
            >
              <Image
                alt=""
                className="object-cover"
                fill
                loading="lazy"
                sizes="(max-width: 640px) 25vw, 10vw"
                src={image.src}
                unoptimized={image.src.startsWith("http")}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
