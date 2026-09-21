import { describe, expect, it } from "vitest";
import { CUSTOMER_DELIVERY_STAGES, getDeliveryStage } from "@/config/delivery-stages";
import {
  SAME_DAY_CUSTOMER_REMINDER,
  addIsoDays,
  formatLagosDate,
  isSameDayLoop,
} from "@/config/fulfillment";
import { whatsappLateUrl, whatsappSupportUrl } from "@/config/whatsapp";
import { getOrdersSnapshot } from "@/lib/admin/orders";
import {
  LATE_TRACKING_COPY,
  customerTimelineIndex,
  demoStageForOrderId,
  isTrackingLate,
  nextPlantLoopStage,
  overlayPlacedTrackingOrder,
  resetPlantLoopStage,
  resolveTrackingOrder,
} from "@/lib/tracking-stage";

const BEFORE_CUTOFF = new Date("2026-09-21T18:00:00.000Z");
const TODAY = "2026-09-21";
const YESTERDAY = "2026-09-20";

describe("customer plant-loop tracking copy", () => {
  it("gives every stage a now and a next, with no Lagos and no doorstep fill", () => {
    expect(CUSTOMER_DELIVERY_STAGES.length).toBe(6);
    const blob = CUSTOMER_DELIVERY_STAGES.map(
      (stage) => `${stage.title} ${stage.detail} ${stage.now} ${stage.next}`,
    ).join(" ");

    expect(blob).not.toMatch(/Lagos/i);
    expect(blob).not.toMatch(/doorstep|fill at your door|street fill/i);

    for (const stage of CUSTOMER_DELIVERY_STAGES) {
      expect(stage.now.trim().length).toBeGreaterThan(8);
      expect(stage.next.trim().length).toBeGreaterThan(8);
    }

    const plant = CUSTOMER_DELIVERY_STAGES.find((stage) => stage.id === "picked_up");
    expect(plant?.now).toMatch(/plant/i);
    expect(plant?.detail).toMatch(/plant|offsite/i);

    const collect = CUSTOMER_DELIVERY_STAGES.find((stage) => stage.id === "rider_assigned");
    expect(`${collect?.now} ${collect?.detail}`).toMatch(/empty/i);

    const returning = CUSTOMER_DELIVERY_STAGES.find((stage) => stage.id === "en_route");
    expect(`${returning?.now} ${returning?.detail}`).toMatch(/filled/i);
  });

  it("keeps attempt_failed on the return step instead of marking the loop delivered", () => {
    expect(customerTimelineIndex("nearby")).toBe(4);
    expect(customerTimelineIndex("delivered")).toBe(5);
    expect(customerTimelineIndex("attempt_failed")).toBe(customerTimelineIndex("nearby"));
    expect(customerTimelineIndex("attempt_failed")).toBeLessThan(customerTimelineIndex("delivered"));
  });
});

