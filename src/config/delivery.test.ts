import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { SAVED_ADDRESSES } from "@/config/delivery";
import { PH_ZONES } from "@/config/pricing";

const FORBIDDEN_GEO = /Lagos|Lekki|Yaba|Ikeja|Surulere/i;

describe("Port Harcourt delivery seeds", () => {
  it("SAVED_ADDRESSES are PH zones only", () => {
    const blob = SAVED_ADDRESSES.map(
      (address) => `${address.label} ${address.line} ${address.area} ${address.zoneId}`,
    ).join(" ");
    expect(blob).not.toMatch(FORBIDDEN_GEO);
    expect(blob).toMatch(/Old GRA/);
    expect(blob).toMatch(/Trans-Amadi/);
    expect(blob).toMatch(/Woji/);
    expect(
      SAVED_ADDRESSES.every((address) => PH_ZONES.some((zone) => zone.id === address.zoneId)),
    ).toBe(true);
  });

  it("customer address copy does not mention Lagos as a product city", () => {
    const source = readFileSync(
      path.resolve(__dirname, "../components/order/AddressDeliveryForm.tsx"),
      "utf8",
    );
    expect(source).not.toMatch(FORBIDDEN_GEO);
    expect(source).toMatch(/Port Harcourt|WAT/);
  });

  it("does not ship unused HomeHero leftover", () => {
    expect(existsSync(path.resolve(__dirname, "../components/home/HomeHero.tsx"))).toBe(false);
  });

  it("does not ship unused CylinderSelection / CylinderCard leftovers", () => {
    expect(
      existsSync(path.resolve(__dirname, "../components/order/CylinderSelection.tsx")),
    ).toBe(false);
    expect(
      existsSync(path.resolve(__dirname, "../components/order/CylinderCard.tsx")),
    ).toBe(false);
  });
});
