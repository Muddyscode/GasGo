/**
 * GasGo delivery stages — Architect contract.
 * Order: queued → rider_assigned → picked_up → en_route → nearby → delivered
 */
export const DELIVERY_STAGE_IDS = [
  "queued",
  "rider_assigned",
  "picked_up",
  "en_route",
  "nearby",
  "delivered",
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
    detail: "Your rider is heading to the filling point.",
  },
  {
    id: "picked_up",
    title: "Cylinder picked up",
    detail: "Your gas is on the bike and ready to roll.",
  },
  {
    id: "en_route",
    title: "On the way",
    detail: "Your rider is en route to your address.",
  },
  {
    id: "nearby",
    title: "Nearby",
    detail: "Your rider is close — get ready to receive.",
  },
  {
    id: "delivered",
    title: "Delivered",
    detail: "Cylinder delivered. Enjoy your gas.",
  },
] as const;

export function getDeliveryStageIndex(id: DeliveryStageId): number {
  return DELIVERY_STAGE_IDS.indexOf(id);
}

export function isDeliveryStageId(
  value: string | null | undefined,
): value is DeliveryStageId {
  return DELIVERY_STAGE_IDS.includes(value as DeliveryStageId);
}
