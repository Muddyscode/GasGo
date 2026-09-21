"use client";

import Link from "next/link";
import { DeliveryTruck } from "@/components/motion";
import { OrderHeader } from "@/components/order/OrderHeader";
import { TrackingTimeline } from "@/components/order/TrackingTimeline";
import { WhatsAppSupportButton } from "@/components/order/WhatsAppSupportButton";
import { buttonClassName } from "@/components/ui/button";
import { PageFrame, StickyAction } from "@/components/ui/page";
import {
  DELIVERY_STAGES,
  getDeliveryStageIndex,
} from "@/config/delivery-stages";
import {
  formatCalendarDate,
  fulfillmentLabel,
} from "@/config/fulfillment";
import { demoStageForOrderId } from "@/lib/tracking-stage";
import { usePersistHydrated } from "@/lib/use-persist-hydrated";
import { useCustomerOrders } from "@/stores/customer-orders";

type OrderTrackingProps = {
  orderId: string;
};

export function OrderTracking({ orderId }: OrderTrackingProps) {
  const hydrated = usePersistHydrated();
  const placed = useCustomerOrders((state) =>
    state.orders.find((order) => order.id === orderId),
  );
  const currentStageId = placed?.stage ?? demoStageForOrderId(orderId);
  const current = DELIVERY_STAGES[getDeliveryStageIndex(currentStageId)];

  return (
    <PageFrame>
      <OrderHeader title="Track order" backHref="/" backLabel="Back home" />

      <div className="flex flex-1 flex-col px-5 pt-6 pb-8">
        <section className="mb-6">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-green">
            Live delivery
          </p>
          <h2 className="mt-2 text-[28px] font-semibold leading-[1.15] tracking-tight text-ink">
            {current?.title ?? "On the way"}
          </h2>
          <p className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-ink-muted">
            {current?.detail ?? "Your rider is en route to your address."}
          </p>
        </section>

        <section className="mb-6 overflow-hidden rounded-2xl border border-border bg-surface-soft shadow-gasgo-soft">
          <DeliveryTruck
            variant="tracking"
            size="lg"
            label={`${current?.title ?? "On the way"} — ${current?.detail ?? "Your rider is en route to your address."}`}
            showLabel={false}
            className="px-1 pb-1 pt-4"
          />
        </section>

        <section className="mb-6 rounded-2xl border border-border bg-surface px-4 py-4 shadow-gasgo-soft">
          <p className="text-sm font-medium text-ink-muted">Order</p>
          <p className="mt-1 font-mono text-[17px] font-semibold tracking-tight text-ink">
            {placed?.orderNumber ?? orderId}
          </p>
          {hydrated && placed ? (
            <div className="mt-3 space-y-1.5 text-sm text-ink-muted">
              <p className="font-medium text-ink">{placed.fillSummary}</p>
              <p>{fulfillmentLabel(placed.fulfillmentMode)}</p>
              <p>
                Pickup {formatCalendarDate(placed.pickupDate)} · return{" "}
                {formatCalendarDate(placed.returnDate)}
              </p>
            </div>
          ) : null}
        </section>

        <section className="mb-32 rounded-2xl border border-border bg-surface px-4 py-5 shadow-gasgo-soft">
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-ink-muted">
            Delivery progress
          </h3>
          <TrackingTimeline currentStageId={currentStageId} />
        </section>
      </div>

      <StickyAction>
        <p className="mb-2.5 text-center text-sm text-ink-muted">
          Rider running late? Talk to us on WhatsApp.
        </p>
        <WhatsAppSupportButton orderId={orderId} />
        <Link
          href="/order/cylinder"
          className={buttonClassName({ variant: "secondary", size: "md" }, "mt-3 h-12 w-full")}
        >
          Order again
        </Link>
      </StickyAction>
    </PageFrame>
  );
}
