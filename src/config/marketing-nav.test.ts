import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { navForPathname } from "@/lib/customer-routes";

const SRC = path.resolve(__dirname, "..");

function readSrc(rel: string) {
  return readFileSync(path.resolve(SRC, rel), "utf8");
}

function pageExists(rel: string) {
  return existsSync(path.resolve(SRC, rel));
}

const MARKETING_PAGES = [
  { href: "/how-it-works", page: "app/(customer)/how-it-works/page.tsx" },
  { href: "/zones", page: "app/(customer)/zones/page.tsx" },
  { href: "/why", page: "app/(customer)/why/page.tsx" },
  { href: "/login", page: "app/(customer)/login/page.tsx" },
  { href: "/signup", page: "app/(customer)/signup/page.tsx" },
] as const;

describe("marketing nav route contracts", () => {
  it("wires How it works, Zones, and Why GasGo to real pages", () => {
    const nav = readSrc("components/nav/TopNav.tsx");
    expect(nav).toMatch(/href:\s*["']\/how-it-works["']/);
    expect(nav).toMatch(/href:\s*["']\/zones["']/);
    expect(nav).toMatch(/href:\s*["']\/why["']/);
    expect(nav).toMatch(/href=["']\/order\/cylinder["']/);
    expect(nav).not.toMatch(/#how-it-works|#zones|#why-gasgo/);
  });

  it("ships thin page shells for marketing and auth entry routes", () => {
    for (const route of MARKETING_PAGES) {
      expect(pageExists(route.page), route.href).toBe(true);
    }
    expect(pageExists("app/(customer)/order/cylinder/page.tsx")).toBe(true);
  });

  it("prefers /login and /signup over AuthModal for Sign in / Sign up CTAs", () => {
    const actions = readSrc("components/nav/NavActions.tsx");
    expect(actions).toMatch(/href=["']\/login["']/);
    expect(actions).toMatch(/Sign in/);
    expect(actions).not.toMatch(/openAuth\(/);

    const profile = readSrc("components/profile/ProfileView.tsx");
    expect(profile).toMatch(/href=["']\/login["']/);
    expect(profile).not.toMatch(/openAuth\(["']\/profile["']\)/);

    const login = readSrc("app/(customer)/login/page.tsx");
    const signup = readSrc("app/(customer)/signup/page.tsx");
    expect(login).toMatch(/\/signup/);
    expect(signup).toMatch(/\/login/);
  });

  it("hides the draft kg chip on marketing island nav", () => {
    const actions = readSrc("components/nav/NavActions.tsx");
    expect(actions).toMatch(/island/);
    expect(actions).toMatch(/!island/);
    expect(actions).not.toMatch(/island && live\.fillKg/);
  });

  it("keeps guest checkout + draft survival while AuthModal stays for pay", () => {
    expect(readSrc("components/order/CheckoutView.tsx")).toMatch(
      /requestAuth\("\/order\/checkout"\)/,
    );
    expect(readSrc("components/order/PaystackPayButton.tsx")).toMatch(
      /requestAuth\("\/order\/checkout"\)/,
    );
    expect(readSrc("components/order/AddressDeliveryForm.tsx")).not.toMatch(
      /requestAuth/,
    );
    expect(readSrc("stores/session.ts")).toMatch(/must never touch the order draft/);
    expect(navForPathname("/how-it-works")?.backHref).toBe("/");
    expect(navForPathname("/zones")?.backHref).toBe("/");
    expect(navForPathname("/why")?.backHref).toBe("/");
    expect(navForPathname("/login")?.backHref).toBe("/");
    expect(navForPathname("/signup")?.backHref).toBe("/");
  });
});
