"use client";

import type { HTMLAttributes } from "react";
import { useCheckoutTotal } from "@/components/order/CheckoutTotalProvider";
import { formatNaira } from "@/lib/money";
import { useCountUpNaira } from "@/lib/use-count-up-naira";
import { cn } from "@/lib/utils";

/**
 * Naira amount that counts up/down to its new value whenever it changes.
 * First paint shows the value outright. Checkout totals with `shared` read
 * the single CheckoutTotalProvider tween so every surface settles together.
 * The visible span is aria-hidden; screen readers get the final value only.
 */
export function CountUpNaira({
  value,
  className,
  shared = false,
  ...rest
}: {
  value: number;
  className?: string;
  shared?: boolean;
} & Omit<HTMLAttributes<HTMLSpanElement>, "children">) {
  const checkoutTotal = useCheckoutTotal();
  const local = useCountUpNaira(value);
  const display =
    shared && checkoutTotal ? checkoutTotal.display : local.display;

  return (
    <>
      <span
        {...rest}
        className={cn("tabular-nums", className)}
        aria-hidden="true"
        data-naira-tween=""
      >
        {formatNaira(display)}
      </span>
      <span className="sr-only" data-naira-final="">
        {formatNaira(value)}
      </span>
    </>
  );
}
