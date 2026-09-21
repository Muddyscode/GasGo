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
import {
  applyFulfillmentToQuote,
  DEFAULT_FULFILLMENT_MODE,
  defaultOrderDates,
  isFulfillmentMode,
  isValidIsoDate,
  normalizeOrderDates,
  type FulfillmentMode,
} from "@/config/fulfillment";
import {
  DEFAULT_FILL_MODE,
  LIVE_RATE_NGN_PER_KG,
  quoteFill,
  type FillMode,
  type FillQuote,
} from "@/config/pricing";

export const ORDER_DRAFT_STORAGE_KEY = "gasgo-order-draft";

export type OrderDraft = {
  cylinderId: CylinderId | null;
  quantity: number;
  capacityKg: number | null;
  fillMode: FillMode;
  fillKg: number | null;
  spendNaira: number | null;
  rateNgnPerKg: number;
  address: DeliveryAddress | null;
  presenceId: PresenceId | null;
  windowId: DeliveryWindowId;
  notes: string;
  fulfillmentMode: FulfillmentMode;
  pickupDate: string;
  returnDate: string;
};

type OrderDraftStore = OrderDraft & {
  setCylinder: (id: CylinderId, quantity?: number) => void;
  setCapacityKg: (capacityKg: number) => void;
  setFillMode: (fillMode: FillMode) => void;
  setFillKg: (fillKg: number) => void;
  setSpendNaira: (spendNaira: number) => void;
  setAddress: (address: DeliveryAddress) => void;
  setPresence: (id: PresenceId) => void;
  setWindow: (windowId: DeliveryWindowId) => void;
  setNotes: (notes: string) => void;
  setFulfillmentMode: (mode: FulfillmentMode) => void;
  setPickupDate: (pickupDate: string) => void;
  setReturnDate: (returnDate: string) => void;
  setOrderDates: (pickupDate: string, returnDate: string) => void;
  clear: () => void;
  isFillReady: () => boolean;
  isReadyForCheckout: () => boolean;
  quote: () => FillQuote;
  totals: () => {
    subtotalKobo: number;
    deliveryFeeKobo: number;
    totalKobo: number;
  };
};

const initialDates = defaultOrderDates();

const initial: OrderDraft = {
  cylinderId: null,
  quantity: 1,
  capacityKg: null,
  fillMode: DEFAULT_FILL_MODE,
  fillKg: null,
  spendNaira: null,
  rateNgnPerKg: LIVE_RATE_NGN_PER_KG,
  address: null,
  presenceId: null,
  windowId: DEFAULT_DELIVERY_WINDOW,
  notes: "",
  fulfillmentMode: DEFAULT_FULFILLMENT_MODE,
  pickupDate: initialDates.pickupDate,
  returnDate: initialDates.returnDate,
};

function cylinderIdForCapacity(capacityKg: number): CylinderId | null {
  const match = getCylinderById(
    capacityKg === 12.5 ? "12.5" : String(capacityKg),
  );
  return match?.id ?? null;
}

function applyDates(
  pickupDate: string | null | undefined,
  returnDate: string | null | undefined,
) {
  const next = normalizeOrderDates(pickupDate, returnDate);
  return { pickupDate: next.pickupDate, returnDate: next.returnDate };
}

/**
 * GasGo order draft — Architect (Zaha) contract.
 * Persist key: gasgo-order-draft
 * Auth must never call clear(); only a completed Paystack pay may.
 */
