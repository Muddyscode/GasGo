import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const SRC = path.resolve(__dirname, "../..");

function readSrc(rel: string) {
  return readFileSync(path.resolve(SRC, rel), "utf8");
}

describe("demo persona picker contracts", () => {
  it("ships three Lucide personas with radio semantics and no emoji", () => {
    const picker = readSrc("components/auth/DemoPersonaPicker.tsx");
    const personas = readSrc("data/demo-personas.ts");
    const login = readSrc("app/(customer)/login/page.tsx");

    expect(picker).toMatch(/Choose an account/);
    expect(picker).not.toMatch(/Choose a demo account|demo mode|mock-auth|mock auth/i);
    expect(picker).toMatch(/role="radiogroup"/);
    expect(picker).toMatch(/role="radio"/);
    expect(picker).toMatch(/aria-checked/);
    expect(picker).toMatch(/\.focus\(/);
    expect(picker).toMatch(/from ["']lucide-react["']/);
    expect(picker).toMatch(/Home/);
    expect(picker).toMatch(/ChefHat/);
    expect(picker).toMatch(/Building2/);
    expect(picker).toMatch(/motion-safe:-translate-y-0.5/);
    expect(picker).toMatch(/ring-brand-green/);
    expect(picker).toMatch(/bg-brand-green\/12/);
    expect(picker).toMatch(/shadow-gasgo-md/);
    expect(picker).not.toMatch(/uppercase tracking/);
    expect(picker).not.toMatch(/import \{[^}]*ArrowRight/);
    expect(picker).not.toMatch(/→| · /);
    expect(picker).not.toMatch(/rgba\(31,\s*157,\s*85/);
    expect(picker).not.toMatch(/#1F9D55|#1f9d55/);
    expect(picker).not.toMatch(/[\u{1F300}-\u{1FAFF}]/u);

    expect(personas).toMatch(/Family account/);
    expect(personas).toMatch(/Culinary Institute/);
    expect(personas).toMatch(/Estate account/);
    expect(personas).toMatch(/amaka@example\.com/);
    expect(personas).toMatch(/tolu@example\.com/);
    expect(personas).toMatch(/estate@example\.com/);
    expect(personas).not.toMatch(/accountType|collective|group billing/i);

    expect(login).toMatch(/safeAppPath/);
    expect(login).not.toMatch(/nextFromSearchParams|resolveAuthNext|auth-redirect/);
    expect(readSrc("components/auth/AuthEntryView.tsx")).toMatch(/Sign in the usual way/);
    expect(readSrc("components/auth/AuthEntryView.tsx")).toMatch(/postAuthHref/);
  });
});
