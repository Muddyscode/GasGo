import {
  DEFAULT_DELIVERY_WINDOW,
  type DeliveryWindowId,
} from "@/config/delivery";
import {
  CUSTOMER_DELIVERY_STAGE_IDS,
  type DeliveryStageId,
} from "@/config/delivery-stages";
import {
  defaultOrderDates,
  formatLagosDate,
  isValidIsoDate,
} from "@/config/fulfillment";
import { getProfileOrderById } from "@/data/profile";
import { getOrdersSnapshot } from "@/lib/admin/orders";
import type { PlacedOrder } from "@/lib/placed-order";

export type LateKind = "handover_failed" | "behind_schedule";

export type TrackingLateState = {
  late: boolean;
  lateKind: LateKind | null;
};

export type TrackingOrder = {
  id: string;
  orderNumber: string;
  stageId: DeliveryStageId;
  timelineStageId: Exclude<DeliveryStageId, "attempt_failed">;
  pickupDate: string | null;
  returnDate: string | null;
  windowId: DeliveryWindowId | null;
  late: boolean;
  lateKind: LateKind | null;
};

export const LATE_TRACKING_COPY = {
  eyebrow: "We’re late",
  handoverFailed: {
    title: "Handover didn’t complete",
    body: "We’re late — the rider couldn’t finish this return. The empty was collected for a plant refill, but the filled cylinder didn’t make it back. WhatsApp is the fastest way to arrange a retry.",
  },
  behindSchedule: {
    title: "This refill is behind",
    body: "We’re late — here’s what we know. We’re past the return window we gave you, and the cylinder is still in the plant refill. WhatsApp us and we’ll tell you exactly where it is.",
  },
} as const;

/**
 * Unknown checkout ids start at queued — never a hashed `en_route`.
 * Paid overlay / admin / profile seeds still win when they exist.
 */
export function demoStageForOrderId(_orderId: string): DeliveryStageId {
  return "queued";
}

/** Happy-path plant loop for the demo stepper. Failed handover does not skip to delivered. */
export function nextPlantLoopStage(stage: DeliveryStageId): DeliveryStageId | null {
  if (stage === "attempt_failed" || stage === "delivered") return null;
  const index = CUSTOMER_DELIVERY_STAGE_IDS.indexOf(stage);
  if (index < 0 || index >= CUSTOMER_DELIVERY_STAGE_IDS.length - 1) return null;
  return CUSTOMER_DELIVERY_STAGE_IDS[index + 1] ?? null;
}

export function resetPlantLoopStage(): DeliveryStageId {
  return "queued";
}

export function timelineStageId(
  stageId: DeliveryStageId,
): Exclude<DeliveryStageId, "attempt_failed"> {
  if (stageId === "attempt_failed") return "nearby";
  return stageId;
}

/** Customer timeline index. A failed handover sits on the return step, not past delivered. */
export function customerTimelineIndex(stageId: DeliveryStageId): number {
  const id = timelineStageId(stageId);
  const index = CUSTOMER_DELIVERY_STAGE_IDS.indexOf(id);
  return index < 0 ? 0 : index;
}

export function isTrackingLate(
  input: {
    stageId: DeliveryStageId;
    pickupDate?: string | null;
    returnDate?: string | null;
  },
  now = new Date(),
): TrackingLateState {
  if (input.stageId === "delivered") {
    return { late: false, lateKind: null };
  }
  if (input.stageId === "attempt_failed") {
    return { late: true, lateKind: "handover_failed" };
  }

  const today = formatLagosDate(now);
  if (input.returnDate && isValidIsoDate(input.returnDate) && input.returnDate < today) {
    return { late: true, lateKind: "behind_schedule" };
  }
  if (
    input.pickupDate &&
    isValidIsoDate(input.pickupDate) &&
    input.pickupDate < today &&
    (input.stageId === "queued" || input.stageId === "rider_assigned")
  ) {
    return { late: true, lateKind: "behind_schedule" };
  }

  return { late: false, lateKind: null };
}

export function resolveTrackingOrder(
  orderId: string,
  now = new Date(),
): TrackingOrder {
  const admin = getOrdersSnapshot().find(
    (order) => order.id === orderId || order.orderNumber === orderId,
  );
  if (admin) {
    return toTrackingOrder({
      id: admin.id,
      orderNumber: admin.orderNumber,
      stageId: admin.stage,
      pickupDate: admin.pickupDate,
      returnDate: admin.returnDate,
      windowId: admin.windowId,
      now,
    });
  }

  const profile = getProfileOrderById(orderId);
  if (profile) {
    return toTrackingOrder({
      id: profile.id,
      orderNumber: profile.orderNumber,
      stageId: profile.status,
      pickupDate: profile.pickupDate ?? null,
      returnDate: profile.returnDate ?? null,
      windowId: profile.windowId ?? null,
      now,
    });
  }

  const dates = defaultOrderDates(now);
  return toTrackingOrder({
    id: orderId,
    orderNumber: orderId,
    stageId: demoStageForOrderId(orderId),
    pickupDate: dates.pickupDate,
    returnDate: dates.returnDate,
    windowId: DEFAULT_DELIVERY_WINDOW,
    now,
  });
}

/** Paid checkout hydration: a persisted placed order wins for that id. */
export function overlayPlacedTrackingOrder(
  resolved: TrackingOrder,
  placed:
    | Pick<
        PlacedOrder,
        "id" | "orderNumber" | "stage" | "pickupDate" | "returnDate" | "windowId"
      >
    | undefined,
  now = new Date(),
): TrackingOrder {
  if (!placed) return resolved;
  return toTrackingOrder({
    id: placed.id,
    orderNumber: placed.orderNumber,
    stageId: placed.stage,
    pickupDate: placed.pickupDate,
    returnDate: placed.returnDate,
    windowId: placed.windowId,
    now,
  });
}

function toTrackingOrder(input: {
  id: string;
  orderNumber: string;
  stageId: DeliveryStageId;
  pickupDate: string | null;
  returnDate: string | null;
  windowId: DeliveryWindowId | null;
  now: Date;
}): TrackingOrder {
  const lateState = isTrackingLate(
    {
      stageId: input.stageId,
      pickupDate: input.pickupDate,
      returnDate: input.returnDate,
    },
    input.now,
  );

  return {
    id: input.id,
    orderNumber: input.orderNumber,
    stageId: input.stageId,
    timelineStageId: timelineStageId(input.stageId),
    pickupDate: input.pickupDate,
    returnDate: input.returnDate,
    windowId: input.windowId,
    late: lateState.late,
    lateKind: lateState.lateKind,
  };
}
