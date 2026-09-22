"use client";

import { useEffect, useState } from "react";
import {
  GREETING_CYCLE_MS,
  GREETING_FADE_MS,
  MARKETING_GREETING_SR,
  MARKETING_GREETINGS,
} from "@/lib/marketing-greetings";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

export function CyclingGreeting() {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (reduced || MARKETING_GREETINGS.length < 2) return;
    let fade = 0;
    const id = window.setInterval(() => {
      setVisible(false);
      fade = window.setTimeout(() => {
        setIndex((current) => (current + 1) % MARKETING_GREETINGS.length);
        setVisible(true);
      }, GREETING_FADE_MS);
    }, GREETING_CYCLE_MS);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(fade);
    };
  }, [reduced]);

  const current = MARKETING_GREETINGS[index] ?? MARKETING_GREETINGS[0];

  return (
    <div className="mx-auto max-w-4xl text-center">
      <h1>
        <span className="sr-only">{MARKETING_GREETING_SR}</span>
        <span aria-hidden="true" className="block">
          <span className="block text-[12px] font-semibold uppercase tracking-[0.22em] text-brand-green md:text-[13px]">
            {current.lang}
          </span>
          <span
            className={cn(
              "mt-2 block font-display text-[2.05rem] font-extrabold leading-[1.06] tracking-[-0.035em] text-ink",
              "sm:mt-3 sm:text-5xl md:text-[3.15rem] lg:text-[3.35rem]",
              "transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              visible ? "opacity-100" : "opacity-0",
            )}
          >
            {current.text}
          </span>
        </span>
      </h1>
    </div>
  );
}
