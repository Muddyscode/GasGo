"use client";

import { useEffect, useRef, useState } from "react";
import { formatNaira } from "@/lib/money";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/** Count-up / count-down settle. Kept under 300ms. */
export const COUNT_UP_DURATION_MS = 280;

export type CountUpNairaValue = {
  display: number;
  target: number;
  formatted: string;
  formattedTarget: string;
  reduced: boolean;
};

/**
 * Single tween for a Naira amount. First paint is the target; later changes
 * ease to the new value. The last frame is the exact target (no rounded drift).
 * prefers-reduced-motion snaps instantly.
 */
export function useCountUpNaira(target: number): CountUpNairaValue {
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);
  const frameRef = useRef(0);

  useEffect(() => {
    if (reduced || fromRef.current === target) {
      fromRef.current = target;
      setDisplay(target);
      return;
    }

    const from = fromRef.current;
    const to = target;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_UP_DURATION_MS);
      if (t >= 1) {
        fromRef.current = to;
        setDisplay(to);
        return;
      }
      const eased = 1 - (1 - t) ** 3;
      setDisplay(Math.round(from + (to - from) * eased));
      frameRef.current = requestAnimationFrame(tick);
    };

    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, reduced]);

  return {
    display,
    target,
    formatted: formatNaira(display),
    formattedTarget: formatNaira(target),
    reduced,
  };
}
