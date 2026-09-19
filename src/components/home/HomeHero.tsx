"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import {
  GasGauge,
  clampPercent,
  type CalibrateAction,
} from "@/components/gauge";
import { cn } from "@/lib/utils";

const DEMO_PERCENT = 62;
const DEMO_DAYS_SINCE_ORDER = 8;
const DEMO_DAYS_RANGE: [number, number] = [12, 16];
const CALIBRATE_STEP = 8;
const FULL_DAYS_RANGE: [number, number] = [26, 32];
const FULL_CYLINDER_DAYS = 28;

function nudgeDaysRange(
  range: [number, number],
  deltaPercent: number,
): [number, number] {
  const daysDelta = Math.round((deltaPercent / 100) * FULL_CYLINDER_DAYS);
  return [
    Math.max(0, range[0] + daysDelta),
    Math.max(0, range[1] + daysDelta),
  ];
}

type DemoLevel = {
  percent: number;
  daysSinceLastOrder: number;
  estimatedDaysRange: [number, number];
};

const INITIAL_DEMO: DemoLevel = {
  percent: DEMO_PERCENT,
  daysSinceLastOrder: DEMO_DAYS_SINCE_ORDER,
  estimatedDaysRange: DEMO_DAYS_RANGE,
};

export function HomeHero() {
  const [demo, setDemo] = useState<DemoLevel>(INITIAL_DEMO);

  const handleCalibrate = useCallback((action: CalibrateAction) => {
    setDemo((current) => {
      if (action === "refilled") {
        return {
          percent: 100,
          daysSinceLastOrder: 0,
          estimatedDaysRange: FULL_DAYS_RANGE,
        };
      }

      const delta = action === "too_high" ? -CALIBRATE_STEP : CALIBRATE_STEP;
      const next = clampPercent(current.percent + delta);
      return {
        ...current,
        percent: next,
        estimatedDaysRange:
          next === current.percent
            ? current.estimatedDaysRange
            : nudgeDaysRange(current.estimatedDaysRange, next - current.percent),
      };
    });
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-6">
        <GasGauge
          percent={demo.percent}
          size="hero"
          daysSinceLastOrder={demo.daysSinceLastOrder}
          estimatedDaysRange={demo.estimatedDaysRange}
          onCalibrate={handleCalibrate}
        />
      </div>

      <div className="px-5 pb-3">
        <NeverRunOutTease />
      </div>

      <div className="sticky bottom-0 z-20 border-t border-border/80 bg-surface/95 px-5 pt-3 backdrop-blur-md pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Link
          href="/order/cylinder"
          className={cn(
            "flex h-14 w-full items-center justify-center rounded-2xl bg-brand-green text-base font-semibold tracking-tight text-white shadow-gasgo-md",
            "transition-[background-color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2",
          )}
        >
          Refill Now
        </Link>
      </div>
    </div>
  );
}

function NeverRunOutTease() {
  return (
    <section
      aria-labelledby="never-run-out-heading"
      className="relative overflow-hidden rounded-2xl border border-border bg-surface-muted px-4 py-4 shadow-gasgo-soft"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-3 left-0 w-1 rounded-full bg-brand-yellow"
      />
      <div className="flex items-start justify-between gap-3 pl-2">
        <div className="min-w-0">
          <h2
            id="never-run-out-heading"
            className="text-[15px] font-semibold tracking-tight text-ink"
          >
            Never run out
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">
            Auto-refill watches your gauge and delivers before you hit empty.
          </p>
        </div>
        <span className="mt-0.5 shrink-0 rounded-full border border-border bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
          Coming soon
        </span>
      </div>
    </section>
  );
}
