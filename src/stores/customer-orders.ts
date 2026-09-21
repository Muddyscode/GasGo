"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DeliveryStageId } from "@/config/delivery-stages";
import {
  buildPlacedOrder,
  isPlacedOrder,
  type PlacedOrder,
} from "@/lib/placed-order";
import { useOrderDraft } from "@/stores/order-draft";
import type { SessionUser } from "@/stores/session";

export const CUSTOMER_ORDERS_STORAGE_KEY = "gasgo-customer-orders";

export type { PlacedOrder };

type CustomerOrdersStore = {
  orders: PlacedOrder[];
  place: (order: PlacedOrder) => void;
  setStage: (id: string, stage: DeliveryStageId) => void;
};

/**
 * After Paystack mock/real success: persist the active order, then clear the draft.
 * Auth must never call this — only a completed pay may.
 */
export function completePaidCheckout(input: {
  user: SessionUser;
  orderId: string;
}): PlacedOrder {
  const draft = useOrderDraft.getState();
  const quote = draft.quote();
  const order = buildPlacedOrder({
    id: input.orderId,
    userId: input.user.id,
    draft,
    quote,
  });
  useCustomerOrders.getState().place(order);
  useOrderDraft.getState().clear();
  return order;
}

export const useCustomerOrders = create<CustomerOrdersStore>()(
  persist(
    (set) => ({
      orders: [],
      place: (order) =>
        set((state) => ({
          orders: [order, ...state.orders.filter((item) => item.id !== order.id)],
        })),
      setStage: (id, stage) =>
        set((state) => ({
          orders: state.orders.map((item) =>
            item.id === id ? { ...item, stage } : item,
          ),
        })),
    }),
    {
      name: CUSTOMER_ORDERS_STORAGE_KEY,
      version: 1,
      partialize: (state) => ({ orders: state.orders }),
      migrate: (persisted) => {
        const p = (persisted ?? {}) as { orders?: unknown };
        const orders = Array.isArray(p.orders)
          ? p.orders.filter(isPlacedOrder)
          : [];
        return { orders };
      },
    },
  ),
);
