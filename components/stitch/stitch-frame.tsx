"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { customerAuthHeaders } from "@/lib/supabase/client-auth";

type StitchFrameProps = {
  className?: string;
  hideEmbeddedHeader?: boolean;
  productImages?: Record<string, string>;
  src: string;
  title: string;
};

export function StitchFrame({ className, hideEmbeddedHeader = false, productImages, src, title }: StitchFrameProps) {
  const frame = useRef<HTMLIFrameElement>(null);
  const router = useRouter();

  useEffect(() => {
    let resizeObserver: ResizeObserver | undefined;

    const resize = (reportedHeight?: number) => {
      const documentElement = frame.current?.contentDocument?.documentElement;
      const body = frame.current?.contentDocument?.body;
      if (!documentElement || !body || !frame.current) return;
      if (hideEmbeddedHeader) {
        body.dataset.outerStorefrontHeader = "true";
        const headerStyleId = "outer-storefront-header-style";
        if (!frame.current.contentDocument?.getElementById(headerStyleId)) {
          const style = frame.current.contentDocument?.createElement("style");
          if (style) {
            style.id = headerStyleId;
            style.textContent = "body[data-outer-storefront-header=true] [data-embedded-storefront-header]{display:none!important}";
            frame.current.contentDocument?.head.append(style);
          }
        }
      }
      // scrollHeight and the body's rendered height include the iframe viewport.
      // Once a tall frame was assigned, using either value prevented it from ever
      // shrinking below that old viewport height. Measure the bottom of the
      // actual document children instead, so a short catalog/detail page ends
      // directly after its footer.
      const contentBottom = Array.from(body.children).reduce((bottom, child) => {
        const childBottom = child.getBoundingClientRect().bottom - body.getBoundingClientRect().top;
        return Math.max(bottom, childBottom);
      }, 0);
      // A hidden script at the end of an embedded document can report zero.
      // Never let that message collapse otherwise visible catalogue content.
      const height = Math.max(contentBottom, reportedHeight ?? 0, 1);
      frame.current.style.height = `${Math.max(1, Math.ceil(height))}px`;
    };

    const sendProductImages = () => {
      if (!productImages || !currentFrame?.contentWindow) return;
      currentFrame.contentWindow.postMessage({ type: "sleepexcellent-product-images", images: productImages }, window.location.origin);
    };

    const observeFrameDocument = () => {
      resizeObserver?.disconnect();
      const documentElement = frame.current?.contentDocument?.documentElement;
      const body = frame.current?.contentDocument?.body;
      if (!documentElement || !body) return;

      resizeObserver = new ResizeObserver(() => resize());
      resizeObserver.observe(documentElement);
      resizeObserver.observe(body);
      resize();
      sendProductImages();
    };

    const settle = [0, 250, 1000].map((delay) => window.setTimeout(observeFrameDocument, delay));
    const currentFrame = frame.current;
    const resizeOnWindow = () => resize();
    const receiveFrameMessage = async (event: MessageEvent<{ type?: string; height?: number; productSlug?: string }>) => {
      if (event.source !== currentFrame?.contentWindow) return;
      if (event.data?.type === "sleepexcellent-frame-height" && typeof event.data.height === "number") {
        resize(event.data.height);
        return;
      }
      if (event.data?.type !== "sleepexcellent-add-to-cart" || typeof event.data.productSlug !== "string") return;
      const productSlug = event.data.productSlug;
      const response = await fetch("/api/cart", {
        body: JSON.stringify({ productSlug, quantity: 1 }),
        credentials: "same-origin",
        headers: { "Content-Type": "application/json", ...await customerAuthHeaders() },
        method: "POST",
      });
      if (response.status === 401) {
        router.push(`/auth/login?next=${encodeURIComponent("/shop")}`);
        return;
      }
      const payload = await response.json();
      currentFrame?.contentWindow?.postMessage({ type: "sleepexcellent-cart-result", productSlug, ok: response.ok, message: response.ok ? "Added to cart" : payload.error ?? "Unable to add item" }, window.location.origin);
      if (response.ok) {
        const count = Array.isArray(payload.lines) ? payload.lines.reduce((total: number, line: { quantity?: number }) => total + (line.quantity ?? 0), 0) : 0;
        window.dispatchEvent(new CustomEvent("sleepexcellent-cart-updated", { detail: { count } }));
      }
    };
    currentFrame?.addEventListener("load", observeFrameDocument);
    window.addEventListener("resize", resizeOnWindow);
    window.addEventListener("message", receiveFrameMessage);

    return () => {
      settle.forEach(window.clearTimeout);
      resizeObserver?.disconnect();
      currentFrame?.removeEventListener("load", observeFrameDocument);
      window.removeEventListener("resize", resizeOnWindow);
      window.removeEventListener("message", receiveFrameMessage);
    };
  }, [hideEmbeddedHeader, productImages, router]);

  return <iframe className={`stitch-frame ${className ?? ""}`} ref={frame} scrolling="no" src={src} title={title} />;
}
