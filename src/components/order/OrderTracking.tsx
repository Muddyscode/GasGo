import Link from "next/link";
import { DeliveryTruckMotion } from "@/components/motion/DeliveryTruckMotion";
import { OrderHeader } from "@/components/order/OrderHeader";
import { TrackingTimeline } from "@/components/order/TrackingTimeline";
import { WhatsAppSupportButton } from "@/components/order/WhatsAppSupportButton";
import { OrderFlowShell } from "@/components/ui/PageShell";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { tactileSecondary } from "@/components/ui/tactile";
import { DELIVERY_STAGES, getDeliveryStageIndex } from "@/config/delivery-stages";
import { demoStageForOrderId } from "@/lib/tracking-stage";

type OrderTrackingProps = {
  orderId: string;
};

const MOVING_STAGES = new Set(["en_route", "nearby"]);

export function OrderTracking({ orderId }: OrderTrackingProps) {
  const currentStageId = demoStageForOrderId(orderId);
  const current = DELIVERY_STAGES[getDeliveryStageIndex(currentStageId)];
  const moving = MOVING_STAGES.has(currentStageId);

  return (
    <OrderFlowShell
      imageSrc="/images/cooking-gas-station.png"
      imageAlt="Cooking gas station supplying the refill"
      imagePosition="50% 40%"
    >
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

        {moving ? (
          <DeliveryTruckMotion
            className="mb-6"
            label={current?.title ?? "Rider on the way"}
          />
        ) : (
          <DeliveryTruckMotion
            className="mb-6 opacity-80"
            label={current?.title ?? "Delivery update"}
          />
        )}

        <SurfaceCard className="mb-6">
          <p className="text-sm font-medium text-ink-muted">Order</p>
          <p className="mt-1 font-mono text-[17px] font-semibold tracking-tight text-ink">
            {orderId}
          </p>
        </SurfaceCard>

        <SurfaceCard className="mb-32">
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-ink-muted">
            Delivery progress
          </h3>
          <TrackingTimeline currentStageId={currentStageId} />
        </SurfaceCard>
      </div>

      <div className="sticky bottom-0 z-20 border-t border-border/80 bg-surface/95 px-5 pt-3 backdrop-blur-md pb-[max(1rem,env(safe-area-inset-bottom))]">
        <p className="mb-2.5 text-center text-sm text-ink-muted">
          Rider running late? Talk to us on WhatsApp.
        </p>
        <WhatsAppSupportButton orderId={orderId} />
        <Link href="/order/cylinder" className={tactileSecondary("mt-3")}>
          Order again
        </Link>
      </div>
    </OrderFlowShell>
  );
}
