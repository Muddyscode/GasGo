"use client";

import { useEffect, useRef, useState } from "react";
import { clampPercent, motion } from "@/config/tokens";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Zero-dep critically-damped spring toward a 0–100 percent. */
export function useSpringPercent(
  target: number,
  stiffness = motion.springs.gentle.stiffness,
  damping = motion.springs.gentle.damping,
): number {
  const dest = clampPercent(target);
  const [value, setValue] = useState(dest);
  const valueRef = useRef(dest);
  const velocityRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const targetRef = useRef(dest);

  useEffect(() => {
    targetRef.current = clampPercent(target);

    if (prefersReducedMotion()) {
      valueRef.current = targetRef.current;
      velocityRef.current = 0;
      setValue(targetRef.current);
      return;
    }

    const step = () => {
      const current = valueRef.current;
      const nextTarget = targetRef.current;
      const displacement = nextTarget - current;
      const acceleration =
        displacement * stiffness - velocityRef.current * damping;
      const dt = 1 / 60;
      velocityRef.current += acceleration * dt;
      let next = current + velocityRef.current * dt;

      if (
        Math.abs(displacement) < 0.04 &&
        Math.abs(velocityRef.current) < 0.04
      ) {
        next = nextTarget;
        velocityRef.current = 0;
        valueRef.current = next;
        setValue(next);
        frameRef.current = null;
        return;
      }

      valueRef.current = next;
      setValue(next);
      frameRef.current = requestAnimationFrame(step);
    };

    if (frameRef.current == null) {
      frameRef.current = requestAnimationFrame(step);
    }

    return () => {
      if (frameRef.current != null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [target, stiffness, damping]);

  return value;
}
