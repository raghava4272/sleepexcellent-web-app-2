"use client";

import { useEffect, useRef } from "react";

type StitchFrameProps = {
  className?: string;
  hideEmbeddedHeader?: boolean;
  productImages?: Record<string, string>;
  src: string;
  title: string;
};

export function StitchFrame({ className, hideEmbeddedHeader = false, productImages, src, title }: StitchFrameProps) {
  const frame = useRef<HTMLIFrameElement>(null);

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
    const receiveFrameHeight = (event: MessageEvent<{ type?: string; height?: number }>) => {
      if (event.source !== currentFrame?.contentWindow || event.data?.type !== "sleepexcellent-frame-height" || typeof event.data.height !== "number") return;
      resize(event.data.height);
    };
    currentFrame?.addEventListener("load", observeFrameDocument);
    window.addEventListener("resize", resizeOnWindow);
    window.addEventListener("message", receiveFrameHeight);

    return () => {
      settle.forEach(window.clearTimeout);
      resizeObserver?.disconnect();
      currentFrame?.removeEventListener("load", observeFrameDocument);
      window.removeEventListener("resize", resizeOnWindow);
      window.removeEventListener("message", receiveFrameHeight);
    };
  }, [hideEmbeddedHeader, productImages]);

  return <iframe className={`stitch-frame ${className ?? ""}`} ref={frame} scrolling="no" src={src} title={title} />;
}
