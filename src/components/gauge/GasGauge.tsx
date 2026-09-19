"use client";

import { cn } from "@/lib/utils";
import { ink } from "@/config/tokens";
import { GaugeRing } from "./GaugeRing";
import { useSpringPercent } from "./useSpringPercent";
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
  const animated = useSpringPercent(p);
  const display = Math.round(animated);
  const rounded = Math.round(p);
  const isCaution = level === "caution";

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

  const halo =
    level === "critical"
      ? "shadow-gasgo-gauge-critical"
      : level === "caution"
        ? "shadow-gasgo-gauge-caution"
        : "shadow-gasgo-gauge";

  return (
    <div
      className={cn("flex w-full max-w-md flex-col items-center gap-4", className)}
    >
      <div className="relative flex items-center justify-center">
        <div
          className={cn("rounded-full", halo)}
          style={{ width: px, height: px }}
        >
          <GaugeRing percent={p} size={px} breathe={level === "critical"} />
        </div>

        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
          aria-hidden="true"
        >
          <span
            className={cn(
              "font-bold tabular-nums leading-none tracking-tight",
              isCaution && "gauge-percent-caution",
            )}
            style={{
              color: state.color,
              fontSize: Math.max(32, Math.round(px * 0.28)),
              letterSpacing: "-0.04em",
            }}
          >
            {display}
            <span
              className="ml-[0.06em] text-[0.42em] font-semibold opacity-90"
              aria-hidden="true"
            >
              %
            </span>
          </span>
          {showLabel && (
            <span
              className="mt-1.5 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em]"
              style={{
                color: isCaution ? ink : state.color,
                backgroundColor: `color-mix(in srgb, ${state.color} ${isCaution ? 28 : 16}%, transparent)`,
              }}
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
          className="max-w-[20rem] px-3 text-center text-[13px] leading-relaxed text-ink-muted"
        >
          {confidence}
        </p>
      )}

      {onCalibrate && (
        <div
          className="flex w-full flex-col gap-2 px-0.5"
          role="group"
          aria-label="Calibrate gauge"
        >
          <button
            type="button"
            onClick={() => onCalibrate("refilled")}
            className={cn(
              "inline-flex h-12 w-full min-h-11 items-center justify-center rounded-full px-4",
              "bg-brand-green text-sm font-semibold text-white shadow-gasgo-soft",
              "transition-[transform,filter] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]",
              "hover:brightness-105",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2",
              "active:scale-[0.98]",
            )}
          >
            I just refilled
          </button>
          <div className="grid grid-cols-2 gap-2">
            <CalibrateSecondary
              label="Too high"
              onClick={() => onCalibrate("too_high")}
            />
            <CalibrateSecondary
              label="Too low"
              onClick={() => onCalibrate("too_low")}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function CalibrateSecondary({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-full px-4",
        "border border-[#E6EEE9] bg-white text-sm font-medium text-ink",
        "shadow-gasgo-soft transition-colors",
        "hover:border-brand-green/40 hover:bg-surface-soft",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2",
        "active:scale-[0.98]",
      )}
    >
      {label}
    </button>
  );
}

export default GasGauge;
