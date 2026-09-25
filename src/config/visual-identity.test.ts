import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { LIVE_RATE_NGN_PER_KG, PH_ZONES, ZONE_FEE_MAX_NGN, ZONE_FEE_MIN_NGN } from "@/config/pricing";
import { brand, ink, surface, typography } from "@/config/tokens";
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
    expect(readSrc("config/tokens.ts")).not.toMatch(/greenDeep|greenOnDark|greenTint/);
    expect(readSrc("app/globals.css")).not.toMatch(/#157a42|#3bb36c|#157A42|#3BB36C/);
    expect(readSrc("app/globals.css")).toMatch(/theme\("colors\.brand\.green"\)/);
    expect(readSrc("app/globals.css")).not.toMatch(/theme\("colors\.brand\.greenDeep"\)/);
    expect(readSrc("app/globals.css")).not.toMatch(/theme\("colors\.brand\.greenOnDark"\)/);
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
    expect(landing).toMatch(/mkt-cta-fill/);
    expect(landing).toMatch(/mkt-link/);
    expect(landing).toMatch(/text-\[19px\] font-bold/);
    expect(landing).toMatch(/See prices/);
    expect(landing).toMatch(/Sign in/);
    expect(readSrc("app/globals.css")).toMatch(/\.mkt-link \{[\s\S]*font-size:\s*19px/);
    expect(readSrc("app/globals.css")).toMatch(/\.mkt-kicker \{[\s\S]*font-size:\s*19px/);
    expect(readSrc("components/nav/TopNav.tsx")).toMatch(/mkt-cta-fill/);
    expect(landing).toMatch(/MARKETING_SAFETY/);
    expect(readSrc("lib/marketing-greetings.ts")).toMatch(/Nothing is filled at your door/);
    expect(landing).toMatch(/KitchenHero/);
    expect(landing.match(/<KitchenHero/g)?.length).toBe(1);
    expect(landing).toMatch(/MarketingReveal/);
    expect(landing).not.toMatch(/HeroRun|CyclingGreeting|FadeLift|ArrowRight/);
    expect(readSrc("app/globals.css")).toMatch(/hero-status-pulse/);
    expect(readSrc("app/globals.css")).toMatch(/kitchen-hero-parallax/);
    expect(readSrc("app/globals.css")).toMatch(/hero-cloud-drift/);
    expect(readSrc("app/globals.css")).toMatch(/hero-flame-flicker/);
    expect(readSrc("app/globals.css")).toMatch(/hero-steam/);
    expect(blob).not.toMatch(/uppercase tracking/);
    expect(blob).not.toMatch(/ · /);
    expect(blob).not.toMatch(/→/);
    expect(how).toMatch(/We collect, refill at the plant, and return/);
    expect(landing).not.toMatch(/<svg/);
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

  it("reserves chrome space so sticky nav cannot overlay marketing content", () => {
    const chrome = readSrc("components/nav/CustomerChrome.tsx");
    const nav = readSrc("components/nav/TopNav.tsx");
    expect(chrome).toMatch(/h-dvh/);
    expect(chrome).toMatch(/gasgo-chrome-scroll/);
    expect(chrome).toMatch(/overflow-y-auto/);
    expect(chrome).toMatch(/isInnerMarketing/);
    expect(chrome).toMatch(/marketingSurface/);
    expect(chrome).toMatch(/marketingNav/);
    expect(nav).toMatch(/shrink-0/);
    expect(nav).not.toMatch(/sticky top-0/);
    expect(nav).not.toMatch(/>\s*PH\s*</);
    expect(nav).not.toMatch(/title="Port Harcourt only"/);
  });

  it("keeps auth and marketing free of mock-dev copy and the tower overlay", () => {
    const auth = readSrc("components/auth/AuthEntryView.tsx");
    const modal = readSrc("components/auth/AuthModal.tsx");
    const world = readSrc("components/auth/AuthWorld.tsx");
    const landing = readSrc("components/marketing/MarketingLanding.tsx");
    expect(auth).toMatch(/Signing in keeps any fill you already drafted/);
    expect(auth).not.toMatch(/Mock auth|mock auth|for now/);
    expect(modal).not.toMatch(/Mock signup|mock signup|for now/);
    expect(world).not.toMatch(/ph-tower/);
    expect(landing).toMatch(/Example Diobu pickup/);
    expect(landing).toMatch(/LIVE_RATE_NGN_PER_KG/);
    expect(landing).not.toMatch(/ArrowRight/);
    expect(landing).not.toMatch(/next pickup|GPS|en route|live tracking/i);
    expect(readSrc("components/marketing/ZoneMap.tsx")).toMatch(/Map legend|aria-label="Map legend"/);
    // The map canvas is shared between coverage and live tracking; the grid lives there.
    expect(readSrc("components/marketing/ZoneMap.tsx")).toMatch(/ZoneMapCanvas/);
    expect(readSrc("components/marketing/ZoneMapCanvas.tsx")).toMatch(/zone-grid/);
  });

  it("keeps the unused type scale on the original token values", () => {
    expect(typography.fontSize["3xl"]).toBe("1.875rem");
    expect(typography.fontSize["4xl"]).toBe("2.25rem");
    expect(typography.fontSize["5xl"]).toBe("3rem");
    expect(typography.fontSize.hero).toBe("3.5rem");
    expect(typography.lineHeight.tight).toBe(1.15);
    expect(typography.lineHeight.snug).toBe(1.375);
    expect(typography.lineHeight.relaxed).toBe(1.625);
  });

  it("shows MarketingReveal content without JS and skips motion when reduced", () => {
    const reveal = readSrc("components/marketing/MarketingReveal.tsx");
    expect(reveal).toMatch(/useState\(false\)/);
    expect(reveal).toMatch(/preReveal/);
    expect(reveal).toMatch(/usePrefersReducedMotion/);
    expect(reveal).toMatch(/setMounted\(true\)/);
    expect(readSrc("app/globals.css")).toMatch(/prefers-reduced-motion/);
  });

  it("uses a plain separator on marketing page titles, not a middle dot", () => {
    expect(readSrc("app/(customer)/zones/page.tsx")).toMatch(/title:\s*"Zones \| GasGo"/);
    expect(readSrc("app/(customer)/how-it-works/page.tsx")).toMatch(
      /title:\s*"How it works \| GasGo"/,
    );
    expect(readSrc("app/(customer)/zones/page.tsx")).not.toMatch(/·/);
    expect(readSrc("app/(customer)/how-it-works/page.tsx")).not.toMatch(/·/);
    expect(readSrc("app/(customer)/why/page.tsx")).not.toMatch(/·/);
  });

  it("does not leave arrows or middle dots in the marketing lane", () => {
    const files = walkFiles(path.resolve(SRC, "components/marketing")).filter((file) =>
      /\.(ts|tsx)$/.test(file),
    );
    files.push(path.resolve(SRC, "lib/marketing-faq.ts"));
    files.push(path.resolve(SRC, "lib/marketing-greetings.ts"));
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      expect(text, file).not.toMatch(/→/);
      expect(text, file).not.toMatch(/ · /);
    }
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
