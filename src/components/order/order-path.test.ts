import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getZone, quoteFill } from "@/config/pricing";
import { formatNaira } from "@/lib/money";
import {
  PAID_RELIEF_BODY,
  PAID_RELIEF_TITLE,
  PLANT_REFILL_LINE,
  addressStickyHint,
  fillStickyHint,
} from "./order-quote-hint";

const ORDER_DIR = __dirname;

function readOrder(rel: string) {
  return readFileSync(path.join(ORDER_DIR, rel), "utf8");
}

function walkOrderSources(dir = ORDER_DIR, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkOrderSources(full, acc);
    else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith(".test.ts")) {
      acc.push(full);
    }
  }
  return acc;
}

describe("order critical path polish", () => {
  it("keeps free-entered capacity as the SoT — no fixed SKU silhouette catalog", () => {
    const fill = readOrder("FillComposer.tsx");
    expect(fill).toMatch(/Cylinder capacity/);
    expect(fill).toMatch(/type="number"/);
    expect(fill).toMatch(/setCapacityKg/);
    expect(fill).not.toMatch(/CYLINDER_OPTIONS/);
    expect(fill).not.toMatch(/bestFor/);
    expect(fill).not.toMatch(/Typical family|Most Popular|Corporate/);
    expect(fill).not.toMatch(/formatCylinderSize/);
  });

  it("sticky fill hint shows live kg and ₦1,450/kg with an em dash", () => {
    const quote = quoteFill({ fillMode: "full", capacityKg: 12.5 });
    const hint = fillStickyHint(quote);
    expect(hint).toBe(
      `${quote.fillKg} kg at ${formatNaira(quote.rateNgnPerKg)}/kg — ${formatNaira(quote.gasFillNgn)}`,
    );
    expect(hint).toMatch(/1,450/);
    expect(hint).toContain("—");
    expect(hint).not.toMatch(/·/);
    expect(readOrder("FillComposer.tsx")).toMatch(/fillStickyHint/);
  });

  it("address sticky shows door-to-door gas + transport before pay, hub gas only", () => {
    const door = quoteFill({
      fillMode: "full",
      capacityKg: 25,
      zoneId: "old-gra",
    });
    const doorHint = addressStickyHint({
      quote: door,
      fulfillmentMode: "door_to_door",
      hasAddress: true,
      fallback: "hidden",
    });
    expect(doorHint).toBe(
      `Gas ${formatNaira(door.gasFillNgn)} + transport ${formatNaira(door.deliveryNgn)} — ${formatNaira(door.totalNgn)}`,
    );
    expect(door.deliveryNgn).toBe(getZone("old-gra")?.feeNgn);
    expect(doorHint).toMatch(/transport/i);
    expect(doorHint).not.toMatch(/·/);

    expect(
      addressStickyHint({
        quote: door,
        fulfillmentMode: "door_to_door",
        hasAddress: false,
        fallback: "hidden",
      }),
    ).toBe("Select an address to see your zone transport");

    const hubHint = addressStickyHint({
      quote: { ...door, deliveryNgn: 0, totalNgn: door.gasFillNgn },
      fulfillmentMode: "hub",
      hasAddress: true,
      fallback: "hidden",
    });
    expect(hubHint).toBe(`Gas only ${formatNaira(door.gasFillNgn)} — no transport`);
    expect(hubHint).not.toMatch(/·/);

    expect(readOrder("AddressDeliveryForm.tsx")).toMatch(/addressStickyHint/);
    expect(readOrder("AddressDeliveryForm.tsx")).toMatch(/PriceBreakdown/);
    expect(readOrder("AddressDeliveryForm.tsx")).toMatch(/fulfillmentMode/);
  });

  it("says plainly that nothing is filled at the door, and confirmation leads with relief", () => {
    expect(PLANT_REFILL_LINE).toMatch(/Nothing is filled at your door/);
    expect(PAID_RELIEF_TITLE).toBe("You're paid");
    expect(PAID_RELIEF_BODY).toMatch(/collect the empty/);
    expect(PAID_RELIEF_BODY).toMatch(/return it filled/);
    expect(PAID_RELIEF_BODY).toMatch(/Nothing is filled at your door/);

    expect(readOrder("FillComposer.tsx")).toMatch(/PLANT_REFILL_LINE/);
    expect(readOrder("OrderTracking.tsx")).toMatch(/PAID_RELIEF_TITLE/);
    expect(readOrder("OrderTracking.tsx")).toMatch(/PAID_RELIEF_BODY/);
    expect(
      readFileSync(path.resolve(ORDER_DIR, "../../app/(customer)/order/success/page.tsx"), "utf8"),
    ).toMatch(/PAID_RELIEF_TITLE/);
  });

  it("keeps order chrome sentence-case — no ALL-CAPS eyebrows, arrows on every button, or middle-dot meta", () => {
    const sources = walkOrderSources();
    expect(sources.length).toBeGreaterThan(8);
    for (const file of sources) {
      const text = readFileSync(file, "utf8");
      expect(text, file).not.toMatch(/uppercase tracking/);
      expect(text, file).not.toMatch(/tracking-wide/);
      expect(text, file).not.toMatch(/Continue →|Pay now →|Order again →/);
      expect(text, file).not.toMatch(/Gas fill ·|Transport ·|kg · /);
    }
  });
});
