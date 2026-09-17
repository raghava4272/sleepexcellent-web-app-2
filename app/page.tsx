"use client";

import { useCallback, useEffect, useRef } from "react";
import { Header } from "@/components/layout/header";

export default function HomePage() {
  const desktopFrame = useRef<HTMLIFrameElement>(null);
  const mobileFrame = useRef<HTMLIFrameElement>(null);

  const prepareFrame = useCallback((frame: HTMLIFrameElement, reportedHeight?: number) => {
    const frameDocument = frame.contentDocument;
    const documentElement = frameDocument?.documentElement;
    const body = frameDocument?.body;
    if (!documentElement || !body) return;

    body.dataset.outerStorefrontHeader = "true";
    const headerStyleId = "outer-storefront-header-style";
    if (!frameDocument.getElementById(headerStyleId)) {
      const style = frameDocument.createElement("style");
      style.id = headerStyleId;
      style.textContent = "body[data-outer-storefront-header=true] [data-embedded-storefront-header]{display:none!important}";
      frameDocument.head.append(style);
    }

    const bodyTop = body.getBoundingClientRect().top;
    const measuredHeight = Array.from(body.children).reduce((bottom, child) => {
      if (!(child instanceof HTMLElement)) return bottom;
      const style = frame.contentWindow?.getComputedStyle(child);
      if (!style || style.display === "none" || style.visibility === "hidden" || style.position === "fixed" || ["SCRIPT", "STYLE"].includes(child.tagName)) return bottom;
      return Math.max(bottom, child.getBoundingClientRect().bottom - bodyTop);
    }, 0);
    // A page root can be `min-h-screen` while its flow content overflows the
    // iframe's current viewport. Its rectangle is then only the old iframe
    // height (sometimes 1px), while scrollHeight remains the actual document
    // height we need to display.
    const documentHeight = Math.max(
      body.scrollHeight,
      documentElement.scrollHeight,
      body.offsetHeight,
      documentElement.offsetHeight,
    );
    const height = Math.max(measuredHeight, documentHeight, reportedHeight ?? 0, 1);
    frame.style.height = `${Math.ceil(height)}px`;
  }, []);

  useEffect(() => {
    const frames = [desktopFrame.current, mobileFrame.current].filter(
      (frame): frame is HTMLIFrameElement => frame !== null,
    );

    const resizeAll = () => frames.forEach(prepareFrame);
    const settle = [0, 250, 1000, 2000].map((delay) => window.setTimeout(resizeAll, delay));

    const observers: ResizeObserver[] = [];
    const observeFrameDocument = (frame: HTMLIFrameElement) => {
      const body = frame.contentDocument?.body;
      const documentElement = frame.contentDocument?.documentElement;
      if (!body || !documentElement) return;
      const observer = new ResizeObserver(() => prepareFrame(frame));
      observer.observe(body);
      observer.observe(documentElement);
      observers.push(observer);
    };
    const onFrameLoad = (frame: HTMLIFrameElement) => {
      prepareFrame(frame);
      observeFrameDocument(frame);
    };
    const onFrameMessage = (event: MessageEvent) => {
      if (event.data?.type !== "sleepexcellent-frame-height" || typeof event.data.height !== "number") return;
      const frame = frames.find((candidate) => candidate.contentWindow === event.source);
      if (frame) prepareFrame(frame, event.data.height);
    };
    const loadHandlers = new Map<HTMLIFrameElement, () => void>();

    frames.forEach((frame) => {
      const handleLoad = () => onFrameLoad(frame);
      loadHandlers.set(frame, handleLoad);
      frame.addEventListener("load", handleLoad);
      if (frame.contentDocument?.location.href !== "about:blank") onFrameLoad(frame);
    });
    window.addEventListener("resize", resizeAll);
    window.addEventListener("message", onFrameMessage);

    return () => {
      settle.forEach(window.clearTimeout);
      observers.forEach((observer) => observer.disconnect());
      frames.forEach((frame) => {
        const handleLoad = loadHandlers.get(frame);
        if (handleLoad) frame.removeEventListener("load", handleLoad);
      });
      window.removeEventListener("resize", resizeAll);
      window.removeEventListener("message", onFrameMessage);
    };
  }, [prepareFrame]);

  return (
    <main aria-label="SleepExcellent storefront">
      <Header />
      <iframe
        className="stitch-frame stitch-frame--desktop"
        ref={desktopFrame}
        scrolling="no"
        src="/stitch-homepage-desktop.html"
        title="SleepExcellent approved desktop homepage"
        onLoad={(event) => prepareFrame(event.currentTarget)}
      />
      <iframe
        className="stitch-frame stitch-frame--mobile"
        ref={mobileFrame}
        scrolling="no"
        src="/stitch-homepage-mobile.html"
        title="SleepExcellent approved mobile homepage"
        onLoad={(event) => prepareFrame(event.currentTarget)}
      />
    </main>
  );
}
