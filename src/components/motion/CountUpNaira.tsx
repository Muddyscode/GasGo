"use client";

import { useEffect, useRef, useState } from "react";
import { formatNaira } from "@/lib/money";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/** Single, restrained idea: totals settle rather than snap. Kept under 300ms. */
const DURATION_MS = 280;

/**
 * Naira amount that counts up/down to its new value whenever it changes.
 * First paint shows the value outright — the animation is for changes only,
 * and it collapses to an instant set under prefers-reduced-motion.
 */
export function CountUpNaira({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const frameRef = useRef(0);

  useEffect(() => {
    if (reduced || fromRef.current === value) {
      fromRef.current = value;
      setDisplay(value);
      return;
    }

    const from = fromRef.current;
    const to = value;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };

    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, reduced]);

  return <span className={cn("tabular-nums", className)}>{formatNaira(display)}</span>;
}
