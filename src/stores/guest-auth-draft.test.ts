import { beforeEach, describe, expect, it } from "vitest";
import { SAVED_ADDRESSES } from "@/config/delivery";
import { defaultOrderDates } from "@/config/fulfillment";
import { LIVE_RATE_NGN_PER_KG } from "@/config/pricing";
import { ORDER_DRAFT_STORAGE_KEY, useOrderDraft } from "@/stores/order-draft";
import { useSession } from "@/stores/session";

describe("guest draft survives mock signup", () => {
  beforeEach(() => {
    localStorage.clear();
    useOrderDraft.getState().clear();
    useSession.setState({ user: null });
  });

  it("keeps fill + address after signIn and signOut (auth never clear()s the draft)", () => {
    const home = SAVED_ADDRESSES[0];
    useOrderDraft.getState().setCapacityKg(12.5);
    useOrderDraft.getState().setFillMode("full");
    useOrderDraft.getState().setAddress(home);
    useOrderDraft.getState().setPresence("someone-home");

    const before = useOrderDraft.getState().quote();
    expect(useOrderDraft.getState().capacityKg).toBe(12.5);
    expect(before.gasFillNgn).toBe(Math.round(12.5 * LIVE_RATE_NGN_PER_KG));
    expect(before.deliveryNgn).toBe(1500);
    expect(useOrderDraft.getState().isReadyForCheckout()).toBe(true);

    useSession.getState().signIn({
      id: "usr_chioma",
      firstName: "Chioma",
      lastName: "Okeke",
      phone: "+2348030000000",
      email: "chioma@guest.gasgo.app",
    });

    expect(useSession.getState().user?.firstName).toBe("Chioma");
    expect(useOrderDraft.getState().capacityKg).toBe(12.5);
    expect(useOrderDraft.getState().fillMode).toBe("full");
    expect(useOrderDraft.getState().address?.zoneId).toBe("old-gra");
    expect(useOrderDraft.getState().presenceId).toBe("someone-home");
    expect(useOrderDraft.getState().quote().totalNgn).toBe(before.totalNgn);

    useSession.getState().signOut();
    expect(useSession.getState().user).toBeNull();
    expect(useOrderDraft.getState().capacityKg).toBe(12.5);
    expect(useOrderDraft.getState().address?.line).toBe(home.line);
  });

  it("persists Architect key gasgo-order-draft with live quote fields", () => {
    useOrderDraft.getState().setCapacityKg(6);
    useOrderDraft.getState().setFillMode("kg");
    useOrderDraft.getState().setFillKg(4);

    expect(ORDER_DRAFT_STORAGE_KEY).toBe("gasgo-order-draft");
    const raw = localStorage.getItem(ORDER_DRAFT_STORAGE_KEY);
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw ?? "{}") as {
      state?: {
        capacityKg?: number;
        fillMode?: string;
        fillKg?: number;
        rateNgnPerKg?: number;
      };
    };
    expect(parsed.state?.capacityKg).toBe(6);
    expect(parsed.state?.fillMode).toBe("kg");
    expect(parsed.state?.fillKg).toBe(4);
    expect(parsed.state?.rateNgnPerKg).toBe(LIVE_RATE_NGN_PER_KG);
  });

  it("persists fulfillmentMode + pickupDate + returnDate and zeros hub delivery", () => {
    const home = SAVED_ADDRESSES[0];
    const dates = defaultOrderDates();
    useOrderDraft.getState().setCapacityKg(12.5);
    useOrderDraft.getState().setFillMode("full");
    useOrderDraft.getState().setAddress(home);
    useOrderDraft.getState().setFulfillmentMode("hub");
    useOrderDraft.getState().setPickupDate(dates.pickupDate);
    useOrderDraft.getState().setReturnDate(dates.returnDate);

    expect(useOrderDraft.getState().fulfillmentMode).toBe("hub");
    expect(useOrderDraft.getState().quote().deliveryNgn).toBe(0);
    expect(useOrderDraft.getState().quote().totalNgn).toBe(
      Math.round(12.5 * LIVE_RATE_NGN_PER_KG),
    );
    expect(useOrderDraft.getState().isReadyForCheckout()).toBe(true);

    const raw = localStorage.getItem(ORDER_DRAFT_STORAGE_KEY);
    const parsed = JSON.parse(raw ?? "{}") as {
      state?: {
        fulfillmentMode?: string;
        pickupDate?: string;
        returnDate?: string;
      };
    };
    expect(parsed.state?.fulfillmentMode).toBe("hub");
    expect(parsed.state?.pickupDate).toBe(dates.pickupDate);
    expect(parsed.state?.returnDate).toBe(dates.returnDate);

    useSession.getState().signIn({
      id: "usr_hub",
      firstName: "Hub",
      lastName: "Guest",
      phone: "+2348011111111",
      email: "hub@guest.gasgo.app",
    });
    expect(useOrderDraft.getState().fulfillmentMode).toBe("hub");
    expect(useOrderDraft.getState().pickupDate).toBe(dates.pickupDate);
  });

  it("checkout review payload has fill mode, kg, live ₦/kg, gas, delivery/hub, dates, window, fulfillment", () => {
    const home = SAVED_ADDRESSES[0];
    const dates = defaultOrderDates();
    useOrderDraft.getState().setCapacityKg(12.5);
    useOrderDraft.getState().setFillMode("full");
    useOrderDraft.getState().setAddress(home);
    useOrderDraft.getState().setPresence("someone-home");
    useOrderDraft.getState().setWindow("morning");
    useOrderDraft.getState().setFulfillmentMode("door_to_door");
    useOrderDraft.getState().setOrderDates(dates.pickupDate, dates.returnDate);

    const door = useOrderDraft.getState();
    const doorQuote = door.quote();
    expect(doorQuote.fillMode).toBe("full");
    expect(doorQuote.fillKg).toBe(12.5);
    expect(doorQuote.rateNgnPerKg).toBe(LIVE_RATE_NGN_PER_KG);
    expect(doorQuote.lines[0]).toMatchObject({
      id: "gas",
      amountNgn: Math.round(12.5 * LIVE_RATE_NGN_PER_KG),
    });
    expect(doorQuote.lines[0]?.label).toMatch(/gas fill/i);
    expect(doorQuote.lines[1]?.id).toBe("delivery");
    expect(doorQuote.lines[1]?.amountNgn).toBe(1500);
    expect(door.pickupDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(door.returnDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(door.windowId).toBe("morning");
    expect(door.fulfillmentMode).toBe("door_to_door");

    useOrderDraft.getState().setFulfillmentMode("hub");
    const hubQuote = useOrderDraft.getState().quote();
    expect(hubQuote.lines[1]?.amountNgn).toBe(0);
    expect(hubQuote.lines[1]?.label).toMatch(/hub self-serve/i);
    expect(useOrderDraft.getState().fulfillmentMode).toBe("hub");
  });
});
