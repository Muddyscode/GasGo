import { beforeEach, describe, expect, it } from "vitest";
import { SAVED_ADDRESSES } from "@/config/delivery";
import { defaultOrderDates } from "@/config/fulfillment";
import { LIVE_RATE_NGN_PER_KG, getZone } from "@/config/pricing";
import {
  MOCK_PROFILE,
  activeOrderForUser,
  orderCylinderLabel,
  ordersForUser,
  toCustomerOrder,
} from "@/data/profile";
import { cylinderIdFromDraft } from "@/lib/placed-order";
import {
  CUSTOMER_ORDERS_STORAGE_KEY,
  completePaidCheckout,
  useCustomerOrders,
} from "@/stores/customer-orders";
import { useOrderDraft } from "@/stores/order-draft";
import { useSession } from "@/stores/session";

const chioma = {
  id: "usr_chioma",
  firstName: "Chioma",
  lastName: "Okeke",
  phone: "+2348030000000",
  email: "chioma@guest.gasgo.app",
} as const;

function seedReadyDraft(mode: "door_to_door" | "hub" = "door_to_door") {
  const home = SAVED_ADDRESSES[0];
  const dates = defaultOrderDates();
  useOrderDraft.getState().setCapacityKg(12.5);
  useOrderDraft.getState().setFillMode("full");
  useOrderDraft.getState().setAddress(home);
  useOrderDraft.getState().setPresence("someone-home");
  useOrderDraft.getState().setWindow("asap");
  useOrderDraft.getState().setFulfillmentMode(mode);
  useOrderDraft.getState().setOrderDates(dates.pickupDate, dates.returnDate);
  return dates;
}

