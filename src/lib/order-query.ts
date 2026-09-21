/**
 * Optional deep-link helpers. Happy-path Cylinder → Address → Checkout
 * reads and writes `useOrderDraft` and does not put draft fields in the URL.
 */
import { getCylinderById, type CylinderId } from "@/config/cylinders";
import {
  DEFAULT_DELIVERY_WINDOW,
  type DeliveryAddress,
  type DeliveryWindowId,
  type PresenceId,
  getPresenceById,
  getSavedAddressById,
  getWindowById,
  isDeliveryWindowId,
  isPresenceId,
} from "@/config/delivery";
import { isZoneId } from "@/config/pricing";

export type SearchValue = string | string[] | undefined;

export function firstParam(value: SearchValue): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export type OrderQuery = {
  cylinderId: CylinderId | null;
  addressId: string | null;
  address: DeliveryAddress | null;
  presenceId: PresenceId | null;
  windowId: DeliveryWindowId;
  notes: string;
};

export function parseOrderQuery(params: Record<string, SearchValue>): OrderQuery {
  const cylinderId = getCylinderById(firstParam(params.cylinder))?.id ?? null;
  const addressId = firstParam(params.address) ?? null;
  const saved = getSavedAddressById(addressId);
  const label = firstParam(params.label)?.trim();
  const line = firstParam(params.line)?.trim();
  const area = firstParam(params.area)?.trim();
  const zoneRaw = firstParam(params.zone);
  const custom =
    !saved && addressId && label && line && area
      ? {
          id: addressId,
          label,
          line,
          area,
          zoneId: isZoneId(zoneRaw) ? zoneRaw : "old-gra",
        }
      : null;

  const presenceRaw = firstParam(params.presence);
  const windowRaw = firstParam(params.window);

  return {
    cylinderId,
    addressId,
    address: saved ?? custom,
    presenceId: isPresenceId(presenceRaw) ? presenceRaw : null,
    windowId: isDeliveryWindowId(windowRaw) ? windowRaw : DEFAULT_DELIVERY_WINDOW,
    notes: firstParam(params.notes)?.trim() ?? "",
  };
}

export function isOrderReady(query: OrderQuery): boolean {
  return Boolean(query.cylinderId && query.address && query.presenceId);
}

export function orderPath(
  path: "/order/address" | "/order/checkout" | "/order/success" | "/order/cylinder",
  input: Parameters<typeof buildOrderQuery>[0],
): string {
  const query = buildOrderQuery(input);
  return query ? `${path}?${query}` : path;
}

export function buildOrderQuery(input: {
  cylinderId?: string | null;
  address?: DeliveryAddress | null;
  presenceId?: PresenceId | null;
  windowId?: DeliveryWindowId | null;
  notes?: string;
}): string {
  const params = new URLSearchParams();
  if (input.cylinderId) params.set("cylinder", input.cylinderId);
  if (input.address) {
    params.set("address", input.address.id);
    params.set("label", input.address.label);
    params.set("line", input.address.line);
    params.set("area", input.address.area);
    params.set("zone", input.address.zoneId);
  }
  if (input.presenceId && getPresenceById(input.presenceId)) {
    params.set("presence", input.presenceId);
  }
  if (input.windowId && getWindowById(input.windowId)) {
    params.set("window", input.windowId);
  }
  const notes = input.notes?.trim();
  if (notes) params.set("notes", notes);
  return params.toString();
}
