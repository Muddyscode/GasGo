import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PH_ZONES, ZONE_FEE_MAX_NGN } from "@/config/pricing";
import { brand } from "@/config/tokens";
import { THEME_PREFERENCES } from "@/lib/theme";

const ROOT = path.resolve(__dirname, "../..");
const SRC = path.resolve(__dirname, "..");

function readSrc(rel: string) {
  return readFileSync(path.resolve(SRC, rel), "utf8");
}

function readRoot(rel: string) {
  return readFileSync(path.resolve(ROOT, rel), "utf8");
}

function walkFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, acc);
    else acc.push(full);
  }
  return acc;
}

describe("Kaplan round-2 leftover lock", () => {
  it("does not ship unused HeroWorld or leftover gas-gauge.css / jfif", () => {
    expect(existsSync(path.resolve(SRC, "components/marketing/HeroWorld.tsx"))).toBe(
      false,
    );
    expect(readSrc("components/marketing/index.ts")).not.toMatch(/HeroWorld/);
    expect(existsSync(path.resolve(SRC, "app/gas-gauge.css"))).toBe(false);
    expect(existsSync(path.resolve(SRC, "components/gauge/gas-gauge.css"))).toBe(
      false,
    );
    expect(existsSync(path.resolve(ROOT, "src/app/gas-gauge.css"))).toBe(false);

    const publicFiles = walkFiles(path.resolve(ROOT, "public"));
    expect(publicFiles.some((file) => file.toLowerCase().endsWith(".jfif"))).toBe(
      false,
    );
  });

  it("keeps one PH_ZONES table and every zone fee at or below ₦1,200", () => {
    expect(ZONE_FEE_MAX_NGN).toBe(1200);
    const fees = PH_ZONES.map((zone) => zone.feeNgn);
    expect(Math.max(...fees)).toBeLessThanOrEqual(1200);
    for (const zone of PH_ZONES) {
      expect(zone.feeNgn, zone.name).toBeLessThanOrEqual(ZONE_FEE_MAX_NGN);
    }

    const zoneTables = walkFiles(SRC).filter((file) => {
      if (!/\.(ts|tsx)$/.test(file)) return false;
      const text = readFileSync(file, "utf8");
      return /feeNgn:\s*\d+/.test(text);
    });
    expect(zoneTables).toEqual([path.resolve(SRC, "config/pricing.ts")]);
  });

  it("hides draft-kg on marketing island nav and keeps the order-only landing CTA", () => {
    const actions = readSrc("components/nav/NavActions.tsx");
    expect(actions).toMatch(/island/);
    expect(actions).toMatch(/!island/);
    expect(actions).not.toMatch(/island && live\.fillKg/);

    const landing = readSrc("components/marketing/MarketingLanding.tsx");
    expect(landing).toMatch(/Order a refill/);
    expect(landing).not.toMatch(/PinIcon|search pill|SearchPill|type=["']search["']/i);
    expect(landing).not.toMatch(/Port Harcourt · plant refill/);
  });

  it("uses one token system with toggle + system preference on marketing and app shell", () => {
    expect(THEME_PREFERENCES).toEqual(["system", "light", "dark"]);
    expect(brand.green).toBe("#1CA350");
    expect(brand.yellow).toBe("#FFDF22");
    expect(brand.red).toBe("#DC2626");

    const tailwind = readRoot("tailwind.config.ts");
    expect(tailwind).toMatch(/from ["']\.\/src\/config\/tokens["']/);
    expect(tailwind).toMatch(/brand\.green/);
    expect(tailwind).not.toMatch(/#1CA350|#FFDF22|#DC2626/);

    expect(readSrc("components/nav/TopNav.tsx")).toMatch(/NavActions island/);
    expect(readSrc("components/nav/NavActions.tsx")).toMatch(/ThemeToggle/);
    expect(readSrc("components/theme/ThemePreferenceRow.tsx")).toMatch(
      /value:\s*["']system["']/,
    );
    expect(readSrc("lib/theme.ts")).toMatch(/readThemePreference/);
    expect(readSrc("app/layout.tsx")).toMatch(/ThemeProvider/);
  });

  it("keeps Never run out as Coming soon with no toggle or autoRefill stub", () => {
    const teaser = readSrc("components/marketing/ComingSoonTeaser.tsx");
    expect(teaser).toMatch(/Coming soon/);
    expect(teaser).not.toMatch(/checkbox|switch|autoRefillEnabled/i);

    expect(existsSync(path.resolve(SRC, "components/profile/ProfileAutoRefill.tsx"))).toBe(
      false,
    );
    expect(readSrc("data/profile.ts")).not.toMatch(/autoRefillEnabled/);
    expect(readSrc("components/home/AppHome.tsx")).toMatch(/ComingSoonTeaser/);
    expect(readSrc("components/profile/ProfileView.tsx")).toMatch(/ComingSoonTeaser/);
    expect(readSrc("components/home/AppHome.tsx")).toMatch(/Coming soon|ComingSoonTeaser/);
    expect(readSrc("components/home/AppHome.tsx")).not.toMatch(
      /type=["']checkbox["']|role=["']switch["']|autoRefillEnabled/,
    );
    expect(readSrc("components/profile/ProfileView.tsx")).not.toMatch(
      /type=["']checkbox["']|role=["']switch["']|autoRefillEnabled/,
    );
    expect(readSrc("components/theme/ThemePreferenceRow.tsx")).not.toMatch(
      /Never run out|autoRefill|Auto-refill/,
    );
  });
});
