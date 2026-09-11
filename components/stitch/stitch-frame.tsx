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
    const resize = () => {
      const documentElement = frame.current?.contentDocument?.documentElement;
      if (!documentElement || !frame.current) return;
      frame.current.style.height = `${Math.ceil(documentElement.scrollHeight)}px`;
    };

    const settle = [0, 250, 1000].map((delay) => window.setTimeout(resize, delay));
    const currentFrame = frame.current;
    currentFrame?.addEventListener("load", resize);
    window.addEventListener("resize", resize);

    return () => {
      settle.forEach(window.clearTimeout);
      currentFrame?.removeEventListener("load", resize);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <iframe className={`stitch-frame ${className ?? ""}`} ref={frame} scrolling="no" src={src} title={title} />;
}
