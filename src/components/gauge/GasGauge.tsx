"use client";

import { cn } from "@/lib/utils";
import { GaugeRing } from "./GaugeRing";
import {
  clampPercent,
  daysSince,
  formatConfidenceLine,
  getGaugeLevel,
  getGaugeState,
  resolveGaugeSize,
  type GaugeSizeToken,
} from "./utils";

export type CalibrateAction = "refilled" | "too_high" | "too_low";

export type GasGaugeProps = {
  percent: number;
  size?: number | GaugeSizeToken;
  showLabel?: boolean;
  estimatedDaysRange?: [number, number];
  lastUpdated?: Date | string;
  daysSinceLastOrder?: number;
  onCalibrate?: (action: CalibrateAction) => void;
  className?: string;
};

const CALIBRATE_ACTIONS: {
  action: CalibrateAction;
  label: string;
}[] = [
  { action: "refilled", label: "I just refilled" },
  { action: "too_high", label: "Too high" },
  { action: "too_low", label: "Too low" },
];

export function GasGauge({
  percent,
  size = "hero",
  showLabel = true,
  estimatedDaysRange,
  lastUpdated,
  daysSinceLastOrder,
  onCalibrate,
  className,
}: GasGaugeProps) {
  const p = clampPercent(percent);
  const px = resolveGaugeSize(size);
  const level = getGaugeLevel(p);
  const state = getGaugeState(p);
  const rounded = Math.round(p);

  const orderDays =
    typeof daysSinceLastOrder === "number"
      ? Math.max(0, Math.floor(daysSinceLastOrder))
      : lastUpdated != null
        ? daysSince(lastUpdated)
        : undefined;

  const confidence =
    orderDays != null
      ? formatConfidenceLine({
          daysSinceOrder: orderDays,
          estimatedDaysRange,
        })
      : estimatedDaysRange
        ? `Estimated ${estimatedDaysRange[0]}–${estimatedDaysRange[1]} days left`
        : undefined;

  const labelId = "gas-gauge-label";
  const descId = confidence ? "gas-gauge-desc" : undefined;

  return (
    <div
      className={cn(
        "flex w-full max-w-md flex-col items-center gap-5",
        className,
      )}
    >
      <div className="relative flex items-center justify-center">
        <div
          className={cn(
            "rounded-full shadow-gasgo-gauge",
            level === "critical" && "shadow-gasgo-gauge-critical",
          )}
          style={{ width: px, height: px }}
        >
          <GaugeRing percent={p} size={px} breathe={level === "critical"} />
        </div>

        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
          aria-hidden="true"
        >
          <span
            className="font-bold tracking-tight text-ink tabular-nums"
            style={{
              fontSize: Math.max(28, Math.round(px * 0.22)),
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {rounded}%
          </span>
          {showLabel && (
            <span
              className="mt-1 font-medium text-ink-muted"
              style={{ fontSize: Math.max(11, Math.round(px * 0.055)) }}
            >
              {state.label}
            </span>
          )}
        </div>

        <div
          role="meter"
          aria-valuenow={rounded}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`${rounded} percent — ${state.label}`}
          aria-labelledby={labelId}
          aria-describedby={descId}
          className="sr-only"
        >
          Gas level {rounded}%
        </div>
        <span id={labelId} className="sr-only">
          Remaining gas
        </span>
      </div>

      {confidence && (
        <p
          id={descId}
          className="max-w-[20rem] text-center text-sm leading-relaxed text-ink-muted"
        >
          {confidence}
        </p>
      )}

      {onCalibrate && (
        <div
          className="flex w-full flex-wrap items-center justify-center gap-2"
          role="group"
          aria-label="Calibrate gauge"
        >
          {CALIBRATE_ACTIONS.map(({ action, label }) => (
            <button
              key={action}
              type="button"
              onClick={() => onCalibrate(action)}
              className={cn(
                "inline-flex min-h-11 min-w-[44px] items-center justify-center rounded-full px-4",
                "border border-[#E6EEE9] bg-white text-sm font-medium text-ink",
                "shadow-gasgo-soft transition-colors",
                "hover:border-brand-green/40 hover:bg-surface-soft",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2",
                "active:scale-[0.98]",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default GasGauge;
