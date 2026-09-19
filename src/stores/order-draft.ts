"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCylinderById, type CylinderId } from "@/config/cylinders";
import {
  DEFAULT_DELIVERY_WINDOW,
  type DeliveryAddress,
  type DeliveryWindowId,
  type PresenceId,
} from "@/config/delivery";

export type OrderDraft = {
  cylinderId: CylinderId | null;
  quantity: number;
  address: DeliveryAddress | null;
  presenceId: PresenceId | null;
  windowId: DeliveryWindowId;
  notes: string;
};

type OrderDraftStore = OrderDraft & {
  setCylinder: (id: CylinderId, quantity?: number) => void;
  setAddress: (address: DeliveryAddress) => void;
  setPresence: (id: PresenceId) => void;
  setWindow: (windowId: DeliveryWindowId) => void;
  setNotes: (notes: string) => void;
  clear: () => void;
  isReadyForCheckout: () => boolean;
  totals: () => {
    subtotalKobo: number;
    deliveryFeeKobo: number;
    totalKobo: number;
  };
};

const initial: OrderDraft = {
  cylinderId: null,
  quantity: 1,
  address: null,
  presenceId: null,
  windowId: DEFAULT_DELIVERY_WINDOW,
  notes: "",
};

/** Architect: draft delivery fee is 0. Checkout may display Lagos fee via pricing.ts. */
const DELIVERY_FEE_KOBO = 0;

/**
 * GasGo order draft — Architect (Zaha) contract.
 * Persist key: gasgo-order-draft
 */
export const useOrderDraft = create<OrderDraftStore>()(
  persist(
    (set, get) => ({
      ...initial,

      setCylinder: (id, quantity = 1) =>
        set({ cylinderId: id, quantity: Math.max(1, quantity) }),

      setAddress: (address) => set({ address }),

      setPresence: (id) => set({ presenceId: id }),

      setWindow: (windowId) => set({ windowId }),

      setNotes: (notes) => set({ notes }),

      clear: () => set({ ...initial }),

      isReadyForCheckout: () => {
        const s = get();
        return Boolean(s.cylinderId && s.address && s.presenceId && s.windowId);
      },

      totals: () => {
        const s = get();
        const cylinder = getCylinderById(s.cylinderId);
        const unitKobo = cylinder ? cylinder.priceNgn * 100 : 0;
        const subtotalKobo = unitKobo * s.quantity;
        const deliveryFeeKobo = DELIVERY_FEE_KOBO;
        return {
          subtotalKobo,
          deliveryFeeKobo,
          totalKobo: subtotalKobo + deliveryFeeKobo,
        };
      },
    }),
    {
      name: "gasgo-order-draft",
      partialize: (state) => ({
        cylinderId: state.cylinderId,
        quantity: state.quantity,
        address: state.address,
        presenceId: state.presenceId,
        windowId: state.windowId,
        notes: state.notes,
      }),
    },
  ),
);
