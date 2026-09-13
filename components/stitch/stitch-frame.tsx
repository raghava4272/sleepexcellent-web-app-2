"use client";

import { useEffect, useRef } from "react";

type StitchFrameProps = {
  className?: string;
  src: string;
  title: string;
};

export function StitchFrame({ className, src, title }: StitchFrameProps) {
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let resizeObserver: ResizeObserver | undefined;

    const resize = () => {
      const documentElement = frame.current?.contentDocument?.documentElement;
      const body = frame.current?.contentDocument?.body;
      if (!documentElement || !body || !frame.current) return;
      const height = Math.max(body.scrollHeight, documentElement.scrollHeight, body.getBoundingClientRect().height);
      frame.current.style.height = `${Math.max(1, Math.ceil(height))}px`;
    };

    const observeFrameDocument = () => {
      resizeObserver?.disconnect();
      const documentElement = frame.current?.contentDocument?.documentElement;
      const body = frame.current?.contentDocument?.body;
      if (!documentElement || !body) return;

      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(documentElement);
      resizeObserver.observe(body);
      resize();
    };

    const settle = [0, 250, 1000].map((delay) => window.setTimeout(observeFrameDocument, delay));
    const currentFrame = frame.current;
    currentFrame?.addEventListener("load", observeFrameDocument);
    window.addEventListener("resize", resize);

    return () => {
      settle.forEach(window.clearTimeout);
      resizeObserver?.disconnect();
      currentFrame?.removeEventListener("load", observeFrameDocument);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <iframe className={`stitch-frame ${className ?? ""}`} ref={frame} scrolling="no" src={src} title={title} />;
}
