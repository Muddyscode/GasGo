import { describe, expect, it } from "vitest";
import {
  MOCK_ORDERS,
  MOCK_PROFILE,
  activeOrderForUser,
  ordersForUser,
} from "@/data/profile";
import type { PlacedOrder } from "@/lib/placed-order";

const FORBIDDEN_GEO = /Lagos|Lekki|Yaba|Ikeja|Surulere/i;

function fakePlaced(overrides: Partial<PlacedOrder> = {}): PlacedOrder {
  return {
    id: "gg_live1",
    userId: MOCK_PROFILE.id,
    orderNumber: "GG-LIVE1",
    stage: "queued",
    cylinderId: "12.5",
    fillMode: "full",
    fillKg: 12.5,
    capacityKg: 12.5,
    rateNgnPerKg: 1400,
    gasFillNgn: 17500,
    deliveryNgn: 1500,
    totalNgn: 19000,
    fillSummary: "12.5 kg · Full · 12.5 kg fill",
    fulfillmentMode: "door_to_door",
    pickupDate: "2026-09-21",
    returnDate: "2026-09-21",
    windowId: "asap",
    addressId: "home",
    addressLabel: "Home",
    addressLine: "12 Forces Avenue, Old GRA",
    zoneId: "old-gra",
    presenceId: "someone-home",
    notes: "",
    placedAt: "2026-09-21T09:00:00.000Z",
    ...overrides,
  };
}

describe("demo order history vs nav active order", () => {
  it("keeps MOCK_ORDERS as delivered Port Harcourt history, never an in-flight seed", () => {
    expect(MOCK_ORDERS.length).toBeGreaterThan(0);
    expect(MOCK_ORDERS.every((order) => order.status === "delivered")).toBe(true);
    expect(MOCK_ORDERS.some((order) => order.orderNumber === "GG-1842")).toBe(true);

    const blob = MOCK_ORDERS.map((order) => `${order.addressId} ${order.orderNumber}`).join(" ");
    expect(blob).not.toMatch(FORBIDDEN_GEO);
  });

  it("activeOrderForUser never falls back to MOCK_ORDERS", () => {
    expect(activeOrderForUser(MOCK_PROFILE.id)).toBeUndefined();
    expect(activeOrderForUser(MOCK_PROFILE.id, [])).toBeUndefined();
    expect(ordersForUser(MOCK_PROFILE.id).some((order) => order.orderNumber === "GG-1842")).toBe(
      true,
    );
  });

  it("badge source is only a real non-terminal placed order", () => {
    const live = fakePlaced({ stage: "en_route" });
    expect(activeOrderForUser(MOCK_PROFILE.id, [live])?.id).toBe("gg_live1");
    expect(activeOrderForUser(MOCK_PROFILE.id, [fakePlaced({ stage: "delivered" })])).toBeUndefined();
    expect(
      activeOrderForUser(MOCK_PROFILE.id, [fakePlaced({ stage: "attempt_failed" })]),
    ).toBeUndefined();
    expect(activeOrderForUser("someone-else", [live])).toBeUndefined();
  });
});
