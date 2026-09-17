"use client";

import { useEffect, useRef } from "react";
import { Header } from "@/components/layout/header";

export default function HomePage() {
  const desktopFrame = useRef<HTMLIFrameElement>(null);
  const mobileFrame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const frames = [desktopFrame.current, mobileFrame.current].filter(
      (frame): frame is HTMLIFrameElement => frame !== null,
    );

    const prepareFrame = (frame: HTMLIFrameElement) => {
      const documentElement = frame.contentDocument?.documentElement;
      const body = frame.contentDocument?.body;
      if (!documentElement || !body) return;
      body.dataset.outerStorefrontHeader = "true";
      const headerStyleId = "outer-storefront-header-style";
      if (!frame.contentDocument?.getElementById(headerStyleId)) {
        const style = frame.contentDocument?.createElement("style");
        if (style) {
          style.id = headerStyleId;
          style.textContent = "body[data-outer-storefront-header=true] [data-embedded-storefront-header]{display:none!important}";
          frame.contentDocument?.head.append(style);
        }
      }
      const bodyTop = body.getBoundingClientRect().top;
      const height = Array.from(body.children).reduce((bottom, child) => Math.max(bottom, child.getBoundingClientRect().bottom - bodyTop), 0);
      frame.style.height = `${Math.max(1, Math.ceil(height))}px`;
    };

    const resizeAll = () => frames.forEach(prepareFrame);
    const settle = [0, 250, 1000].map((delay) => window.setTimeout(resizeAll, delay));

    const observers = frames.map((frame) => {
      const body = frame.contentDocument?.body;
      if (!body) return undefined;
      const observer = new ResizeObserver(() => prepareFrame(frame));
      observer.observe(body);
      return observer;
    });
    frames.forEach((frame) => frame.addEventListener("load", resizeAll));
    window.addEventListener("resize", resizeAll);

    return () => {
      settle.forEach(window.clearTimeout);
      observers.forEach((observer) => observer?.disconnect());
      frames.forEach((frame) => frame.removeEventListener("load", resizeAll));
      window.removeEventListener("resize", resizeAll);
    };
  }, []);

  return (
    <main aria-label="SleepExcellent storefront">
      <Header />
      <iframe
        className="stitch-frame stitch-frame--desktop"
        ref={desktopFrame}
        scrolling="no"
        src="/stitch-homepage-desktop.html"
        title="SleepExcellent approved desktop homepage"
      />
      <iframe
        className="stitch-frame stitch-frame--mobile"
        ref={mobileFrame}
        scrolling="no"
        src="/stitch-homepage-mobile.html"
        title="SleepExcellent approved mobile homepage"
      />
    </main>
  );
}
