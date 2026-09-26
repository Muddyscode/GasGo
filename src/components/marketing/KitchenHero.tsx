"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/** Max vertical drift of the hero photo, in px. Kept small — depth, not drama. */
const PARALLAX_MAX_PX = 26;
const PARALLAX_FACTOR = 0.08;

export function KitchenHero({ className }: { className?: string }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const layer = layerRef.current;
    if (reduced || !layer) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const top = layer.getBoundingClientRect().top;
      const shift = Math.max(
        -PARALLAX_MAX_PX,
        Math.min(PARALLAX_MAX_PX, -top * PARALLAX_FACTOR),
      );
      layer.style.setProperty("--hero-shift", `${shift.toFixed(2)}px`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    // The marketing page scrolls inside an inner container, not the window,
    // so capture scroll events at the document level to catch either scroller.
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <figure className={cn("kitchen-hero relative overflow-hidden bg-surface-muted", className)}>
      <div ref={layerRef} className="kitchen-hero-parallax">
        <Image
          src="/brand/kitchen-relief.webp"
          alt="A Port Harcourt kitchen in late afternoon: a woman at the stove, steam rising, and a sealed cylinder by the door."
          width={1280}
          height={720}
          priority
          sizes="(max-width: 767px) 100vw, 58vw"
          className="kitchen-hero-image h-full w-full object-cover"
        />
      </div>
    </figure>
  );
}
