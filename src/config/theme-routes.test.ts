import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = path.resolve(__dirname, "../..");
const SRC = path.resolve(__dirname, "..");

function readSrc(rel: string) {
  return readFileSync(path.resolve(SRC, rel), "utf8");
}

function readRoot(rel: string) {
  return readFileSync(path.resolve(ROOT, rel), "utf8");
}

describe("HeroRun + auth split + theme contracts", () => {
  it("commits the Port Harcourt Tower landmark under public/brand", () => {
    expect(existsSync(path.resolve(ROOT, "public/brand/ph-tower.webp"))).toBe(true);
    expect(readSrc("components/marketing/HeroRun.tsx")).toMatch(/\/brand\/ph-tower\.webp/);
    expect(readSrc("components/marketing/HeroRun.tsx")).toMatch(/hero-run|HeroRun/);
    expect(readSrc("components/marketing/MarketingLanding.tsx")).toMatch(/HeroRun/);
  });

  it("auth pages are visual-left / form-right and keep demo sign-in", () => {
    const auth = readSrc("components/auth/AuthEntryView.tsx");
    expect(auth).toMatch(/BrandMark/);
    expect(auth).toMatch(/auth-visual|AuthWorld/);
    expect(auth).toMatch(/lg:grid-cols-2|md:grid-cols-2/);
    expect(auth).toMatch(/Continue with demo account/);
    expect(auth).not.toMatch(/clear\(/);
    expect(auth).not.toMatch(/Lagos|Lekki|Ikeja/);
  });

  it("theme toggle lives in nav and settings, persisted via tokens", () => {
    expect(readSrc("components/nav/NavActions.tsx")).toMatch(/ThemeToggle/);
    expect(readSrc("components/profile/ProfileSupport.tsx")).toMatch(/ThemePreference/);
    expect(readSrc("app/layout.tsx")).toMatch(/ThemeProvider/);
    expect(readSrc("config/tokens.ts")).toMatch(/surfaceOnDark|inkOnDark/);
    expect(readRoot("tailwind.config.ts")).toMatch(/--gasgo-ink|--gasgo-surface/);
  });
});
