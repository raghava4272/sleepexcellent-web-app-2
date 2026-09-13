"use client";

import { useEffect, useRef } from "react";

export default function HomePage() {
  const desktopFrame = useRef<HTMLIFrameElement>(null);
  const mobileFrame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const frames = [desktopFrame.current, mobileFrame.current].filter(
      (frame): frame is HTMLIFrameElement => frame !== null,
    );

    const resizeFrame = (frame: HTMLIFrameElement) => {
      const documentElement = frame.contentDocument?.documentElement;
      const body = frame.contentDocument?.body;
      if (!documentElement || !body) return;
      const height = Math.max(documentElement.scrollHeight, body.scrollHeight, body.getBoundingClientRect().height);
      frame.style.height = `${Math.max(1, Math.ceil(height))}px`;
    };

    const resizeAll = () => frames.forEach(resizeFrame);
    const settle = [0, 250, 1000].map((delay) => window.setTimeout(resizeAll, delay));

    const observers = frames.map((frame) => {
      const body = frame.contentDocument?.body;
      if (!body) return undefined;
      const observer = new ResizeObserver(() => resizeFrame(frame));
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
