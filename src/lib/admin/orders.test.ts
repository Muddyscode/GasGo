import { describe, expect, it } from "vitest";
import { pinMatches, ADMIN_DEMO_PIN_FALLBACK } from "@/lib/admin/auth";
import { formatFillSummary, getOrdersSnapshot } from "@/lib/admin/orders";

describe("admin demo seed + PIN", () => {
  it("uses the documented demo PIN fallback", () => {
    expect(ADMIN_DEMO_PIN_FALLBACK).toBe("2468");
    expect(pinMatches("2468")).toBe(true);
    expect(pinMatches("0000")).toBe(false);
  });

  it("seeds Port Harcourt zones, not Lagos areas", () => {
    const orders = getOrdersSnapshot();
    expect(orders.length).toBeGreaterThan(0);
    const blob = orders.map((order) => `${order.area} ${order.addressLine}`).join(" ");
    expect(blob).not.toMatch(/Lekki|Yaba|Surulere|Ikeja|Ajah|Maryland|Victoria Island|Gbagada/i);
    expect(blob).toMatch(/Old GRA/);
    expect(blob).toMatch(/Trans-Amadi/);
    expect(orders.every((order) => order.fulfillmentMode && order.pickupDate && order.returnDate && order.windowId)).toBe(true);
    expect(orders.some((order) => order.pickupDate === order.returnDate)).toBe(true);
    expect(formatFillSummary(orders[0]!)).toMatch(/kg fill/i);
  });
});
