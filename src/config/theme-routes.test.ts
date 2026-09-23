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
    expect(existsSync(path.resolve(ROOT, "public/brand/kitchen-relief.png"))).toBe(true);
    expect(readSrc("components/marketing/HeroRun.tsx")).toMatch(/\/brand\/ph-tower\.webp/);
    expect(readSrc("components/marketing/HeroRun.tsx")).toMatch(/hero-run|HeroRun/);
    expect(readSrc("components/marketing/KitchenHero.tsx")).toMatch(/\/brand\/kitchen-relief\.png/);
    expect(readSrc("components/marketing/MarketingLanding.tsx")).toMatch(/KitchenHero/);
    expect(readSrc("components/marketing/MarketingLanding.tsx")).not.toMatch(/HeroRun|CyclingGreeting/);
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

  it("ships FAQ + footer on the marketing site", () => {
    expect(existsSync(path.resolve(SRC, "lib/marketing-faq.ts"))).toBe(true);
    expect(readSrc("lib/marketing-faq.ts")).toMatch(/Coming soon/);
    expect(readSrc("components/marketing/MarketingFaq.tsx")).toMatch(/id="faq"/);
    expect(readSrc("components/marketing/MarketingFooter.tsx")).toMatch(/Port Harcourt/);
    expect(readSrc("components/marketing/MarketingFooter.tsx")).toMatch(/Coming soon/);
  });

  it("landing CTA is a dominant Start a refill button, not a search-like address pill", () => {
    const landing = readSrc("components/marketing/MarketingLanding.tsx");
    expect(landing).toMatch(/Start a refill/);
    expect(landing).toMatch(/See prices/);
    expect(landing).toMatch(/Nothing is filled at your door/);
    expect(landing).not.toMatch(/Port Harcourt · plant refill/);
    expect(landing).not.toMatch(/PinIcon|ArrowRight/);
  });

  it("footer is an ink band plus Product and Account links", () => {
    const footer = readSrc("components/marketing/MarketingFooter.tsx");
    expect(footer).toMatch(/bg-ink/);
    expect(footer).toMatch(/Garden City/);
    expect(footer).toMatch(/Coming soon/);
    expect(footer).toMatch(/smart gauge/);
    expect(footer).toMatch(/\/how-it-works/);
    expect(footer).toMatch(/\/zones/);
    expect(footer).toMatch(/\/why/);
    expect(footer).toMatch(/\/order\/cylinder/);
    expect(footer).toMatch(/\/login/);
    expect(footer).toMatch(/WhatsApp/);
    expect(footer).toMatch(/GASGO_WHATSAPP_DISPLAY/);
    expect(footer).toMatch(/ZONE_FEE_MAX_NGN/);
    expect(footer).toMatch(/title="Product"/);
    expect(footer).toMatch(/title="Account"/);
    expect(footer).not.toMatch(/xl:grid-cols-5|sm:grid-cols-3/);
    expect(footer).not.toMatch(/href=["']\/signup["']/);
    expect(footer).not.toMatch(/title="Plant loop"|LOOP_LINKS|PH_ZONES\.map|title="Coming soon"/);
    expect(footer).toMatch(/COMING_SOON_LINE/);
    expect(footer).not.toMatch(/Never run out/);
    expect(footer).not.toMatch(/Diobu|Trans-Amadi|Rumuola|Eliozu/);
    expect(footer).not.toMatch(/Lagos|Lekki|Ikeja/);
    expect(footer).not.toMatch(/marketing-footer__band|FooterBand/);
  });

  it("HeroRun living road honors reduced motion", () => {
    const css = readSrc("app/globals.css");
    expect(css).toMatch(/hero-run-truck/);
    expect(css).toMatch(/hero-run-soul/);
    expect(css).toMatch(/prefers-reduced-motion/);
    expect(css).toMatch(/hero-run__haze/);
  });

  it("theme toggle lives in nav and settings, persisted via tokens", () => {
    expect(readSrc("components/nav/NavActions.tsx")).toMatch(/ThemeToggle/);
    expect(readSrc("components/profile/ProfileSupport.tsx")).toMatch(/ThemePreference/);
    expect(readSrc("app/layout.tsx")).toMatch(/ThemeProvider/);
    expect(readSrc("config/tokens.ts")).toMatch(/surfaceOnDark|inkOnDark/);
    expect(readRoot("tailwind.config.ts")).toMatch(/--gasgo-ink|--gasgo-surface/);
    expect(readRoot("tailwind.config.ts")).toMatch(/from ["']\.\/src\/config\/tokens["']/);
  });
});
