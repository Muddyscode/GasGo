import type { CylinderId } from "@/config/cylinders";
import type { DeliveryWindowId, PresenceId } from "@/config/delivery";
import type { DeliveryStageId } from "@/config/delivery-stages";
import {
  addIsoDays,
  defaultOrderDates,
  type FulfillmentMode,
} from "@/config/fulfillment";
import { formatKg, type FillMode } from "@/config/pricing";

/**
 * Admin order shape — maps forward to `orders` + `delivery_statuses`.
 * Mock in-memory seed until Supabase is wired.
 */
export type AdminOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  cylinderId: CylinderId;
  quantity: number;
  capacityKg: number;
  fillMode: FillMode;
  fillKg: number;
  area: string;
  addressLine: string;
  presenceId: PresenceId;
  windowId: DeliveryWindowId;
  fulfillmentMode: FulfillmentMode;
  pickupDate: string;
  returnDate: string;
  stage: DeliveryStageId;
  placedAt: string;
};

type Listener = () => void;

const listeners = new Set<Listener>();

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

function seedOrders(): AdminOrder[] {
  const { pickupDate, returnDate } = defaultOrderDates();
  const next = addIsoDays(pickupDate, 1);
  const later = addIsoDays(pickupDate, 2);

  return [
    {
      id: "GG-20260919-0042",
      orderNumber: "GG-20260919-0042",
      customerName: "Chioma Okeke",
      customerPhone: "08034412291",
      cylinderId: "12.5",
      quantity: 1,
      capacityKg: 12.5,
      fillMode: "full",
      fillKg: 12.5,
      area: "Old GRA",
      addressLine: "12 Forces Avenue, Old GRA",
      presenceId: "someone-home",
      windowId: "asap",
      fulfillmentMode: "door_to_door",
      pickupDate,
      returnDate,
      stage: "nearby",
      placedAt: minutesAgo(24),
    },
    {
      id: "GG-20260919-0041",
      orderNumber: "GG-20260919-0041",
      customerName: "Tunde Balogun",
      customerPhone: "08023319880",
      cylinderId: "6",
      quantity: 1,
      capacityKg: 6,
      fillMode: "kg",
      fillKg: 4,
      area: "Trans-Amadi",
      addressLine: "Plot 14 Trans-Amadi Industrial Layout",
      presenceId: "call-on-arrival",
      windowId: "morning",
      fulfillmentMode: "door_to_door",
      pickupDate,
      returnDate: next,
      stage: "en_route",
      placedAt: minutesAgo(48),
    },
    {
      id: "GG-20260919-0040",
      orderNumber: "GG-20260919-0040",
      customerName: "Aunty Bisi",
      customerPhone: "08056671024",
      cylinderId: "12.5",
      quantity: 2,
      capacityKg: 12.5,
      fillMode: "full",
      fillKg: 12.5,
      area: "Woji",
      addressLine: "7 Woji Road, GRA Phase 2",
      presenceId: "leave-at-gate",
      windowId: "afternoon",
      fulfillmentMode: "hub",
      pickupDate,
      returnDate,
      stage: "en_route",
      placedAt: minutesAgo(71),
    },
    {
      id: "GG-20260919-0038",
      orderNumber: "GG-20260919-0038",
      customerName: "Ifeanyi Nwosu",
      customerPhone: "08123450917",
      cylinderId: "25",
      quantity: 1,
      capacityKg: 25,
      fillMode: "full",
      fillKg: 25,
      area: "Rumuokoro",
      addressLine: "22 East-West Road, Rumuokoro",
      presenceId: "security",
      windowId: "morning",
      fulfillmentMode: "door_to_door",
      pickupDate: next,
      returnDate: later,
      stage: "picked_up",
      placedAt: minutesAgo(96),
    },
    {
      id: "GG-20260919-0036",
      orderNumber: "GG-20260919-0036",
      customerName: "Ngozi Eze",
      customerPhone: "07081224450",
      cylinderId: "12.5",
      quantity: 1,
      capacityKg: 12.5,
      fillMode: "naira",
      fillKg: 8,
      area: "Eliozu",
      addressLine: "9 Eliozu Road, by the flyover",
      presenceId: "someone-home",
      windowId: "evening",
      fulfillmentMode: "door_to_door",
      pickupDate,
      returnDate,
      stage: "rider_assigned",
      placedAt: minutesAgo(18),
    },
    {
      id: "GG-20260919-0035",
      orderNumber: "GG-20260919-0035",
      customerName: "Kunle Adeyemi",
      customerPhone: "08095530112",
      cylinderId: "6",
      quantity: 1,
      capacityKg: 6,
      fillMode: "full",
      fillKg: 6,
      area: "Ada George",
      addressLine: "18 Ada George Road",
      presenceId: "call-on-arrival",
      windowId: "asap",
      fulfillmentMode: "hub",
      pickupDate: next,
      returnDate: next,
      stage: "rider_assigned",
      placedAt: minutesAgo(33),
    },
    {
      id: "GG-20260919-0033",
      orderNumber: "GG-20260919-0033",
      customerName: "Fatima Sule",
      customerPhone: "08167723008",
      cylinderId: "12.5",
      quantity: 1,
      capacityKg: 12.5,
      fillMode: "full",
      fillKg: 12.5,
      area: "Diobu / Township",
      addressLine: "14 Aggrey Road, Diobu",
      presenceId: "security",
      windowId: "afternoon",
      fulfillmentMode: "door_to_door",
      pickupDate,
      returnDate: next,
      stage: "queued",
      placedAt: minutesAgo(9),
    },
    {
      id: "GG-20260919-0031",
      orderNumber: "GG-20260919-0031",
      customerName: "Emeka Obi",
      customerPhone: "09031124876",
      cylinderId: "50",
      quantity: 1,
      capacityKg: 50,
      fillMode: "full",
      fillKg: 50,
      area: "Rumuola",
      addressLine: "3 Rumuola Road, by the junction",
      presenceId: "security",
      windowId: "morning",
      fulfillmentMode: "door_to_door",
      pickupDate,
      returnDate,
      stage: "queued",
      placedAt: minutesAgo(14),
    },
    {
      id: "GG-20260919-0028",
      orderNumber: "GG-20260919-0028",
      customerName: "Amaka Umeh",
      customerPhone: "08072219904",
      cylinderId: "12.5",
      quantity: 1,
      capacityKg: 12.5,
      fillMode: "full",
      fillKg: 12.5,
      area: "Old GRA",
      addressLine: "8 King Perekule Street, Old GRA",
      presenceId: "someone-home",
      windowId: "evening",
      fulfillmentMode: "door_to_door",
      pickupDate: addIsoDays(pickupDate, -1),
      returnDate: addIsoDays(pickupDate, -1),
      stage: "delivered",
      placedAt: minutesAgo(210),
    },
    {
      id: "GG-20260918-0114",
      orderNumber: "GG-20260918-0114",
      customerName: "Samuel Wright",
      customerPhone: "07045518821",
      cylinderId: "25",
      quantity: 1,
      capacityKg: 25,
      fillMode: "full",
      fillKg: 25,
      area: "Trans-Amadi",
      addressLine: "Block C, Trans-Amadi Industrial Layout",
      presenceId: "leave-at-gate",
      windowId: "asap",
      fulfillmentMode: "hub",
      pickupDate: addIsoDays(pickupDate, -1),
      returnDate: pickupDate,
      stage: "delivered",
      placedAt: minutesAgo(980),
    },
    {
      id: "GG-20260919-0024",
      orderNumber: "GG-20260919-0024",
      customerName: "Blessing Idowu",
      customerPhone: "08108834512",
      cylinderId: "6",
      quantity: 1,
      capacityKg: 6,
      fillMode: "kg",
      fillKg: 5,
      area: "Woji",
      addressLine: "21 Sani Abacha Road, GRA Phase 3",
      presenceId: "call-on-arrival",
      windowId: "morning",
      fulfillmentMode: "door_to_door",
      pickupDate,
      returnDate,
      stage: "attempt_failed",
      placedAt: minutesAgo(155),
    },
  ];
}

