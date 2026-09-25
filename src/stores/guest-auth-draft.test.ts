import { readFileSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { SAVED_ADDRESSES } from "@/config/delivery";
import { defaultOrderDates } from "@/config/fulfillment";
import { LIVE_RATE_NGN_PER_KG, getZone } from "@/config/pricing";
import { guestSessionUser } from "@/lib/session-user";
import { ORDER_DRAFT_STORAGE_KEY, useOrderDraft } from "@/stores/order-draft";
import { useSession } from "@/stores/session";
import { completePaidCheckout, useCustomerOrders } from "@/stores/customer-orders";

const AUTH_DIR = path.resolve(__dirname, "../components/auth");

function readAuth(rel: string) {
  return readFileSync(path.join(AUTH_DIR, rel), "utf8");
}

function seedReadyDraft() {
  const home = SAVED_ADDRESSES[0];
  const dates = defaultOrderDates();
  useOrderDraft.getState().setCapacityKg(15);
  useOrderDraft.getState().setFillMode("full");
  useOrderDraft.getState().setAddress(home);
  useOrderDraft.getState().setPresence("someone-home");
  useOrderDraft.getState().setWindow("asap");
  useOrderDraft.getState().setOrderDates(dates.pickupDate, dates.returnDate);
  return { home, dates, quote: useOrderDraft.getState().quote() };
}

describe("guest draft survives mock signup", () => {
  beforeEach(() => {
    localStorage.clear();
    useOrderDraft.getState().clear();
    useCustomerOrders.setState({ orders: [] });
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
    expect(before.deliveryNgn).toBe(getZone("old-gra")?.feeNgn);
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

  it("auth modal, /signup page, and session never call draft clear()", () => {
    for (const rel of [
      "AuthModal.tsx",
      "AuthEntryView.tsx",
      "AuthIdentityForm.tsx",
      "AuthProvider.tsx",
    ]) {
      const text = readAuth(rel);
      expect(text, rel).not.toMatch(/clear\(/);
      expect(text, rel).not.toMatch(/useOrderDraft\.getState\(\)\.clear/);
    }
    const session = readFileSync(path.resolve(__dirname, "session.ts"), "utf8");
    expect(session).not.toMatch(/useOrderDraft/);
    expect(session).not.toMatch(/clear\(/);
    expect(session).toMatch(/signIn \/ signOut must never touch the order draft/);

    const modal = readAuth("AuthModal.tsx");
    const entry = readAuth("AuthEntryView.tsx");
    const form = readAuth("AuthIdentityForm.tsx");
    expect(form).toMatch(/guestSessionUser/);
    expect(modal).toMatch(/AuthIdentityForm/);
    expect(modal).toMatch(/signIn\(user\)/);
    expect(modal).toMatch(/FadeLift/);
    expect(modal).toMatch(/createPortal/);
    expect(modal).toMatch(/OVERLAY_SCRIM_45_CLASS/);
    expect(modal).not.toMatch(/bg-ink\/45/);
    expect(readFileSync(path.resolve(__dirname, "../lib/overlay.ts"), "utf8")).toMatch(
      /color-mix\(in_srgb,var\(--gasgo-ink\)_45%,transparent\)/,
    );
    expect(entry).toMatch(/AuthIdentityForm/);
    expect(entry).toMatch(/signIn\(user\)/);
    expect(readFileSync(path.resolve(__dirname, "../app/(customer)/signup/page.tsx"), "utf8")).toMatch(
      /AuthEntryView/,
    );
  });

  it("checkout signup modal identity capture keeps gasgo-order-draft", () => {
    const { quote } = seedReadyDraft();
    expect(useOrderDraft.getState().isReadyForCheckout()).toBe(true);

    const user = guestSessionUser({
      firstName: "Chioma Okeke",
      phone: "08030000000",
      email: "chioma@guest.gasgo.app",
    });
    useSession.getState().signIn(user);

    expect(useSession.getState().user?.firstName).toBe("Chioma");
    expect(useSession.getState().user?.lastName).toBe("Okeke");
    expect(useOrderDraft.getState().capacityKg).toBe(15);
    expect(useOrderDraft.getState().address?.zoneId).toBe("old-gra");
    expect(useOrderDraft.getState().quote().totalNgn).toBe(quote.totalNgn);
    expect(localStorage.getItem(ORDER_DRAFT_STORAGE_KEY)).toBeTruthy();
    expect(JSON.parse(localStorage.getItem(ORDER_DRAFT_STORAGE_KEY) ?? "{}").state?.capacityKg).toBe(
      15,
    );
  });

  it("/signup page identity capture keeps gasgo-order-draft through sign-out", () => {
    const { home, quote } = seedReadyDraft();
    const user = guestSessionUser({
      firstName: "Adaeze Nwosu",
      phone: "08081112222",
      email: "",
    });
    useSession.getState().signIn(user);

    expect(useSession.getState().user?.firstName).toBe("Adaeze");
    expect(useOrderDraft.getState().capacityKg).toBe(15);
    expect(useOrderDraft.getState().isReadyForCheckout()).toBe(true);
    expect(useOrderDraft.getState().quote().totalNgn).toBe(quote.totalNgn);

    useSession.getState().signOut();
    expect(useSession.getState().user).toBeNull();
    expect(useOrderDraft.getState().capacityKg).toBe(15);
    expect(useOrderDraft.getState().address?.line).toBe(home.line);
    expect(useOrderDraft.getState().quote().totalNgn).toBe(quote.totalNgn);
  });

  it("only a completed pay clear()s the draft — signIn and signOut do not", () => {
    seedReadyDraft();
    const before = useOrderDraft.getState().quote().totalNgn;
    useSession.getState().signIn(
      guestSessionUser({ firstName: "Tunde Adebayo", phone: "08034412291", email: "" }),
    );
    useSession.getState().signOut();
    useSession.getState().signIn(
      guestSessionUser({ firstName: "Tunde Adebayo", phone: "08034412291", email: "" }),
    );
    expect(useOrderDraft.getState().capacityKg).toBe(15);
    expect(useOrderDraft.getState().quote().totalNgn).toBe(before);

    completePaidCheckout({
      user: useSession.getState().user!,
      orderId: "gg_pay_clears_draft",
    });
    expect(useOrderDraft.getState().capacityKg).toBeNull();
    expect(useOrderDraft.getState().address).toBeNull();
    expect(useOrderDraft.getState().quote().fillKg).toBe(0);
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
    expect(doorQuote.lines[1]?.amountNgn).toBe(getZone("old-gra")?.feeNgn);
    expect(door.pickupDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(door.returnDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(door.windowId).toBe("morning");
    expect(door.fulfillmentMode).toBe("door_to_door");

    useOrderDraft.getState().setFulfillmentMode("hub");
    const hubQuote = useOrderDraft.getState().quote();
    expect(hubQuote.lines[1]?.amountNgn).toBe(0);
    expect(hubQuote.lines[1]?.label).toMatch(/hub self-collect/i);
    expect(useOrderDraft.getState().fulfillmentMode).toBe("hub");
  });
});
