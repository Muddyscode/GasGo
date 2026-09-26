import type { Config } from "tailwindcss";
import {
  border,
  borderOnDark,
  brand,
  gauge,
  ink,
  inkMuted,
  inkMutedOnDark,
  inkOnDark,
  surface,
  surfaceOnDark,
} from "./src/config/tokens";

/**
 * GasGo Tailwind theme — colors come from `src/config/tokens.ts`.
 */
const config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        display: [
          "var(--font-display)",
          "Inter Tight",
          "var(--font-sans)",
          "Inter",
          "ui-sans-serif",
          "sans-serif",
        ],
      },
      colors: {
        token: {
          ink,
          inkMuted,
          border,
          surface: surface.DEFAULT,
          surfaceMuted: surface.muted,
          surfaceSoft: surface.soft,
          inkOnDark,
          inkMutedOnDark,
          borderOnDark,
          surfaceOnDark: surfaceOnDark.DEFAULT,
          surfaceOnDarkMuted: surfaceOnDark.muted,
          surfaceOnDarkSoft: surfaceOnDark.soft,
          gaugeTrack: gauge.track,
        },
        brand: {
          green: brand.green,
          yellow: brand.yellow,
          red: brand.red,
          white: brand.white,
          greenDeep: brand.greenDeep,
          greenOnDark: brand.greenOnDark,
          DEFAULT: brand.green,
          foreground: brand.white,
        },
        ink: {
          DEFAULT: "var(--gasgo-ink)",
          muted: "var(--gasgo-ink-muted)",
        },
        surface: {
          DEFAULT: "var(--gasgo-surface)",
          muted: "var(--gasgo-surface-muted)",
          soft: "var(--gasgo-surface-soft)",
        },
        border: {
          DEFAULT: "var(--gasgo-border)",
        },
        gauge: {
          track: gauge.track,
          safe: gauge.safe,
          caution: gauge.caution,
          critical: gauge.critical,
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        ring: "hsl(var(--ring))",
        input: "hsl(var(--input))",
      },
      boxShadow: {
        "gasgo-soft":
          "0 2px 8px rgba(22, 35, 28, 0.04), 0 1px 2px rgba(22, 35, 28, 0.03)",
        "gasgo-md":
          "0 4px 16px rgba(22, 35, 28, 0.06), 0 2px 4px rgba(22, 35, 28, 0.04)",
        "gasgo-lg":
          "0 8px 32px rgba(22, 35, 28, 0.08), 0 4px 8px rgba(22, 35, 28, 0.04)",
        "gasgo-gauge":
          "0 8px 40px rgba(31, 157, 85, 0.12), 0 2px 8px rgba(22, 35, 28, 0.04)",
        "gasgo-gauge-critical":
          "0 8px 40px rgba(225, 67, 45, 0.15), 0 2px 8px rgba(22, 35, 28, 0.04)",
        "gasgo-gauge-caution":
          "0 8px 40px rgba(255, 197, 61, 0.28), 0 2px 8px rgba(22, 35, 28, 0.04)",
      },
      keyframes: {
        "gauge-breathe": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
            filter: "drop-shadow(0 0 0 transparent)",
          },
          "50%": {
            opacity: "0.92",
            transform: "scale(1.018)",
            filter:
              "drop-shadow(0 0 10px color-mix(in srgb, var(--gauge-critical) 45%, transparent))",
          },
        },
        "gauge-fill": {
          from: { strokeDashoffset: "var(--gauge-circumference)" },
          to: { strokeDashoffset: "var(--gauge-offset)" },
        },
        "gauge-pulse": {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.6" },
        },
        "page-enter": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "none" },
        },
        "fade-lift": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "truck-drive": {
          "0%": { transform: "translateX(-28%) translateY(0)" },
          "45%": { transform: "translateX(38%) translateY(-3px)" },
          "100%": { transform: "translateX(118%) translateY(0)" },
        },
      },
      animation: {
        "gauge-breathe":
          "gauge-breathe 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite",
        "gauge-fill":
          "gauge-fill 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "gauge-pulse":
          "gauge-pulse 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite",
        "page-enter":
          "page-enter 420ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-lift":
          "fade-lift 450ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "truck-drive":
          "truck-drive 4.8s cubic-bezier(0.45, 0, 0.2, 1) infinite",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
