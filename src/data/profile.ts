/**
 * Customer profile mocks.
 *
 * Shaped to match the future Supabase seam:
 *   public.profiles, public.orders, public.addresses, public.gauge_readings
 * Swap the accessors below for queries; keep the types.
 */

import { formatCylinderSize, getCylinderById, type CylinderId } from "@/config/cylinders";
import {
  getSavedAddressById,
  SAVED_ADDRESSES,
  type DeliveryAddress,
} from "@/config/delivery";
import {
  DELIVERY_STAGES,
  type DeliveryStage,
  type DeliveryStageId,
} from "@/config/delivery-stages";
import { quoteFill } from "@/config/pricing";
import type { SessionUser } from "@/stores/session";

export type CustomerProfile = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  phone: string;
  autoRefillEnabled: boolean;
};

export type GaugeReading = {
  userId: string;
  percent: number;
  lastUpdatedAt: string;
  estimatedDaysRange: [number, number];
};

export type CustomerOrder = {
  id: string;
  userId: string;
  orderNumber: string;
  cylinderId: CylinderId;
  addressId: string;
  status: DeliveryStageId;
  totalNgn: number;
  placedAt: string;
};

function daysAgoIso(days: number, hours = 10): string {
  const date = new Date();
  date.setHours(hours, 15, 0, 0);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function orderTotal(cylinderId: CylinderId, zoneId: DeliveryAddress["zoneId"]): number {
  const cylinder = getCylinderById(cylinderId);
  if (!cylinder) {
    throw new Error(`Unknown cylinder ${cylinderId}`);
  }
  return quoteFill({
    fillMode: "full",
    capacityKg: cylinder.sizeKg,
    zoneId,
  }).totalNgn;
}

export const MOCK_PROFILE: CustomerProfile = {
  id: "usr_tunde_adebayo",
  firstName: "Tunde",
  lastName: "Adebayo",
  phone: "+2348034412291",
  autoRefillEnabled: false,
};

export const DEMO_SESSION_USER: SessionUser = {
  id: MOCK_PROFILE.id,
  firstName: MOCK_PROFILE.firstName ?? "Tunde",
  lastName: MOCK_PROFILE.lastName ?? "Adebayo",
  phone: MOCK_PROFILE.phone,
  email: "tunde@demo.gasgo.app",
};

export const MOCK_GAUGE: GaugeReading = {
  userId: MOCK_PROFILE.id,
  percent: 62,
  lastUpdatedAt: daysAgoIso(8),
  estimatedDaysRange: [12, 16],
};

export const MOCK_ORDERS: readonly CustomerOrder[] = [
  {
    id: "gg_phgra9k2a",
    userId: MOCK_PROFILE.id,
    orderNumber: "GG-1842",
    cylinderId: "12.5",
    addressId: "home",
    status: "en_route",
    totalNgn: orderTotal("12.5", "old-gra"),
    placedAt: daysAgoIso(0, 9),
  },
  {
    id: "gg_phwork3m1c",
    userId: MOCK_PROFILE.id,
    orderNumber: "GG-1770",
    cylinderId: "12.5",
    addressId: "work",
    status: "delivered",
    totalNgn: orderTotal("12.5", "trans-amadi"),
    placedAt: daysAgoIso(11, 16),
  },
  {
    id: "gg_phmum7p4d",
    userId: MOCK_PROFILE.id,
    orderNumber: "GG-1694",
    cylinderId: "6",
    addressId: "mum",
    status: "delivered",
    totalNgn: orderTotal("6", "ada-george"),
    placedAt: daysAgoIso(28, 14),
  },
  {
    id: "gg_phwoji2n8e",
    userId: MOCK_PROFILE.id,
    orderNumber: "GG-1608",
    cylinderId: "25",
    addressId: "bisi",
    status: "delivered",
    totalNgn: orderTotal("25", "woji"),
    placedAt: daysAgoIso(46, 11),
  },
];

export function getMockProfile(): CustomerProfile {
  return MOCK_PROFILE;
}

export function getMockGauge(): GaugeReading {
  return MOCK_GAUGE;
}

export function getMockOrders(): CustomerOrder[] {
  return [...MOCK_ORDERS];
}

export function getMockAddresses(): DeliveryAddress[] {
  return [...SAVED_ADDRESSES];
}

export function getProfileOrderById(orderId: string): CustomerOrder | undefined {
  return MOCK_ORDERS.find((order) => order.id === orderId);
}

export function ordersForUser(userId: string | null | undefined): CustomerOrder[] {
  if (!userId) return [];
  return MOCK_ORDERS.filter((order) => order.userId === userId);
}

export function activeOrderForUser(userId: string | null | undefined): CustomerOrder | undefined {
  return ordersForUser(userId).find((order) => !isOrderDelivered(order));
}

export function profileFromSession(user: SessionUser | null): CustomerProfile {
  if (!user) return { ...MOCK_PROFILE, firstName: null, lastName: null, phone: "" };
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    autoRefillEnabled: false,
  };
}

export function profileDisplayName(profile: CustomerProfile): string {
  return [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim();
}

export function profileHeaderTitle(profile: CustomerProfile): string {
  const first = profile.firstName?.trim();
  return first || "Profile";
}

export function formatNgPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("234") && digits.length >= 13) {
    return `+234 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9, 13)}`;
  }
  if (digits.startsWith("0") && digits.length === 11) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  return phone;
}

export function isOrderDelivered(order: CustomerOrder): boolean {
  return order.status === "delivered";
}

export function orderHref(order: CustomerOrder): string {
  return isOrderDelivered(order)
    ? `/profile/orders/${encodeURIComponent(order.id)}`
    : `/order/tracking/${encodeURIComponent(order.id)}`;
}

export function orderCylinderLabel(order: CustomerOrder): string {
  const cylinder = getCylinderById(order.cylinderId);
  return cylinder ? formatCylinderSize(cylinder.sizeKg) : `${order.cylinderId} kg`;
}

export function orderStage(order: CustomerOrder): DeliveryStage | undefined {
  return DELIVERY_STAGES.find((stage) => stage.id === order.status);
}

export function orderAddress(order: CustomerOrder): DeliveryAddress | undefined {
  return getSavedAddressById(order.addressId);
}
