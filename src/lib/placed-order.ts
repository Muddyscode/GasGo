import { getCylinderById, isCylinderId } from "@/config/cylinders";
import type { DeliveryWindowId, PresenceId } from "@/config/delivery";
import type { DeliveryStageId } from "@/config/delivery-stages";
import {
  isFulfillmentMode,
  type FulfillmentMode,
} from "@/config/fulfillment";
import {
  formatKg,
  isFillMode,
  type FillMode,
  type FillQuote,
} from "@/config/pricing";
import type { OrderDraft } from "@/stores/order-draft";

const FILL_MODE_LABEL: Record<FillMode, string> = {
  full: "Full",
  kg: "By kg",
  naira: "By ₦",
};

export type PlacedOrder = {
  id: string;
  userId: string;
  orderNumber: string;
  stage: DeliveryStageId;
  /** SKU id when capacity matches a catalog size; otherwise the formatted kg. */
  cylinderId: string;
  fillMode: FillMode;
  fillKg: number;
  capacityKg: number;
  rateNgnPerKg: number;
  gasFillNgn: number;
  deliveryNgn: number;
  totalNgn: number;
  fillSummary: string;
  fulfillmentMode: FulfillmentMode;
  pickupDate: string;
  returnDate: string;
  windowId: DeliveryWindowId;
  addressId: string;
  addressLabel: string;
  addressLine: string;
  zoneId: string | null;
  presenceId: PresenceId | null;
  notes: string;
  placedAt: string;
};

/**
 * Persist a label for the cylinder, never an invented 12.5.
 * Catalog sizes keep their SKU id. Free-entered kg stores the formatted kg.
 */
export function cylinderIdFromDraft(draft: Pick<OrderDraft, "cylinderId" | "capacityKg">): string {
  const kg = draft.capacityKg;
  if (kg != null && Number.isFinite(kg) && kg > 0) {
    const sku = getCylinderById(kg === 12.5 ? "12.5" : String(kg));
    if (sku && sku.sizeKg === kg) return sku.id;
    return formatKg(kg);
  }
  if (isCylinderId(draft.cylinderId)) return draft.cylinderId;
  return "custom";
}

export function formatPlacedFillSummary(input: {
  capacityKg: number;
  fillMode: FillMode;
  fillKg: number;
}): string {
  return `${formatKg(input.capacityKg)} kg — ${FILL_MODE_LABEL[input.fillMode]} — ${formatKg(input.fillKg)} kg fill`;
}

export function orderNumberFromId(orderId: string): string {
  const entropy = orderId.replace(/^gg_/i, "").slice(0, 8).toUpperCase();
  return `GG-${entropy || "ORDER"}`;
}

export function buildPlacedOrder(input: {
  id: string;
  userId: string;
  draft: OrderDraft;
  quote: FillQuote;
  placedAt?: string;
}): PlacedOrder {
  const { id, userId, draft, quote } = input;
  const address = draft.address;
  return {
    id,
    userId,
    orderNumber: orderNumberFromId(id),
    stage: "queued",
    cylinderId: cylinderIdFromDraft(draft),
    fillMode: quote.fillMode,
    fillKg: quote.fillKg,
    capacityKg: quote.capacityKg,
    rateNgnPerKg: quote.rateNgnPerKg,
    gasFillNgn: quote.gasFillNgn,
    deliveryNgn: quote.deliveryNgn,
    totalNgn: quote.totalNgn,
    fillSummary: formatPlacedFillSummary({
      capacityKg: quote.capacityKg,
      fillMode: quote.fillMode,
      fillKg: quote.fillKg,
    }),
    fulfillmentMode: draft.fulfillmentMode,
    pickupDate: draft.pickupDate,
    returnDate: draft.returnDate,
    windowId: draft.windowId,
    addressId: address?.id ?? "unknown",
    addressLabel: address?.label ?? "",
    addressLine: address?.line ?? "",
    zoneId: address?.zoneId ?? quote.zoneId,
    presenceId: draft.presenceId,
    notes: draft.notes,
    placedAt: input.placedAt ?? new Date().toISOString(),
  };
}

export function isActivePlacedStage(stage: DeliveryStageId): boolean {
  return stage !== "delivered" && stage !== "attempt_failed";
}

export function placedOrdersForUser(
  orders: PlacedOrder[],
  userId: string | null | undefined,
): PlacedOrder[] {
  if (!userId) return [];
  return orders
    .filter((order) => order.userId === userId)
    .slice()
    .sort((a, b) => b.placedAt.localeCompare(a.placedAt));
}

export function activePlacedOrderForUser(
  orders: PlacedOrder[],
  userId: string | null | undefined,
): PlacedOrder | undefined {
  return placedOrdersForUser(orders, userId).find((order) =>
    isActivePlacedStage(order.stage),
  );
}

export function isPlacedOrder(value: unknown): value is PlacedOrder {
  if (!value || typeof value !== "object") return false;
  const order = value as Partial<PlacedOrder>;
  return Boolean(
    order.id &&
      order.userId &&
      order.orderNumber &&
      order.stage &&
      typeof order.cylinderId === "string" &&
      order.cylinderId.length > 0 &&
      typeof order.capacityKg === "number" &&
      order.capacityKg > 0 &&
      isFillMode(order.fillMode) &&
      isFulfillmentMode(order.fulfillmentMode) &&
      order.pickupDate &&
      order.returnDate &&
      typeof order.fillSummary === "string",
  );
}
