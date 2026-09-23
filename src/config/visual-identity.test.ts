import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { LIVE_RATE_NGN_PER_KG, PH_ZONES, ZONE_FEE_MAX_NGN, ZONE_FEE_MIN_NGN } from "@/config/pricing";
import { brand, ink, surface } from "@/config/tokens";
import { GASGO_WHATSAPP_DISPLAY, GASGO_WHATSAPP_E164 } from "@/config/whatsapp";

const SRC = path.resolve(__dirname, "..");
const ROOT = path.resolve(__dirname, "../..");

function readSrc(rel: string) {
  return readFileSync(path.resolve(SRC, rel), "utf8");
}

function walkFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, acc);
    else acc.push(full);
  }
  return acc;
}

describe("GasGo visual identity v1", () => {
  it("locks the Claude hexes and light-first surfaces in the single token tree", () => {
    expect(brand.green).toBe("#1F9D55");
    expect(brand.yellow).toBe("#FFC53D");
    expect(brand.red).toBe("#E1432D");
    expect(brand.white).toBe("#FFFFFF");
    expect(ink).toBe("#16231C");
    expect(surface.DEFAULT).toBe("#FFFFFF");
    expect(surface.muted).toBe("#FAF8F3");
    expect(readSrc("config/tokens.ts")).not.toMatch(/#1CA350|#FFDF22|#DC2626|#0B1F14/);
    expect(readSrc("app/layout.tsx")).toMatch(/Inter_Tight/);
    expect(readSrc("app/layout.tsx")).toMatch(/Inter,/);
  });

  it("keeps marketing kill-list items off the landing page", () => {
    const landing = readSrc("components/marketing/MarketingLanding.tsx");
    const how = readSrc("components/marketing/HowItWorks.tsx");
    const why = readSrc("components/marketing/KeyBenefits.tsx");
    const zones = readSrc("components/marketing/ZoneMap.tsx");
    const blob = `${landing}\n${how}\n${why}\n${zones}`;

    expect(landing).toMatch(/Start a refill/);
    expect(landing).toMatch(/See prices/);
    expect(landing).toMatch(/Sign in/);
    expect(landing).toMatch(/MARKETING_SAFETY/);
    expect(readSrc("lib/marketing-greetings.ts")).toMatch(/Nothing is filled at your door/);
    expect(landing).toMatch(/KitchenHero/);
    expect(landing).not.toMatch(/HeroRun|CyclingGreeting|FadeLift|ArrowRight/);
    expect(blob).not.toMatch(/uppercase tracking/);
    expect(blob).not.toMatch(/ · /);
    expect(blob).not.toMatch(/cardClassName/);
    expect(existsSync(path.resolve(SRC, "components/marketing/CyclingGreeting.tsx"))).toBe(
      false,
    );
    expect(existsSync(path.resolve(SRC, "components/marketing/HeroRun.tsx"))).toBe(
      false,
    );
  });

  it("shows investor-truth live rate and zone ceiling from the shared pricing table", () => {
    expect(LIVE_RATE_NGN_PER_KG).toBe(1450);
    expect(ZONE_FEE_MIN_NGN).toBe(600);
    expect(ZONE_FEE_MAX_NGN).toBe(1200);
    expect(PH_ZONES.map((zone) => zone.name).join(" ")).toMatch(
      /Diobu|Old GRA|Trans-Amadi|Woji|Eliozu|Rumuokoro|Rumuola|Ada George/,
    );
    expect(readSrc("components/marketing/MarketingLanding.tsx")).toMatch(
      /LIVE_RATE_NGN_PER_KG/,
    );
    expect(readSrc("lib/marketing-faq.ts")).toMatch(/₦1,450\/kg/);
  });

  it("prints the real WhatsApp line and coming-soon teaser only in the footer", () => {
    expect(GASGO_WHATSAPP_E164).toBe("2348088444645");
    expect(GASGO_WHATSAPP_DISPLAY).toBe("+234 808 844 4645");
    expect(readSrc("components/marketing/MarketingFooter.tsx")).toMatch(
      /GASGO_WHATSAPP_DISPLAY/,
    );
    expect(readSrc("components/marketing/MarketingFooter.tsx")).toMatch(
      /COMING_SOON_LINE/,
    );
    expect(readSrc("lib/marketing-greetings.ts")).toMatch(/smart gauge/);
  });

  it("does not ship a flame in the logotype", () => {
    const mark = readSrc("components/brand/GasGoMark.tsx");
    const svg = readFileSync(path.resolve(ROOT, "public/brand/gasgo-mark.svg"), "utf8");
    expect(mark).toMatch(/valve|gas-ring|circle/i);
    expect(mark).not.toMatch(/path d="M18 44c0-14/);
    expect(svg).not.toMatch(/M18 44c0-14/);
  });

  it("does not leave retired brand hexes in marketing sources", () => {
    const files = walkFiles(path.resolve(SRC, "components/marketing")).filter((file) =>
      /\.(ts|tsx)$/.test(file),
    );
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      expect(text, file).not.toMatch(/#1CA350|#FFDF22|#DC2626/);
    }
  });
});
