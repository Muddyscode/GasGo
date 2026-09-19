/**
 * GasGo design tokens — locked contract (Architect / Zaha).
 */

export const brand = {
  green: "#1CA350",
  yellow: "#FFDF22",
  red: "#DC2626",
  white: "#FFFFFF",
} as const;

export const ink = "#0B1F14";
export const inkMuted = "#4B6356";
export const border = "#E6EEE9";
export const surface = {
  DEFAULT: "#FFFFFF",
  muted: "#F7FAF8",
  soft: "#F0F7F3",
} as const;

export const gauge = {
  track: "#E8F5EE",
  warn: "#F59E0B",
  heroSize: 240,
  lowBelow: 20,
  warnBelow: 40,
  safe: brand.green,
  caution: brand.yellow,
  critical: brand.red,
} as const;

export type GaugeLevel = "safe" | "caution" | "critical";

export const gaugeStates = {
  safe: { level: "safe" as const, color: brand.green, label: "Safe" },
  caution: { level: "caution" as const, color: brand.yellow, label: "Caution" },
  critical: {
    level: "critical" as const,
    color: brand.red,
    label: "Critical",
  },
} as const;

/** ≥40 green, 20–39 yellow, <20 red */
export const gaugeThresholds = {
  safe: gauge.warnBelow,
  caution: gauge.lowBelow,
} as const;

export const typography = {
  fontFamily: {
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    hero: "3.5rem",
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.15,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
  },
  letterSpacing: {
    tight: "-0.02em",
    normal: "0",
    wide: "0.025em",
  },
} as const;

export const spacing = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
} as const;

export const radii = {
  none: "0",
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.25rem",
  full: "9999px",
} as const;

export const shadows = {
  soft: "0 2px 8px rgba(11, 31, 20, 0.04), 0 1px 2px rgba(11, 31, 20, 0.03)",
  md: "0 4px 16px rgba(11, 31, 20, 0.06), 0 2px 4px rgba(11, 31, 20, 0.04)",
  lg: "0 8px 32px rgba(11, 31, 20, 0.08), 0 4px 8px rgba(11, 31, 20, 0.04)",
  gauge: "0 8px 40px rgba(28, 163, 80, 0.12), 0 2px 8px rgba(11, 31, 20, 0.04)",
  gaugeCritical:
    "0 8px 40px rgba(220, 38, 38, 0.15), 0 2px 8px rgba(11, 31, 20, 0.04)",
} as const;

export const motion = {
  duration: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
    breathe: "2.4s",
  },
  easing: {
    out: "cubic-bezier(0.16, 1, 0.3, 1)",
    inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  springs: {
    gentle: { stiffness: 120, damping: 20 },
    snappy: { stiffness: 260, damping: 24 },
  },
} as const;

export const gaugeSizes = {
  sm: 120,
  md: 180,
  lg: 220,
  hero: gauge.heroSize,
} as const;

export type GaugeSizeToken = keyof typeof gaugeSizes;

export function clampPercent(percent: number): number {
  if (Number.isNaN(percent)) return 0;
  return Math.min(100, Math.max(0, percent));
}

export function getGaugeLevel(percent: number): GaugeLevel {
  const p = clampPercent(percent);
  if (p >= gauge.warnBelow) return "safe";
  if (p >= gauge.lowBelow) return "caution";
  return "critical";
}

export function getGaugeColor(percent: number): string {
  return gaugeStates[getGaugeLevel(percent)].color;
}

export function getGaugeState(percent: number) {
  return gaugeStates[getGaugeLevel(percent)];
}

export const tokens = {
  brand,
  ink,
  inkMuted,
  border,
  surface,
  gauge,
  gaugeStates,
  gaugeThresholds,
  typography,
  spacing,
  radii,
  shadows,
  motion,
  gaugeSizes,
} as const;

export type GasGoTokens = typeof tokens;
