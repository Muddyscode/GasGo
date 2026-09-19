"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { PriceBreakdown } from "@/components/order/PriceBreakdown";
import type { OrderQuote } from "@/config/pricing";
import { createLocalOrderId } from "@/lib/order-id";
import { formatNaira } from "@/lib/money";
import { createOrderReference, initiatePaystackPayment } from "@/lib/paystack";
import { tactilePrimary } from "@/components/ui/tactile";
import { cn } from "@/lib/utils";
import { useOrderDraft } from "@/stores/order-draft";

type PaystackPayButtonProps = {
  quote: OrderQuote;
};

export function PaystackPayButton({ quote }: PaystackPayButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const cylinderId = useOrderDraft((state) => state.cylinderId);
  const address = useOrderDraft((state) => state.address);
  const presenceId = useOrderDraft((state) => state.presenceId);
  const clear = useOrderDraft((state) => state.clear);

  async function handlePay() {
    if (pending || !cylinderId || !address || !presenceId) return;
    setPending(true);

    try {
      await initiatePaystackPayment({
        amountNgn: quote.totalNgn,
        reference: createOrderReference(cylinderId),
        metadata: {
          cylinder: cylinderId,
          address: address.id,
          presence: presenceId,
        },
      });
      const orderId = createLocalOrderId();
      clear();
      router.push(`/order/tracking/${encodeURIComponent(orderId)}`);
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
        className={cn(tactilePrimary(), pending && "cursor-wait opacity-80")}
      >
        {pending
          ? "Starting Paystack…"
          : `Pay ${formatNaira(quote.totalNgn)} with Paystack`}
      </button>
    </div>
  );
}
