import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { applyFulfillmentToQuote } from "./fulfillment";
import {
  LIVE_RATE_NGN_PER_KG,
  PAYMENT_VARIANCE_COPY,
  PH_ZONES,
  ZONE_FEE_MAX_NGN,
  ZONE_FEE_MIN_NGN,
  getZone,
  quoteFill,
  quoteOrder,
  resolveFillKg,
  visibleQuoteLines,
} from "./pricing";

describe("PH live fill quote", () => {
  it("full fill is capacity × live ₦/kg, with zone fee as a separate line", () => {
    const quote = quoteFill({
      fillMode: "full",
      capacityKg: 12.5,
      zoneId: "old-gra",
    });

    expect(quote.fillKg).toBe(12.5);
    expect(quote.gasFillNgn).toBe(Math.round(12.5 * LIVE_RATE_NGN_PER_KG));
    expect(quote.deliveryNgn).toBe(getZone("old-gra")?.feeNgn);
    expect(quote.totalNgn).toBe(quote.gasFillNgn + (getZone("old-gra")?.feeNgn ?? 0));
    expect(quote.lines).toHaveLength(2);
    expect(quote.lines[0]?.id).toBe("gas");
    expect(quote.lines[1]?.id).toBe("delivery");
    expect(quote.lines[1]?.label).toMatch(/Old GRA/i);
    expect(quote.zoneName).toBe("Old GRA");
  });

  it("by-kg fill caps at capacity", () => {
    expect(
      resolveFillKg({ fillMode: "kg", capacityKg: 12.5, fillKg: 6 }),
    ).toBe(6);
    expect(
      resolveFillKg({ fillMode: "kg", capacityKg: 12.5, fillKg: 40 }),
    ).toBe(12.5);
  });

  it("by-naira fill converts spend ÷ live rate and caps at capacity", () => {
    const kg = resolveFillKg({
      fillMode: "naira",
      capacityKg: 12.5,
      spendNaira: LIVE_RATE_NGN_PER_KG * 5,
    });
    expect(kg).toBe(5);

    const capped = quoteFill({
      fillMode: "naira",
      capacityKg: 6,
      spendNaira: 1_000_000,
      zoneId: "eliozu",
    });
    expect(capped.fillKg).toBe(6);
    expect(capped.deliveryNgn).toBe(getZone("eliozu")?.feeNgn);
  });

  it("does not invent a Lagos flat fee when the zone is unknown", () => {
    const quote = quoteFill({ fillMode: "full", capacityKg: 12.5 });
    expect(quote.deliveryNgn).toBe(0);
    expect(quote.totalNgn).toBe(quote.gasFillNgn);
    expect(quote.lines[1]?.label).toMatch(/zone/i);
  });

  it("quoteOrder uses the PH zone fee, not a Lagos metro constant", () => {
    const quote = quoteOrder(17500, "woji");
    expect(quote.deliveryNgn).toBe(getZone("woji")?.feeNgn);
    expect(quote.totalNgn).toBe(17500 + (getZone("woji")?.feeNgn ?? 0));
    expect(quote.zoneName).toBe("Woji");
  });

  it("states under-fill refund later and never a second charge", () => {
    expect(PAYMENT_VARIANCE_COPY).toMatch(/under-fill|underfill|refund/i);
    expect(PAYMENT_VARIANCE_COPY).toMatch(/never charge more/i);
  });

  it("checkout shows gas + zone fee; hub and unset zone are gas only", () => {
    const door = quoteFill({
      fillMode: "full",
      capacityKg: 12.5,
      zoneId: "old-gra",
    });
    const doorLines = visibleQuoteLines(door);
    expect(doorLines.map((line) => line.id)).toEqual(["gas", "delivery"]);
    expect(doorLines[0]?.amountNgn).toBe(door.gasFillNgn);
    expect(doorLines[1]?.amountNgn).toBe(getZone("old-gra")?.feeNgn);

    const hub = applyFulfillmentToQuote(door, "hub");
    expect(hub.deliveryNgn).toBe(0);
    expect(hub.totalNgn).toBe(hub.gasFillNgn);
    expect(visibleQuoteLines(hub).map((line) => line.id)).toEqual(["gas"]);

    const fillStep = quoteFill({ fillMode: "full", capacityKg: 12.5 });
    expect(visibleQuoteLines(fillStep).map((line) => line.id)).toEqual(["gas"]);
  });
});

describe("FeeCeiling", () => {
  it("keeps every PH zone pickup-and-return fee at or below ₦1,200", () => {
    expect(ZONE_FEE_MAX_NGN).toBe(1200);
    expect(ZONE_FEE_MIN_NGN).toBe(600);
    expect(PH_ZONES.length).toBeGreaterThan(0);
    const fees = PH_ZONES.map((zone) => zone.feeNgn);
    expect(Math.min(...fees)).toBe(ZONE_FEE_MIN_NGN);
    expect(Math.max(...fees)).toBe(ZONE_FEE_MAX_NGN);
    for (const zone of PH_ZONES) {
      expect(zone.feeNgn, zone.name).toBeGreaterThanOrEqual(ZONE_FEE_MIN_NGN);
      expect(zone.feeNgn, zone.name).toBeLessThanOrEqual(ZONE_FEE_MAX_NGN);
    }
  });

  it("quotes, Zones list, and checkout read fees from the same PH_ZONES table", () => {
    for (const zone of PH_ZONES) {
      const fill = quoteFill({
        fillMode: "full",
        capacityKg: 12.5,
        zoneId: zone.id,
      });
      expect(fill.deliveryNgn).toBe(zone.feeNgn);
      expect(quoteOrder(10_000, zone.id).deliveryNgn).toBe(zone.feeNgn);
      expect(
        visibleQuoteLines(fill).find((line) => line.id === "delivery")?.amountNgn,
      ).toBe(zone.feeNgn);
    }

    const zoneMap = readFileSync(
      path.resolve(__dirname, "../components/marketing/ZoneMap.tsx"),
      "utf8",
    );
    expect(zoneMap).toMatch(/from ["']@\/config\/pricing["']/);
    expect(zoneMap).toMatch(/PH_ZONES/);
    expect(zoneMap).toMatch(/zone\.feeNgn/);

    const checkout = readFileSync(
      path.resolve(__dirname, "../components/order/CheckoutSummary.tsx"),
      "utf8",
    );
    const paystack = readFileSync(
      path.resolve(__dirname, "../components/order/PriceBreakdown.tsx"),
      "utf8",
    );
    expect(checkout).toMatch(/visibleQuoteLines/);
    expect(paystack).toMatch(/visibleQuoteLines/);
    expect(
      existsSync(path.resolve(__dirname, "../components/admin/ZoneFeeEditor.tsx")),
    ).toBe(false);
  });
});
