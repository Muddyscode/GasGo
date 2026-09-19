import type { DeliveryStageId } from "@/config/delivery-stages";

/**
 * Dispatch tab → stage mapping
 *
 * - Pending: still at the plant (`queued`, `rider_assigned`)
 * - Out for delivery: cylinder is on the bike (`picked_up`, `en_route`, `nearby`)
 * - Delivered: successful terminal (`delivered`)
 * - `attempt_failed` is admin-facing and only counted under All (badge on the card)
 */
export const DISPATCH_FILTERS = ["all", "pending", "out", "delivered"] as const;

export type DispatchFilter = (typeof DISPATCH_FILTERS)[number];

export const DISPATCH_FILTER_LABELS: Record<DispatchFilter, string> = {
  all: "All",
  pending: "Pending",
  out: "Out for delivery",
  delivered: "Delivered",
};

export const DISPATCH_FILTER_STAGES: Record<
  DispatchFilter,
  readonly DeliveryStageId[]
> = {
  all: [
    "queued",
    "rider_assigned",
    "picked_up",
    "en_route",
    "nearby",
    "delivered",
    "attempt_failed",
  ],
  pending: ["queued", "rider_assigned"],
  out: ["picked_up", "en_route", "nearby"],
  delivered: ["delivered"],
};

const SUCCESS_STAGES: readonly DeliveryStageId[] = [
  "queued",
  "rider_assigned",
  "picked_up",
  "en_route",
  "nearby",
  "delivered",
];

export function matchesDispatchFilter(
  stage: DeliveryStageId,
  filter: DispatchFilter,
): boolean {
  return DISPATCH_FILTER_STAGES[filter].includes(stage);
}

export function nextDispatchStage(
  stage: DeliveryStageId,
): DeliveryStageId | null {
  const index = SUCCESS_STAGES.indexOf(stage);
  if (index < 0 || index >= SUCCESS_STAGES.length - 1) return null;
  return SUCCESS_STAGES[index + 1] ?? null;
}

export function isDispatchFilter(
  value: string | null | undefined,
): value is DispatchFilter {
  return DISPATCH_FILTERS.includes(value as DispatchFilter);
}