export const useOrderDraft = create<OrderDraftStore>()(
  persist(
    (set, get) => ({
      ...initial,

      setCylinder: (id, quantity = 1) => {
        const cylinder = getCylinderById(id);
        set({
          cylinderId: id,
          quantity: Math.max(1, quantity),
          capacityKg: cylinder?.sizeKg ?? null,
          fillKg: get().fillMode === "full" ? (cylinder?.sizeKg ?? null) : get().fillKg,
          rateNgnPerKg: LIVE_RATE_NGN_PER_KG,
        });
      },

      setCapacityKg: (capacityKg) => {
        const next = Math.max(0, capacityKg);
        set({
          capacityKg: next,
          cylinderId: cylinderIdForCapacity(next),
          fillKg: get().fillMode === "full" ? next : get().fillKg,
          rateNgnPerKg: LIVE_RATE_NGN_PER_KG,
        });
      },

      setFillMode: (fillMode) => {
        const capacityKg = get().capacityKg;
        set({
          fillMode,
          fillKg: fillMode === "full" ? capacityKg : get().fillKg,
          rateNgnPerKg: LIVE_RATE_NGN_PER_KG,
        });
      },

      setFillKg: (fillKg) => set({ fillKg: Math.max(0, fillKg), fillMode: "kg" }),

      setSpendNaira: (spendNaira) =>
        set({ spendNaira: Math.max(0, spendNaira), fillMode: "naira" }),

      setAddress: (address) => set({ address }),

      setPresence: (id) => set({ presenceId: id }),

      setWindow: (windowId) => set({ windowId }),

      setNotes: (notes) => set({ notes }),

      setFulfillmentMode: (mode) => set({ fulfillmentMode: mode }),

      setPickupDate: (pickupDate) => {
        set(applyDates(pickupDate, get().returnDate));
      },

      setReturnDate: (returnDate) => {
        set(applyDates(get().pickupDate, returnDate));
      },

      setOrderDates: (pickupDate, returnDate) => {
        set(applyDates(pickupDate, returnDate));
      },

      clear: () => set({ ...initial, ...defaultOrderDates() }),

      isFillReady: () => get().quote().fillKg > 0,

      isReadyForCheckout: () => {
        const s = get();
        const dates = normalizeOrderDates(s.pickupDate, s.returnDate);
        const presenceOk = s.fulfillmentMode === "hub" || Boolean(s.presenceId);
        return Boolean(
          s.quote().fillKg > 0 &&
            s.address &&
            presenceOk &&
            s.windowId &&
            dates.ok,
        );
      },

      quote: () => {
        const s = get();
        const raw = quoteFill({
          fillMode: s.fillMode,
          capacityKg: s.capacityKg ?? 0,
          fillKg: s.fillKg,
          spendNaira: s.spendNaira,
          zoneId: s.address?.zoneId,
          rateNgnPerKg: s.rateNgnPerKg || LIVE_RATE_NGN_PER_KG,
        });
        return applyFulfillmentToQuote(raw, s.fulfillmentMode);
      },

      totals: () => {
        const quote = get().quote();
        return {
          subtotalKobo: quote.gasFillNgn * 100,
          deliveryFeeKobo: quote.deliveryNgn * 100,
          totalKobo: quote.totalNgn * 100,
        };
      },
    }),
    {
      name: ORDER_DRAFT_STORAGE_KEY,
      version: 3,
      migrate: (persisted) => {
        const p = (persisted ?? {}) as Partial<OrderDraft>;
        const capacityKg =
          p.capacityKg ?? getCylinderById(p.cylinderId ?? null)?.sizeKg ?? null;
        const dates = applyDates(
          isValidIsoDate(p.pickupDate) ? p.pickupDate : null,
          isValidIsoDate(p.returnDate) ? p.returnDate : null,
        );
        return {
          ...initial,
          ...p,
          capacityKg,
          fillMode: p.fillMode ?? DEFAULT_FILL_MODE,
          fillKg: p.fillKg ?? (p.fillMode === "full" || !p.fillMode ? capacityKg : p.fillKg),
          spendNaira: p.spendNaira ?? null,
          rateNgnPerKg: p.rateNgnPerKg ?? LIVE_RATE_NGN_PER_KG,
          fulfillmentMode: isFulfillmentMode(p.fulfillmentMode)
            ? p.fulfillmentMode
            : DEFAULT_FULFILLMENT_MODE,
          pickupDate: dates.pickupDate,
          returnDate: dates.returnDate,
        };
      },
      partialize: (state) => ({
        cylinderId: state.cylinderId,
        quantity: state.quantity,
        capacityKg: state.capacityKg,
        fillMode: state.fillMode,
        fillKg: state.fillKg,
        spendNaira: state.spendNaira,
        rateNgnPerKg: state.rateNgnPerKg,
        address: state.address,
        presenceId: state.presenceId,
        windowId: state.windowId,
        notes: state.notes,
        fulfillmentMode: state.fulfillmentMode,
        pickupDate: state.pickupDate,
        returnDate: state.returnDate,
      }),
    },
  ),
);
