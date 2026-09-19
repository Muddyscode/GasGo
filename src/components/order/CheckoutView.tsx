"use client";

import { useEffect, useState } from "react";
import { CheckoutEmpty } from "@/components/order/CheckoutEmpty";
import { CheckoutSummary } from "@/components/order/CheckoutSummary";
import { OrderHeader } from "@/components/order/OrderHeader";
import { PaystackPayButton } from "@/components/order/PaystackPayButton";
import { DeliveryTruck } from "@/components/motion/DeliveryTruck";
import { PageBody, PageFrame, PageTitle } from "@/components/ui/page";
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
      <PageFrame>
        <OrderHeader
          title="Checkout"
          backHref="/order/address"
          backLabel="Back to delivery details"
        />
        <PageBody className="pt-6">
          <DeliveryTruck label="Preparing checkout" compact />
          <div className="mt-6 h-8 w-48 animate-pulse rounded-lg bg-surface-muted" />
          <div className="mt-3 h-4 w-64 animate-pulse rounded-lg bg-surface-muted" />
          <div className="mt-8 h-28 animate-pulse rounded-2xl bg-surface-muted" />
          <div className="mt-3 h-40 animate-pulse rounded-2xl bg-surface-muted" />
        </PageBody>
      </PageFrame>
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
    <PageFrame>
      <OrderHeader
        title="Checkout"
        backHref="/order/address"
        backLabel="Back to delivery details"
      />

      <PageBody className="pb-4">
        <PageTitle
          eyebrow="Pay"
          subtitle="Confirm the cylinder and drop-off, then pay securely with Paystack."
        >
          Review and pay
        </PageTitle>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <CheckoutSummary
              cylinder={cylinder}
              address={address}
              presence={presence}
              window={window}
              notes={notes}
            />
          </div>
          <div className="mt-4 hidden lg:col-span-5 lg:mt-0 lg:block">
            <DeliveryTruck label="Ready for dispatch after payment" />
          </div>
        </div>
      </PageBody>

      <PaystackPayButton quote={quote} />
    </PageFrame>
  );
}
