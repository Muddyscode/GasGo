"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import type { CylinderId } from "@/config/cylinders";
import type { DeliveryAddress, DeliveryWindowId, PresenceId } from "@/config/delivery";
import type { OrderQuote } from "@/config/pricing";
import { PriceBreakdown } from "@/components/order/PriceBreakdown";
import { formatNaira } from "@/lib/money";
import { orderPath } from "@/lib/order-query";
import { createOrderReference, initiatePaystackPayment } from "@/lib/paystack";
import { cn } from "@/lib/utils";

type PaystackPayButtonProps = {
  quote: OrderQuote;
  cylinderId: CylinderId;
  address: DeliveryAddress;
  presenceId: PresenceId;
  windowId: DeliveryWindowId;
  notes: string;
};

export function PaystackPayButton({
  quote,
  cylinderId,
  address,
  presenceId,
  windowId,
  notes,
}: PaystackPayButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handlePay() {
    if (pending) return;
    setPending(true);

    const successPath = orderPath("/order/success", {
      cylinderId,
      address,
      presenceId,
      windowId,
      notes,
    });

    try {
      const result = await initiatePaystackPayment({
        amountNgn: quote.totalNgn,
        reference: createOrderReference(cylinderId),
        metadata: {
          cylinder: cylinderId,
          address: address.id,
          presence: presenceId,
        },
      });
      const next = new URL(successPath, "https://gasgo.local");
      next.searchParams.set("mode", result.kind);
      next.searchParams.set("ref", result.reference);
      router.push(`${next.pathname}?${next.searchParams.toString()}`);
    } catch {
      setPending(false);
    }
  }

  return (
    <div className="sticky bottom-0 z-20 border-t border-border/80 bg-surface/95 px-5 pt-3 backdrop-blur-md pb-[max(1rem,env(safe-area-inset-bottom))]">
      <PriceBreakdown quote={quote} />
      <p className="mb-2.5 mt-3 flex min-h-5 items-center justify-center gap-1.5 text-sm text-ink-muted">
        <Lock className="size-3.5" strokeWidth={2} />
        Secured by Paystack · Test mode
      </p>
      <button
        type="button"
        disabled={pending}
        onClick={() => void handlePay()}
        className={cn(
          "flex h-14 w-full items-center justify-center rounded-2xl text-base font-semibold tracking-tight",
          "transition-[background-color,color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2",
          pending
            ? "cursor-wait bg-brand-green/80 text-white"
            : "bg-brand-green text-white shadow-gasgo-md active:scale-[0.985]",
        )}
      >
        {pending
          ? "Starting Paystack…"
          : `Pay ${formatNaira(quote.totalNgn)} with Paystack`}
      </button>
    </div>
  );
}