let orders: AdminOrder[] = seedOrders();

function emit() {
  for (const listener of listeners) listener();
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getOrdersSnapshot(): AdminOrder[] {
  return orders.map((order) => ({ ...order }));
}

export function subscribeOrders(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function listOrders(): Promise<AdminOrder[]> {
  await wait(280);
  return getOrdersSnapshot();
}

export async function getOrder(id: string): Promise<AdminOrder | null> {
  await wait(160);
  const order = orders.find((item) => item.id === id);
  return order ? { ...order } : null;
}

export async function updateOrderStage(
  id: string,
  stage: DeliveryStageId,
): Promise<AdminOrder> {
  await wait(90);
  const index = orders.findIndex((item) => item.id === id);
  if (index < 0) {
    throw new Error(`Order ${id} not found`);
  }
  const current = orders[index];
  if (!current) {
    throw new Error(`Order ${id} not found`);
  }
  const next = { ...current, stage };
  orders = orders.map((item, itemIndex) => (itemIndex === index ? next : item));
  emit();
  return { ...next };
}

const FILL_MODE_LABEL: Record<FillMode, string> = {
  full: "Full",
  kg: "By kg",
  naira: "By ₦",
};

export function formatFillSummary(order: AdminOrder): string {
  return `${formatKg(order.capacityKg)} kg · ${FILL_MODE_LABEL[order.fillMode]} · ${formatKg(order.fillKg)} kg fill`;
}