describe("paid checkout persists an active order", () => {
  beforeEach(() => {
    localStorage.clear();
    useOrderDraft.getState().clear();
    useCustomerOrders.setState({ orders: [] });
    useSession.setState({ user: null });
  });

  it("signIn does not place an order or clear the draft", () => {
    seedReadyDraft("hub");
    const before = useOrderDraft.getState().quote();

    useSession.getState().signIn(chioma);

    expect(useCustomerOrders.getState().orders).toHaveLength(0);
    expect(useOrderDraft.getState().capacityKg).toBe(12.5);
    expect(useOrderDraft.getState().fulfillmentMode).toBe("hub");
    expect(useOrderDraft.getState().quote().totalNgn).toBe(before.totalNgn);
  });

  it("completePaidCheckout stores queued order then clear()s the draft", () => {
    const dates = seedReadyDraft("door_to_door");
    const quote = useOrderDraft.getState().quote();

    const order = completePaidCheckout({ user: chioma, orderId: "gg_paydoor1" });

    expect(order.stage).toBe("queued");
    expect(order.userId).toBe(chioma.id);
    expect(order.fillSummary).toMatch(/12.5 kg — Full — 12.5 kg fill/);
    expect(order.fillSummary).not.toMatch(/·/);
    expect(order.pickupDate).toBe(dates.pickupDate);
    expect(order.returnDate).toBe(dates.returnDate);
    expect(order.fulfillmentMode).toBe("door_to_door");
    expect(order.gasFillNgn).toBe(Math.round(12.5 * LIVE_RATE_NGN_PER_KG));
    expect(order.deliveryNgn).toBe(getZone("old-gra")?.feeNgn);
    expect(order.totalNgn).toBe(quote.totalNgn);

    expect(useOrderDraft.getState().capacityKg).toBeNull();
    expect(useOrderDraft.getState().address).toBeNull();
    expect(useOrderDraft.getState().quote().fillKg).toBe(0);

    const placed = useCustomerOrders.getState().orders;
    expect(placed).toHaveLength(1);
    expect(activeOrderForUser(chioma.id, placed)?.id).toBe("gg_paydoor1");
    expect(activeOrderForUser(chioma.id, placed)?.status).toBe("queued");

    const raw = localStorage.getItem(CUSTOMER_ORDERS_STORAGE_KEY);
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw ?? "{}") as {
      state?: { orders?: { id?: string; stage?: string }[] };
    };
    expect(parsed.state?.orders?.[0]?.id).toBe("gg_paydoor1");
    expect(parsed.state?.orders?.[0]?.stage).toBe("queued");
  });

  it("free-entered capacity stays the paid label — never an orphan 12.5 SKU", () => {
    const home = SAVED_ADDRESSES[0];
    const dates = defaultOrderDates();
    useOrderDraft.getState().setCapacityKg(15);
    useOrderDraft.getState().setFillMode("full");
    useOrderDraft.getState().setAddress(home);
    useOrderDraft.getState().setPresence("someone-home");
    useOrderDraft.getState().setWindow("asap");
    useOrderDraft.getState().setOrderDates(dates.pickupDate, dates.returnDate);

    expect(useOrderDraft.getState().cylinderId).toBeNull();
    expect(cylinderIdFromDraft(useOrderDraft.getState())).toBe("15");
    expect(cylinderIdFromDraft(useOrderDraft.getState())).not.toBe("12.5");

    const order = completePaidCheckout({ user: chioma, orderId: "gg_pay15" });
    expect(order.capacityKg).toBe(15);
    expect(order.fillKg).toBe(15);
    expect(order.cylinderId).toBe("15");
    expect(order.cylinderId).not.toBe("12.5");
    expect(order.fillSummary).toBe("15 kg — Full — 15 kg fill");
    expect(order.gasFillNgn).toBe(Math.round(15 * LIVE_RATE_NGN_PER_KG));

    const listed = toCustomerOrder(order);
    expect(listed.capacityKg).toBe(15);
    expect(orderCylinderLabel(listed)).toBe("15 kg");
    expect(orderCylinderLabel(listed)).not.toBe("12.5 kg");
  });

  it("hub pay persists ₦0 delivery and still becomes the AppHome active order", () => {
    seedReadyDraft("hub");
    const order = completePaidCheckout({ user: chioma, orderId: "gg_payhub1" });
    expect(order.fulfillmentMode).toBe("hub");
    expect(order.deliveryNgn).toBe(0);
    expect(order.totalNgn).toBe(Math.round(12.5 * LIVE_RATE_NGN_PER_KG));
    expect(activeOrderForUser(chioma.id, useCustomerOrders.getState().orders)?.id).toBe(
      "gg_payhub1",
    );
  });

  it("fresh Tunde has no nav active order until a paid in-flight order exists", () => {
    expect(activeOrderForUser(MOCK_PROFILE.id)).toBeUndefined();
    expect(activeOrderForUser(MOCK_PROFILE.id, [])).toBeUndefined();

    seedReadyDraft();
    completePaidCheckout({
      user: { ...chioma, id: MOCK_PROFILE.id },
      orderId: "gg_tunde_pay",
    });

    const placed = useCustomerOrders.getState().orders;
    expect(activeOrderForUser(MOCK_PROFILE.id, placed)?.id).toBe("gg_tunde_pay");
    expect(activeOrderForUser(MOCK_PROFILE.id, placed)?.orderNumber).not.toBe("GG-1842");

    useCustomerOrders.getState().setStage("gg_tunde_pay", "delivered");
    const archived = useCustomerOrders.getState().orders;
    expect(activeOrderForUser(MOCK_PROFILE.id, archived)).toBeUndefined();
    expect(ordersForUser(MOCK_PROFILE.id, archived).some((order) => order.id === "gg_tunde_pay")).toBe(
      true,
    );
    expect(archived[0]?.stage).toBe("delivered");
  });

  it("setStage only mutates the viewed order", () => {
    seedReadyDraft();
    completePaidCheckout({ user: chioma, orderId: "gg_viewed" });
    useCustomerOrders.getState().place({
      ...useCustomerOrders.getState().orders[0]!,
      id: "gg_other",
      orderNumber: "GG-OTHER",
    });

    useCustomerOrders.getState().setStage("gg_viewed", "en_route");

    const orders = useCustomerOrders.getState().orders;
    expect(orders.find((order) => order.id === "gg_viewed")?.stage).toBe("en_route");
    expect(orders.find((order) => order.id === "gg_other")?.stage).toBe("queued");
  });
});
