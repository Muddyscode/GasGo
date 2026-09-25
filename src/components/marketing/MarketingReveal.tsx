"use client";

import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "@/config/tokens";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

type MarketingRevealProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  delayMs?: number;
};

export function marketingRevealDelayMs(index: number): number {
  return Math.max(0, index) * motion.reveal.staggerMs;
}

/**
 * Marketing-only scroll reveal. Observes the chrome scroller when present
 * so inner overflow-y pages still trigger.
 *
 * SSR / no-JS: content is visible (no pre-reveal class until JS mounts).
 * Reduced motion: skip hide/transform and just show.
 */
export function MarketingReveal({
  children,
  className,
  delayMs = 0,
  style,
  ...props
}: MarketingRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
    if (reduced) {
      setShown(true);
      return;
    }
    const node = ref.current;
    if (!node) return;

    const root =
      node.closest<HTMLElement>(".gasgo-chrome-scroll") ?? null;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { root, threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [reduced]);

  const preReveal = mounted && !reduced && !shown;

  return (
    <div
      ref={ref}
      className={cn(
        preReveal && "mkt-reveal",
        mounted && shown && "mkt-reveal-in",
        className,
      )}
      style={
        {
          "--mkt-delay": `${delayMs}ms`,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
}
