import Link from "next/link";
import { OrderHeader } from "@/components/order/OrderHeader";
import { TrackingTimeline } from "@/components/order/TrackingTimeline";
import { WhatsAppSupportButton } from "@/components/order/WhatsAppSupportButton";
import { DELIVERY_STAGES, getDeliveryStageIndex } from "@/config/delivery-stages";
import { demoStageForOrderId } from "@/lib/tracking-stage";

type OrderTrackingProps = {
  orderId: string;
};

export function OrderTracking({ orderId }: OrderTrackingProps) {
  const currentStageId = demoStageForOrderId(orderId);
  const current = DELIVERY_STAGES[getDeliveryStageIndex(currentStageId)];

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
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

        <section className="mb-6 rounded-2xl border border-border bg-surface px-4 py-4 shadow-gasgo-soft">
          <p className="text-sm font-medium text-ink-muted">Order</p>
          <p className="mt-1 font-mono text-[17px] font-semibold tracking-tight text-ink">
            {orderId}
          </p>
        </section>

        <section className="mb-32 rounded-2xl border border-border bg-surface px-4 py-5 shadow-gasgo-soft">
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-ink-muted">
            Delivery progress
          </h3>
          <TrackingTimeline currentStageId={currentStageId} />
        </section>
      </div>

      <div className="sticky bottom-0 z-20 border-t border-border/80 bg-surface/95 px-5 pt-3 backdrop-blur-md pb-[max(1rem,env(safe-area-inset-bottom))]">
        <p className="mb-2.5 text-center text-sm text-ink-muted">
          Rider running late? Talk to us on WhatsApp.
        </p>
        <WhatsAppSupportButton orderId={orderId} />
        <Link
          href="/order/cylinder"
          className="mt-3 flex h-12 w-full items-center justify-center rounded-2xl bg-surface-muted text-[15px] font-semibold text-ink transition-transform duration-150 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
        >
          Order again
        </Link>
      </div>
    </div>
  );
}
