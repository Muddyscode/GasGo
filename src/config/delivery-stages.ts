/**
 * GasGo delivery stages — Architect contract.
 * Plant refill loop: queued → rider_assigned → picked_up → en_route → nearby → delivered
 * `attempt_failed` is a late/failed handover; customer Tracking maps it onto the return step.
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
  now: string;
  next: string;
};

export const DELIVERY_STAGES: readonly DeliveryStage[] = [
  {
    id: "queued",
    title: "Order received",
    detail: "We’ve got your order. Next we assign a rider to collect the empty.",
    now: "We’ve got your order",
    next: "A rider will collect your empty cylinder",
  },
  {
    id: "rider_assigned",
    title: "Collecting the empty",
    detail: "Your rider is heading out to collect your empty cylinder.",
    now: "Rider is collecting your empty cylinder",
    next: "Empty goes to the plant for refill",
  },
  {
    id: "picked_up",
    title: "At the plant",
    detail: "Empty collected — filling offsite at the plant, never at your door.",
    now: "Empty is at the plant for refill",
    next: "Filled cylinder comes back to you",
  },
  {
    id: "en_route",
    title: "Returning your fill",
    detail: "Your filled cylinder is on the way back from the plant.",
    now: "Filled cylinder is on the way back",
    next: "Rider arrives at your address",
  },
  {
    id: "nearby",
    title: "Almost there",
    detail: "Rider is close with your filled cylinder — get ready to receive.",
    now: "Rider is close with your filled cylinder",
    next: "Receive the filled cylinder",
  },
  {
    id: "delivered",
    title: "Cylinder returned",
    detail: "Filled cylinder is back. Enjoy your cook.",
    now: "Filled cylinder is back with you",
    next: "Enjoy your cook",
  },
  {
    id: "attempt_failed",
    title: "Handover didn’t complete",
    detail: "Rider could not complete the return. WhatsApp us and we’ll retry.",
    now: "Handover didn’t complete",
    next: "WhatsApp us to sort the retry",
  },
] as const;

/** Success path shown on customer Tracking. `attempt_failed` overlays the return step. */
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
