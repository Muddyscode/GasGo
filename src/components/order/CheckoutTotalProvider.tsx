"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useCountUpNaira } from "@/lib/use-count-up-naira";

type CheckoutTotal = {
  display: number;
  target: number;
};

const CheckoutTotalContext = createContext<CheckoutTotal | null>(null);

/**
 * One animated checkout total. The mobile bar, collapsed receipt row,
 * receipt sheet, and desktop rail all read this so they settle together.
 */
export function CheckoutTotalProvider({
  totalNgn,
  children,
}: {
  totalNgn: number;
  children: ReactNode;
}) {
  const { display } = useCountUpNaira(totalNgn);
  return (
    <CheckoutTotalContext.Provider value={{ display, target: totalNgn }}>
      {children}
    </CheckoutTotalContext.Provider>
  );
}

export function useCheckoutTotal() {
  return useContext(CheckoutTotalContext);
}
