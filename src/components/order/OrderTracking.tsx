import Image from "next/image";
import Link from "next/link";
import { DeliveryTruck } from "@/components/motion/DeliveryTruck";
import { OrderHeader } from "@/components/order/OrderHeader";
import { TrackingTimeline } from "@/components/order/TrackingTimeline";
import { WhatsAppSupportButton } from "@/components/order/WhatsAppSupportButton";
import { buttonClassName } from "@/components/ui/button";
import { cardClassName } from "@/components/ui/card";
import { PageBody, PageFrame, PageTitle, StickyAction } from "@/components/ui/page";
import { DELIVERY_STAGES, getDeliveryStageIndex } from "@/config/delivery-stages";
import { demoStageForOrderId } from "@/lib/tracking-stage";

type OrderTrackingProps = {
  orderId: string;
};

export function OrderTracking({ orderId }: OrderTrackingProps) {
  const currentStageId = demoStageForOrderId(orderId);
  const current = DELIVERY_STAGES[getDeliveryStageIndex(currentStageId)];

  return (
    <PageFrame>
      <OrderHeader title="Track order" backHref="/" backLabel="Back home" />

      <PageBody className="pb-8">
        <PageTitle
          eyebrow="Live delivery"
          subtitle={current?.detail ?? "Your rider is en route to your address."}
        >
          {current?.title ?? "On the way"}
        </PageTitle>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <DeliveryTruck label="Your cylinder is moving" />

            <section className={`${cardClassName} mt-4 overflow-hidden`}>
              <div className="relative h-28">
                <Image
                  src="/images/cooking-gas-trolley.jpg"
                  alt="Cooking gas cylinder on a delivery trolley"
                  fill
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-cover object-left"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
                <div className="absolute inset-y-0 left-4 flex flex-col justify-center">
                  <p className="text-sm font-medium text-ink-muted">Order</p>
                  <p className="mt-1 font-mono text-[17px] font-semibold tracking-tight text-ink">
                    {orderId}
                  </p>
                </div>
              </div>
            </section>

            <section className={`${cardClassName} mt-4 px-4 py-5`}>
              <h3 className="mb-4 text-sm font-semibold tracking-wide text-ink-muted">
                Delivery progress
              </h3>
              <TrackingTimeline currentStageId={currentStageId} />
            </section>
          </div>

          <aside className="mt-4 hidden lg:col-span-5 lg:mt-0 lg:block">
            <div className={`${cardClassName} overflow-hidden`}>
              <div className="relative h-52">
                <Image
                  src="/images/cooking-gas-filling-point.png"
                  alt="Gas filling point preparing a cylinder"
                  fill
                  sizes="420px"
                  className="object-cover"
                />
              </div>
              <div className="px-4 py-4">
                <p className="text-[15px] font-semibold tracking-tight text-ink">
                  Filled at the plant, then rolled to your gate
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                  You’ll see each hop — queued, filling, en route, nearby, delivered.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </PageBody>

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
