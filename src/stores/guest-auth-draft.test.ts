import { beforeEach, describe, expect, it } from "vitest";
import { SAVED_ADDRESSES } from "@/config/delivery";
import { LIVE_RATE_NGN_PER_KG } from "@/config/pricing";
import { ORDER_DRAFT_STORAGE_KEY, useOrderDraft } from "@/stores/order-draft";
import { useSession } from "@/stores/session";

describe("guest draft survives mock signup", () => {
  beforeEach(() => {
    localStorage.clear();
    useOrderDraft.setState({
      cylinderId: null,
      quantity: 1,
      capacityKg: null,
      fillMode: "full",
      fillKg: null,
      spendNaira: null,
      rateNgnPerKg: LIVE_RATE_NGN_PER_KG,
      address: null,
      presenceId: null,
      windowId: "asap",
      notes: "",
    });
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
});
