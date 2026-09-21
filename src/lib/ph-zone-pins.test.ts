import { describe, expect, it } from "vitest";
import { PH_ZONES } from "@/config/pricing";
import { ZONE_PIN_LAYOUT } from "@/lib/ph-zone-pins";

describe("PH zone pins", () => {
  it("places every configured Port Harcourt zone on the artistic map", () => {
    for (const zone of PH_ZONES) {
      expect(ZONE_PIN_LAYOUT[zone.id], zone.name).toBeDefined();
    }
  });

  it("does not pin Lagos areas", () => {
    const keys = Object.keys(ZONE_PIN_LAYOUT).join(" ");
    const names = PH_ZONES.map((z) => z.name).join(" ");
    expect(`${keys} ${names}`).not.toMatch(/Lagos|Lekki|Yaba|Ikeja|Surulere/i);
  });
});