describe("late / behind-schedule detection", () => {
  it("treats a failed handover as late", () => {
    expect(
      isTrackingLate(
        { stageId: "attempt_failed", pickupDate: TODAY, returnDate: TODAY },
        BEFORE_CUTOFF,
      ),
    ).toEqual({ late: true, lateKind: "handover_failed" });
  });

  it("is honest when the return date has passed and the cylinder is not back", () => {
    expect(
      isTrackingLate(
        { stageId: "en_route", pickupDate: YESTERDAY, returnDate: YESTERDAY },
        BEFORE_CUTOFF,
      ),
    ).toEqual({ late: true, lateKind: "behind_schedule" });
  });

  it("is not late when the filled cylinder is already back", () => {
    expect(
      isTrackingLate(
        { stageId: "delivered", pickupDate: YESTERDAY, returnDate: YESTERDAY },
        BEFORE_CUTOFF,
      ),
    ).toEqual({ late: false, lateKind: null });
  });

  it("is on time during an in-progress same-day loop", () => {
    expect(
      isTrackingLate(
        { stageId: "nearby", pickupDate: TODAY, returnDate: TODAY },
        BEFORE_CUTOFF,
      ),
    ).toEqual({ late: false, lateKind: null });
  });

  it("uses late copy that admits delay and points to WhatsApp, without Lagos", () => {
    const blob = `${LATE_TRACKING_COPY.eyebrow} ${LATE_TRACKING_COPY.handoverFailed.title} ${LATE_TRACKING_COPY.handoverFailed.body} ${LATE_TRACKING_COPY.behindSchedule.title} ${LATE_TRACKING_COPY.behindSchedule.body}`;
    expect(blob).not.toMatch(/Lagos/i);
    expect(blob).toMatch(/late|behind|didn't complete|did not complete/i);
    expect(blob).toMatch(/WhatsApp/i);
    expect(LATE_TRACKING_COPY.behindSchedule.body).toMatch(/know/i);
  });
});

describe("resolveTrackingOrder", () => {
  it("hydrates admin seed orders with stage, window, and dates", () => {
    const seed = getOrdersSnapshot().find((order) => order.id === "GG-20260919-0042");
    expect(seed).toBeTruthy();
    const view = resolveTrackingOrder("GG-20260919-0042", BEFORE_CUTOFF);
    expect(view.orderNumber).toBe("GG-20260919-0042");
    expect(view.stageId).toBe("nearby");
    expect(view.windowId).toBe("asap");
    expect(view.pickupDate).toBe(seed?.pickupDate);
    expect(view.returnDate).toBe(seed?.returnDate);
    expect(view.late).toBe(false);
    expect(isSameDayLoop(view.pickupDate!, view.returnDate!)).toBe(true);
  });

  it("marks the failed-handover seed as late", () => {
    const view = resolveTrackingOrder("GG-20260919-0024", BEFORE_CUTOFF);
    expect(view.stageId).toBe("attempt_failed");
    expect(view.late).toBe(true);
    expect(view.lateKind).toBe("handover_failed");
    expect(view.timelineStageId).toBe("nearby");
  });

  it("treats the GG-1842 mock as delivered history, not a live loop", () => {
    const view = resolveTrackingOrder("gg_phgra9k2a", BEFORE_CUTOFF);
    expect(view.stageId).toBe("delivered");
    expect(view.late).toBe(false);
  });

  it("falls back to queued (not a hashed en_route) for unknown checkout ids", () => {
    const view = resolveTrackingOrder("gg_brandnewpay", BEFORE_CUTOFF);
    expect(demoStageForOrderId("gg_brandnewpay")).toBe("queued");
    expect(demoStageForOrderId("")).toBe("queued");
    expect(view.stageId).toBe("queued");
    expect(view.pickupDate).toBe(TODAY);
    expect(view.returnDate).toBe(TODAY);
    expect(view.windowId).toBe("asap");
    expect(view.late).toBe(false);
    expect(getDeliveryStage(view.stageId)?.now).toBeTruthy();
  });

  it("does not invent a past return as on-time when the date already lapsed", () => {
    const view = resolveTrackingOrder("GG-20260919-0024", new Date("2026-09-23T10:00:00.000Z"));
    expect(view.late).toBe(true);
  });

  it("lets a paid placed order overlay demo fallback for checkout ids", () => {
    const resolved = resolveTrackingOrder("gg_paydoor1", BEFORE_CUTOFF);
    const view = overlayPlacedTrackingOrder(
      resolved,
      {
        id: "gg_paydoor1",
        orderNumber: "GG-PAYDOOR",
        stage: "queued",
        pickupDate: TODAY,
        returnDate: TODAY,
        windowId: "asap",
      },
      BEFORE_CUTOFF,
    );
    expect(view.id).toBe("gg_paydoor1");
    expect(view.orderNumber).toBe("GG-PAYDOOR");
    expect(view.stageId).toBe("queued");
    expect(view.pickupDate).toBe(TODAY);
    expect(view.returnDate).toBe(TODAY);
    expect(view.windowId).toBe("asap");
    expect(view.late).toBe(false);
  });

  it("recomputes late from the placed order’s return date", () => {
    const resolved = resolveTrackingOrder("gg_paylate1", BEFORE_CUTOFF);
    const view = overlayPlacedTrackingOrder(
      resolved,
      {
        id: "gg_paylate1",
        orderNumber: "GG-PAYLATE",
        stage: "en_route",
        pickupDate: YESTERDAY,
        returnDate: YESTERDAY,
        windowId: "asap",
      },
      BEFORE_CUTOFF,
    );
    expect(view.late).toBe(true);
    expect(view.lateKind).toBe("behind_schedule");
  });
});

describe("demo plant-loop stepper", () => {
  it("walks empty pickup → plant → return → delivered, then stops", () => {
    expect(resetPlantLoopStage()).toBe("queued");
    expect(nextPlantLoopStage("queued")).toBe("rider_assigned");
    expect(nextPlantLoopStage("rider_assigned")).toBe("picked_up");
    expect(nextPlantLoopStage("picked_up")).toBe("en_route");
    expect(nextPlantLoopStage("en_route")).toBe("nearby");
    expect(nextPlantLoopStage("nearby")).toBe("delivered");
    expect(nextPlantLoopStage("delivered")).toBeNull();
  });

  it("does not auto-advance a failed handover into delivered", () => {
    expect(nextPlantLoopStage("attempt_failed")).toBeNull();
  });
});

describe("same-day reminder + WhatsApp", () => {
  it("reuses the fulfillment same-day reminder", () => {
    expect(SAME_DAY_CUSTOMER_REMINDER).toMatch(/same day/i);
    expect(isSameDayLoop(TODAY, TODAY)).toBe(true);
    expect(isSameDayLoop(TODAY, addIsoDays(TODAY, 1))).toBe(false);
    expect(formatLagosDate(BEFORE_CUTOFF)).toBe(TODAY);
  });

  it("makes WhatsApp the late support deep-link", () => {
    const late = whatsappLateUrl("GG-20260919-0024");
    expect(late).toContain("wa.me/");
    expect(late).toContain(encodeURIComponent("GG-20260919-0024"));
    expect(decodeURIComponent(late)).toMatch(/late/i);
    expect(decodeURIComponent(late)).not.toMatch(/Lagos/i);
    expect(whatsappSupportUrl("GG-1842")).toContain("GG-1842");
  });
});
