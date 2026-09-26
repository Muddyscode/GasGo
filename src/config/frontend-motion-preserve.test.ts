import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const SRC = path.resolve(__dirname, "..");

function readSrc(rel: string) {
  return readFileSync(path.resolve(SRC, rel), "utf8");
}

describe("frontend-motion-preserve keep-list", () => {
  it("leaves existing marketing and chrome motion untouched", () => {
    expect(readSrc("app/globals.css")).toMatch(/kitchen-hero-parallax/);
    expect(readSrc("app/globals.css")).toMatch(/hero-status-pulse/);
    expect(readSrc("app/globals.css")).toMatch(/\.page-enter/);
    expect(readSrc("components/nav/CustomerChrome.tsx")).toMatch(/page-enter/);
    expect(readSrc("components/marketing/MarketingFaq.tsx")).toMatch(
      /group-open:rotate-45/,
    );
    expect(readSrc("components/theme/ThemeToggle.tsx")).toMatch(
      /transition-\[background-color,transform\]/,
    );
    expect(readSrc("components/marketing/MarketingReveal.tsx")).toMatch(
      /mkt-reveal/,
    );
    expect(readSrc("components/order/CheckoutReceiptSheet.tsx")).toMatch(
      /motion-safe:transition-transform/,
    );
    expect(readSrc("lib/overlay.ts")).toMatch(/OVERLAY_SCRIM_45_CLASS/);
    expect(readSrc("lib/overlay.ts")).toMatch(/OVERLAY_SCRIM_40_CLASS/);
  });
});
