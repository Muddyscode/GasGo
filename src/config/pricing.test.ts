import { describe, expect, it } from "vitest";
import {
  LIVE_RATE_NGN_PER_KG,
  PAYMENT_VARIANCE_COPY,
  quoteFill,
  quoteOrder,
  resolveFillKg,
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
    expect(quote.deliveryNgn).toBe(1500);
    expect(quote.totalNgn).toBe(quote.gasFillNgn + 1500);
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
    expect(capped.deliveryNgn).toBe(2500);
  });

  it("does not invent a Lagos flat fee when the zone is unknown", () => {
    const quote = quoteFill({ fillMode: "full", capacityKg: 12.5 });
    expect(quote.deliveryNgn).toBe(0);
    expect(quote.totalNgn).toBe(quote.gasFillNgn);
    expect(quote.lines[1]?.label).toMatch(/zone/i);
  });

  it("quoteOrder uses the PH zone fee, not a Lagos metro constant", () => {
    const quote = quoteOrder(17500, "woji");
    expect(quote.deliveryNgn).toBe(2000);
    expect(quote.totalNgn).toBe(19500);
    expect(quote.zoneName).toBe("Woji");
  });

  it("states under-fill refund later and never a second charge", () => {
    expect(PAYMENT_VARIANCE_COPY).toMatch(/under-fill|underfill|refund/i);
    expect(PAYMENT_VARIANCE_COPY).toMatch(/never charge more/i);
  });
});
