"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Lock } from "lucide-react";
import { useAuthModal } from "@/components/auth/AuthProvider";
import { CountUpNaira } from "@/components/motion";
import { buttonClassName } from "@/components/ui/button";
import { StickyAction } from "@/components/ui/page";
import { CHECKOUT_RECEIPT_SHEET_ID } from "@/lib/overlay";
import type { OrderQuote } from "@/config/pricing";
import { formatKg } from "@/config/pricing";
import { createLocalOrderId } from "@/lib/order-id";
import { createOrderReference, initiatePaystackPayment } from "@/lib/paystack";
import { completePaidCheckout } from "@/stores/customer-orders";
import { useOrderDraft } from "@/stores/order-draft";
import { useSession } from "@/stores/session";

export const CHECKOUT_MOBILE_CTA_ATTR = "data-checkout-mobile-cta";

type PaystackPayButtonProps = {
  quote: OrderQuote;
  /** `bar` is the compact mobile footer. `rail` sits in the desktop receipt column. */
  placement?: "bar" | "rail";
  breakdownOpen?: boolean;
  onViewBreakdown?: (trigger: HTMLElement) => void;
};

export function PaystackPayButton({
  quote,
  placement = "bar",
  breakdownOpen = false,
  onViewBreakdown,
}: PaystackPayButtonProps) {
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
      const started = Date.now();
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
      const remain = Math.max(0, 240 - (Date.now() - started));
      if (remain > 0) {
        await new Promise((resolve) => window.setTimeout(resolve, remain));
      }
      const orderId = createLocalOrderId();
      completePaidCheckout({ user: sessionUser, orderId });
      router.push(`/order/tracking/${encodeURIComponent(orderId)}`);
    } catch {
      setPending(false);
    }
  }

  const payLabel = pending ? "Starting Paystack…" : !user ? "Sign up to pay" : "Pay now";

  const controls = (
    <>
      {placement === "bar" ? (
        <div className="mb-2.5">
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={breakdownOpen}
            aria-controls={CHECKOUT_RECEIPT_SHEET_ID}
            onClick={(event) => onViewBreakdown?.(event.currentTarget)}
            className="flex w-full items-baseline justify-between gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
          >
            <span className="text-sm font-medium text-ink-muted">Total</span>
            <span className="font-display text-[22px] font-semibold tabular-nums tracking-tight text-ink">
              <CountUpNaira value={quote.totalNgn} shared data-checkout-total="" />
            </span>
          </button>
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={breakdownOpen}
            aria-controls={CHECKOUT_RECEIPT_SHEET_ID}
            onClick={(event) => onViewBreakdown?.(event.currentTarget)}
            className="mt-1 text-sm font-semibold text-brand-green underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
          >
            View breakdown
          </button>
        </div>
      ) : null}
      <p className="mb-2.5 flex min-h-5 items-center justify-center gap-1.5 text-sm text-ink-muted">
        <Lock className="size-3.5" strokeWidth={2} />
        {hub
          ? "Pay in full to confirm this hub pre-order. Paystack test mode."
          : "Pay in full before empty pickup. Zone transport is already in the total."}
      </p>
      <button
        type="button"
        disabled={pending}
        aria-busy={pending}
        data-pay-pending={pending ? "" : undefined}
        onClick={() => void handlePay()}
        className={buttonClassName(
          { variant: "primary", size: "lg" },
          pending && "cursor-wait bg-brand-green/80",
        )}
      >
        {pending ? (
          <Flame
            className="size-5 shrink-0 motion-safe:animate-pay-flame motion-reduce:animate-none"
            strokeWidth={2}
            aria-hidden="true"
          />
        ) : null}
        {payLabel}
      </button>
    </>
  );

  if (placement === "rail") {
    return <div className="mt-6">{controls}</div>;
  }

  return (
    <StickyAction className="lg:hidden">
      <div data-checkout-mobile-cta="">{controls}</div>
    </StickyAction>
  );
}
