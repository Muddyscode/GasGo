/**
 * GasGo delivery stages — Architect contract.
 * Order: queued → rider_assigned → picked_up → en_route → nearby → delivered → attempt_failed
 * `attempt_failed` is admin-facing; customer Tracking uses the success path through `delivered`.
 */
export const DELIVERY_STAGE_IDS = [
  "queued",
  "rider_assigned",
  "picked_up",
  "en_route",
  "nearby",
  "delivered",
  "attempt_failed",
] as const;

export type DeliveryStageId = (typeof DELIVERY_STAGE_IDS)[number];

export type DeliveryStage = {
  id: DeliveryStageId;
  title: string;
  detail: string;
};

export const DELIVERY_STAGES: readonly DeliveryStage[] = [
  {
    id: "queued",
    title: "Order queued",
    detail: "We’ve got your order and we’re assigning a rider.",
  },
  {
    id: "rider_assigned",
    title: "Rider assigned",
    detail: "Your rider is heading out to collect your empty cylinder.",
  },
  {
    id: "picked_up",
    title: "Cylinder picked up",
    detail: "Empty collected — off to the plant for an offsite refill.",
  },
  {
    id: "en_route",
    title: "On the way",
    detail: "Your filled cylinder is on the way back from the plant.",
  },
  {
    id: "nearby",
    title: "Nearby",
    detail: "Rider is close with your filled cylinder — get ready to receive.",
  },
  {
    id: "delivered",
    title: "Delivered",
    detail: "Filled cylinder is back. Enjoy your cook.",
  },
  {
    id: "attempt_failed",
    title: "Attempt failed",
    detail: "Rider could not complete handover. Retry or call the customer.",
  },
] as const;

/** Success path shown on customer Tracking. `attempt_failed` stays on the admin board. */
export const CUSTOMER_DELIVERY_STAGE_IDS = DELIVERY_STAGE_IDS.filter(
  (id): id is Exclude<DeliveryStageId, "attempt_failed"> => id !== "attempt_failed",
);

export const CUSTOMER_DELIVERY_STAGES: readonly DeliveryStage[] = DELIVERY_STAGES.filter(
  (stage) => stage.id !== "attempt_failed",
);

export function getDeliveryStageIndex(id: DeliveryStageId): number {
  return DELIVERY_STAGE_IDS.indexOf(id);
}

export function isDeliveryStageId(
  value: string | null | undefined,
): value is DeliveryStageId {
  return DELIVERY_STAGE_IDS.includes(value as DeliveryStageId);
}

export function getDeliveryStage(
  id: string | null | undefined,
): DeliveryStage | undefined {
  if (!isDeliveryStageId(id)) return undefined;
  return DELIVERY_STAGES.find((stage) => stage.id === id);
}
