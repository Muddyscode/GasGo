"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { useAuthModal } from "@/components/auth/AuthProvider";
import { DeliveryTruck } from "@/components/motion/DeliveryTruck";
import { PriceBreakdown } from "@/components/order/PriceBreakdown";
import { buttonClassName } from "@/components/ui/button";
import { StickyAction } from "@/components/ui/page";
import type { OrderQuote } from "@/config/pricing";
import { formatKg } from "@/config/pricing";
import { createLocalOrderId } from "@/lib/order-id";
import { createOrderReference, initiatePaystackPayment } from "@/lib/paystack";
import { completePaidCheckout } from "@/stores/customer-orders";
import { useOrderDraft } from "@/stores/order-draft";
import { useSession } from "@/stores/session";

type PaystackPayButtonProps = {
  quote: OrderQuote;
};

export function PaystackPayButton({ quote }: PaystackPayButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const address = useOrderDraft((state) => state.address);
  const presenceId = useOrderDraft((state) => state.presenceId);
  const fulfillmentMode = useOrderDraft((state) => state.fulfillmentMode);
  const pickupDate = useOrderDraft((state) => state.pickupDate);
  const returnDate = useOrderDraft((state) => state.returnDate);
  const windowId = useOrderDraft((state) => state.windowId);
  const fillKg = useOrderDraft((state) => state.quote().fillKg);
  const user = useSession((state) => state.user);
  const { requestAuth } = useAuthModal();
  const hub = fulfillmentMode === "hub";

  async function handlePay() {
    if (pending || !address || quote.totalNgn <= 0) return;
    if (!hub && !presenceId) return;
    if (!requestAuth("/order/checkout")) return;
    const sessionUser = useSession.getState().user;
    if (!sessionUser) return;
    setPending(true);

    try {
      await initiatePaystackPayment({
        amountNgn: quote.totalNgn,
        email: sessionUser.email,
        reference: createOrderReference(formatKg(fillKg || quote.fillKg || 0)),
        metadata: {
          fillKg: String(fillKg || quote.fillKg || ""),
          address: address.id,
          presence: presenceId ?? "",
          zone: address.zoneId,
          fulfillment: fulfillmentMode,
          pickupDate,
          returnDate,
          window: windowId,
        },
      });
      const orderId = createLocalOrderId();
      completePaidCheckout({ user: sessionUser, orderId });
      router.push(`/order/tracking/${encodeURIComponent(orderId)}`);
    } catch {
      setPending(false);
    }
  }

  return (
    <StickyAction>
      {pending ? (
        <div className="mb-3">
          <DeliveryTruck size="sm" label="Starting payment" />
        </div>
      ) : null}
      <div className="lg:hidden">
        <PriceBreakdown quote={quote} fulfillmentMode={fulfillmentMode} />
      </div>
      <p className="mb-2.5 mt-3 flex min-h-5 items-center justify-center gap-1.5 text-sm text-ink-muted">
        <Lock className="size-3.5" strokeWidth={2} />
        {hub
          ? "Pay in full to confirm this hub pre-order. Paystack test mode."
          : "Pay in full before empty pickup. Zone transport is already in the total."}
      </p>
      <button
        type="button"
        disabled={pending}
        onClick={() => void handlePay()}
        className={buttonClassName(
          { variant: "primary", size: "lg" },
          pending && "cursor-wait bg-brand-green/80",
        )}
      >
        {pending ? "Starting Paystack…" : !user ? "Sign up to pay" : "Pay now"}
      </button>
    </StickyAction>
  );
}
