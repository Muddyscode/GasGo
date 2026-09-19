import type { CylinderId } from "@/config/cylinders";
import type { PresenceId } from "@/config/delivery";
import type { DeliveryStageId } from "@/config/delivery-stages";

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
  area: string;
  addressLine: string;
  presenceId: PresenceId;
  stage: DeliveryStageId;
  placedAt: string;
};

type Listener = () => void;

const listeners = new Set<Listener>();

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

function seedOrders(): AdminOrder[] {
  return [
    {
      id: "GG-20260919-0042",
      orderNumber: "GG-20260919-0042",
      customerName: "Chioma Okeke",
      customerPhone: "08034412291",
      cylinderId: "12.5",
      quantity: 1,
      area: "Lekki",
      addressLine: "14 Admiralty Way, Lekki Phase 1",
      presenceId: "someone-home",
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
      area: "Yaba",
      addressLine: "27 Hughes Avenue, Alagomeji",
      presenceId: "call-on-arrival",
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
      area: "Surulere",
      addressLine: "45 Bode Thomas Street",
      presenceId: "leave-at-gate",
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
      area: "Ikeja",
      addressLine: "8A Isaac John Street, GRA",
      presenceId: "security",
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
      area: "Ajah",
      addressLine: "Plot 9 Abraham Adesanya Estate",
      presenceId: "someone-home",
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
      area: "Maryland",
      addressLine: "21 Mobolaji Bank Anthony Way",
      presenceId: "call-on-arrival",
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
      area: "Victoria Island",
      addressLine: "12 Adeola Odeku Street",
      presenceId: "security",
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
      area: "Ikeja",
      addressLine: "3 Billings Way, Oregun",
      presenceId: "security",
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
      area: "Gbagada",
      addressLine: "18 Diya Street, Ifako",
      presenceId: "someone-home",
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
      area: "Lekki",
      addressLine: "Block C, Chevron Drive",
      presenceId: "leave-at-gate",
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
      area: "Yaba",
      addressLine: "5 Commercial Avenue, Sabo",
      presenceId: "call-on-arrival",
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
