import {
  DELIVERY_STAGE_IDS,
  type DeliveryStageId,
} from "@/config/delivery-stages";

const IN_PROGRESS_STAGES = DELIVERY_STAGE_IDS.filter(
  (id) => id !== "delivered" && id !== "attempt_failed",
);

/** Demo stage from orderId. Defaults to en_route when the hash is empty. */
export function demoStageForOrderId(orderId: string): DeliveryStageId {
  if (!orderId) return "en_route";

  let hash = 0;
  for (let i = 0; i < orderId.length; i += 1) {
    hash = (hash * 31 + orderId.charCodeAt(i)) >>> 0;
  }

  return IN_PROGRESS_STAGES[hash % IN_PROGRESS_STAGES.length] ?? "en_route";
}
