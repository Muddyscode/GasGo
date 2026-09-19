"use client";

import { useEffect, useState } from "react";
import { CheckoutEmpty } from "@/components/order/CheckoutEmpty";
import { CheckoutSummary } from "@/components/order/CheckoutSummary";
import { OrderHeader } from "@/components/order/OrderHeader";
import { PaystackPayButton } from "@/components/order/PaystackPayButton";
import { DeliveryTruckMotion } from "@/components/motion/DeliveryTruckMotion";
import { OrderFlowShell } from "@/components/ui/PageShell";
import { getCylinderById } from "@/config/cylinders";
import { getPresenceById, getWindowById } from "@/config/delivery";
import { quoteOrder } from "@/config/pricing";
import { koboToNaira } from "@/lib/money";
import { useOrderDraft } from "@/stores/order-draft";

export function CheckoutView() {
  const [hydrated, setHydrated] = useState(false);
  const cylinderId = useOrderDraft((state) => state.cylinderId);
  const address = useOrderDraft((state) => state.address);
  const presenceId = useOrderDraft((state) => state.presenceId);
  const windowId = useOrderDraft((state) => state.windowId);
  const notes = useOrderDraft((state) => state.notes);
  const isReadyForCheckout = useOrderDraft((state) => state.isReadyForCheckout);
  const totals = useOrderDraft((state) => state.totals);

  useEffect(() => {
    const finish = () => setHydrated(true);
    if (useOrderDraft.persist.hasHydrated()) finish();
    return useOrderDraft.persist.onFinishHydration(finish);
  }, []);

  if (!hydrated) {
    return (
      <OrderFlowShell
        imageSrc="/images/cooking-gas-filling-point.png"
        imageAlt="Cooking gas filling point"
        imagePosition="70% 50%"
      >
        <OrderHeader
          title="Checkout"
          backHref="/order/address"
          backLabel="Back to delivery details"
        />
        <div className="flex flex-1 flex-col px-5 pt-6">
          <DeliveryTruckMotion label="Preparing checkout" className="mb-6" />
          <div className="h-8 w-48 animate-pulse rounded-lg bg-surface-muted" />
          <div className="mt-3 h-4 w-64 animate-pulse rounded-lg bg-surface-muted" />
          <div className="mt-8 h-28 animate-pulse rounded-2xl bg-surface-muted" />
          <div className="mt-3 h-40 animate-pulse rounded-2xl bg-surface-muted" />
        </div>
      </OrderFlowShell>
    );
  }

  const cylinder = getCylinderById(cylinderId);
  const presence = getPresenceById(presenceId);
  const window = getWindowById(windowId);
  const draftTotals = totals();

  if (!isReadyForCheckout() || !cylinder || !address || !presence || !window) {
    return <CheckoutEmpty />;
  }

  const quote = quoteOrder(koboToNaira(draftTotals.subtotalKobo));

  return (
    <OrderFlowShell
      imageSrc="/images/cooking-gas-filling-point.png"
      imageAlt="Cooking gas filling point"
      imagePosition="70% 50%"
    >
      <OrderHeader
        title="Checkout"
        backHref="/order/address"
        backLabel="Back to delivery details"
      />

      <div className="flex flex-1 flex-col px-5 pt-6 pb-4">
        <section className="mb-6">
          <p className="text-[28px] font-semibold leading-[1.15] tracking-tight text-ink">
            Review and pay
          </p>
          <p className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-ink-muted">
            Confirm the cylinder and drop-off, then pay securely with Paystack.
          </p>
        </section>

        <CheckoutSummary
          cylinder={cylinder}
          address={address}
          presence={presence}
          window={window}
          notes={notes}
        />
      </div>

      <PaystackPayButton quote={quote} />
    </OrderFlowShell>
  );
}
