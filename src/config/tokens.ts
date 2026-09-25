/**
 * GasGo design tokens — single source of truth.
 * Brand lock: Energy Green #1F9D55, Sun Yellow #FFC53D, Flame Red #E1432D
 * Surfaces: #FFFFFF / #FAF8F3. Ink: #16231C.
 */

export const brand = {
  green: "#1F9D55",
  yellow: "#FFC53D",
  red: "#E1432D",
  white: "#FFFFFF",
  /** Text-only AA green on white (5.39:1). Fills and marks stay brand.green. */
  greenDeep: "#157A42",
  /** Text-only AA green on marketing dark surfaces. */
  greenOnDark: "#3BB36C",
} as const;

export const ink = "#16231C";
export const inkMuted = "#4E5F56";
export const border = "#E6E2D8";

export const surface = {
  DEFAULT: "#FFFFFF",
  muted: "#FAF8F3",
  soft: "#F3F0E8",
} as const;

/**
 * Dark remap of the same token tree (ink ↔ surface). Not a second palette.
 * Brand green / yellow / red / white stay locked in both schemes.
 */
export const inkOnDark = surface.muted;
export const inkMutedOnDark = "#9BB0A6";
export const borderOnDark = "#2A3A32";
export const surfaceOnDark = {
  DEFAULT: ink,
  muted: "#1C2C24",
  soft: "#22352B",
} as const;

/** Gauge levels: safe ≥40, caution 20–39, critical <20 */
export const gauge = {
  track: "#E8F5EE",
  heroSize: 240,
  /** percent ≥ this → safe */
  safeAt: 40,
  /** percent ≥ this and < safeAt → caution; below → critical */
  cautionAt: 20,
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

export const gaugeSizes = {
  sm: 120,
  md: 180,
  lg: 220,
  hero: gauge.heroSize,
} as const;

export type GaugeSizeToken = keyof typeof gaugeSizes;

export const typography = {
  fontFamily: {
    sans: 'var(--font-sans), Inter, ui-sans-serif, system-ui, sans-serif',
    display: 'var(--font-display), "Inter Tight", Inter, ui-sans-serif, sans-serif',
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
  fontWeight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
  lineHeight: { tight: 1.15, snug: 1.375, normal: 1.5, relaxed: 1.625 },
  letterSpacing: { tight: "-0.02em", normal: "0", wide: "0.025em" },
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
  soft: "0 2px 8px rgba(22, 35, 28, 0.04), 0 1px 2px rgba(22, 35, 28, 0.03)",
  md: "0 4px 16px rgba(22, 35, 28, 0.06), 0 2px 4px rgba(22, 35, 28, 0.04)",
  lg: "0 8px 32px rgba(22, 35, 28, 0.08), 0 4px 8px rgba(22, 35, 28, 0.04)",
  gauge: "0 8px 40px rgba(31, 157, 85, 0.12), 0 2px 8px rgba(22, 35, 28, 0.04)",
  gaugeCritical:
    "0 8px 40px rgba(225, 67, 45, 0.15), 0 2px 8px rgba(22, 35, 28, 0.04)",
  gaugeCaution:
    "0 8px 40px rgba(255, 197, 61, 0.28), 0 2px 8px rgba(22, 35, 28, 0.04)",
} as const;

export const motion = {
  duration: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
    /** Fade + Lift enter — opacity 0→1, translateY 12→0 */
    lift: "450ms",
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
  lift: {
    durationMs: 450,
    fromY: 12,
    /** Stagger between sibling beats / cards (60–80ms). */
    staggerMs: 70,
  },
  /** Marketing scroll-reveal only — not FadeLift (kill-listed on the landing). */
  reveal: {
    durationMs: 520,
    fromY: 16,
    staggerMs: 70,
  },
} as const;

export function clampPercent(percent: number): number {
  if (Number.isNaN(percent)) return 0;
  return Math.min(100, Math.max(0, percent));
}

export function getGaugeLevel(percent: number): GaugeLevel {
  const p = clampPercent(percent);
  if (p >= gauge.safeAt) return "safe";
  if (p >= gauge.cautionAt) return "caution";
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
  inkOnDark,
  inkMutedOnDark,
  borderOnDark,
  surfaceOnDark,
  gauge,
  gaugeStates,
  typography,
  spacing,
  radii,
  shadows,
  motion,
  gaugeSizes,
} as const;

export type GasGoTokens = typeof tokens;
