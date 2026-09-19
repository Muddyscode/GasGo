import {
  clampPercent,
  getGaugeColor,
  getGaugeLevel,
  getGaugeState,
  gauge,
  gaugeSizes,
  type GaugeLevel,
  type GaugeSizeToken,
} from "@/config/tokens";

export {
  clampPercent,
  getGaugeColor,
  getGaugeLevel,
  getGaugeState,
  gauge,
  gaugeSizes,
  type GaugeLevel,
  type GaugeSizeToken,
};

export function resolveGaugeSize(
  size: number | GaugeSizeToken | undefined,
): number {
  if (typeof size === "number" && size > 0) return size;
  if (typeof size === "string" && size in gaugeSizes) {
    return gaugeSizes[size as GaugeSizeToken];
  }
  return gaugeSizes.md;
}

export function ringGeometry(size: number, strokeWidth?: number) {
  const stroke = strokeWidth ?? Math.max(8, Math.round(size * 0.07));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  return { stroke, radius, circumference, center };
}

export function strokeOffset(percent: number, circumference: number): number {
  const p = clampPercent(percent);
  return circumference * (1 - p / 100);
}

export function daysSince(date: Date | string): number {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return 0;
  const ms = Date.now() - d.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

export function formatConfidenceLine(opts: {
  daysSinceOrder: number;
  estimatedDaysRange?: [number, number];
}): string {
  const { daysSinceOrder, estimatedDaysRange } = opts;
  const orderPart =
    daysSinceOrder === 0
      ? "Based on your last order today"
      : daysSinceOrder === 1
        ? "Based on your last order 1 day ago"
        : `Based on your last order ${daysSinceOrder} days ago`;

  if (!estimatedDaysRange) return orderPart;

  const [lo, hi] = estimatedDaysRange;
  return `${orderPart} · Estimated ${lo}–${hi} days left`;
}
