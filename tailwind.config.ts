import type { Config } from "tailwindcss";

/**
 * GasGo Tailwind theme — merge `theme.extend` into your project config,
 * or use this as a drop-in when scaffolding a greenfield app.
 */
const config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#1CA350",
          yellow: "#FFDF22",
          red: "#DC2626",
          white: "#FFFFFF",
          DEFAULT: "#1CA350",
          foreground: "#FFFFFF",
        },
        ink: {
          DEFAULT: "#0B1F14",
          muted: "#4B6356",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F7FAF8",
          soft: "#F0F7F3",
        },
        border: {
          DEFAULT: "#E6EEE9",
        },
        gauge: {
          track: "#E8F5EE",
          warn: "#F59E0B",
          safe: "#1CA350",
          caution: "#FFDF22",
          critical: "#DC2626",
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
          "0 2px 8px rgba(11, 31, 20, 0.04), 0 1px 2px rgba(11, 31, 20, 0.03)",
        "gasgo-md":
          "0 4px 16px rgba(11, 31, 20, 0.06), 0 2px 4px rgba(11, 31, 20, 0.04)",
        "gasgo-lg":
          "0 8px 32px rgba(11, 31, 20, 0.08), 0 4px 8px rgba(11, 31, 20, 0.04)",
        "gasgo-gauge":
          "0 8px 40px rgba(28, 163, 80, 0.12), 0 2px 8px rgba(11, 31, 20, 0.04)",
        "gasgo-gauge-critical":
          "0 8px 40px rgba(220, 38, 38, 0.15), 0 2px 8px rgba(11, 31, 20, 0.04)",
      },
      keyframes: {
        "gauge-breathe": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.015)" },
        },
        "gauge-fill": {
          from: { strokeDashoffset: "var(--gauge-circumference)" },
          to: { strokeDashoffset: "var(--gauge-offset)" },
        },
        "gauge-pulse": {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "gauge-breathe":
          "gauge-breathe 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite",
        "gauge-fill":
          "gauge-fill 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "gauge-pulse":
          "gauge-pulse 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite",
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
