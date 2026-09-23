"use client";

import Link from "next/link";
import { DeliveryTruck, FadeLift, fadeLiftDelayMs } from "@/components/motion";
import { DemoStageStepper } from "@/components/order/DemoStageStepper";
import { OrderHeader } from "@/components/order/OrderHeader";
import { TrackingTimeline } from "@/components/order/TrackingTimeline";
import { WhatsAppSupportButton } from "@/components/order/WhatsAppSupportButton";
import { buttonClassName } from "@/components/ui/button";
import { cardClassName } from "@/components/ui/card";
import { PageBody, PageFrame, StickyAction } from "@/components/ui/page";
import { getWindowById } from "@/config/delivery";
import { getDeliveryStage } from "@/config/delivery-stages";
import {
  SAME_DAY_CUSTOMER_REMINDER,
  formatCalendarDate,
  fulfillmentLabel,
  isSameDayLoop,
} from "@/config/fulfillment";
import { PAYMENT_VARIANCE_COPY } from "@/config/pricing";
import {
  LATE_TRACKING_COPY,
  overlayPlacedTrackingOrder,
  resolveTrackingOrder,
} from "@/lib/tracking-stage";
import { usePersistHydrated } from "@/lib/use-persist-hydrated";
import { useCustomerOrders } from "@/stores/customer-orders";
import { cn } from "@/lib/utils";

type OrderTrackingProps = {
  orderId: string;
};

export function OrderTracking({ orderId }: OrderTrackingProps) {
  const hydrated = usePersistHydrated();
  const placed = useCustomerOrders((state) =>
    state.orders.find((order) => order.id === orderId || order.orderNumber === orderId),
  );
  const setStage = useCustomerOrders((state) => state.setStage);
  const resolved = resolveTrackingOrder(orderId);
  const order = placed ? overlayPlacedTrackingOrder(resolved, placed) : resolved;
  const stage = getDeliveryStage(order.stageId);
  const window = getWindowById(order.windowId);
  const lateCopy =
    order.lateKind === "handover_failed"
      ? LATE_TRACKING_COPY.handoverFailed
      : LATE_TRACKING_COPY.behindSchedule;
  const title = order.late ? lateCopy.title : (stage?.title ?? "Plant refill loop");
  const detail = order.late ? lateCopy.body : (stage?.detail ?? "Collect empty, plant fill, return full.");
  const nowLabel = stage?.now ?? "We’re on this loop";
  const nextLabel = stage?.next ?? "WhatsApp us if you need a hand";
  const sameDay =
    order.pickupDate && order.returnDate
      ? isSameDayLoop(order.pickupDate, order.returnDate)
      : false;
  const supportId = order.orderNumber || order.id;
  const paidSummary = hydrated && placed ? placed : null;

  if (!hydrated) {
    return (
      <PageFrame className="overflow-hidden">
        <OrderHeader title="Track order" backHref="/" backLabel="Back home" />
        <PageBody className="pb-4">
          <div className={`${cardClassName} h-40 animate-pulse bg-surface-muted`} />
        </PageBody>
      </PageFrame>
    );
  }

  return (
    <PageFrame className="overflow-hidden">
      <OrderHeader title="Track order" backHref="/" backLabel="Back home" />

      <PageBody className="pb-4">
        <FadeLift>
          <section className="mb-5">
            <p
              className={cn(
                "text-[13px] font-medium",
                order.late ? "text-brand-red" : "text-brand-green",
              )}
            >
              {order.late ? LATE_TRACKING_COPY.eyebrow : "Plant refill"}
            </p>
            <h2
              className={cn(
                "mt-2 text-[28px] font-semibold leading-[1.15] tracking-tight",
                order.late ? "text-brand-red" : "text-ink",
              )}
            >
              {title}
            </h2>
            <p className="mt-2 max-w-[38ch] text-[15px] leading-relaxed text-ink-muted">
              {detail}
            </p>
          </section>
        </FadeLift>

        {order.late ? (
          <FadeLift delayMs={fadeLiftDelayMs(1)} className="mb-5">
            <section
              className="rounded-2xl border border-brand-red/30 bg-brand-red/10 px-4 py-4"
              role="status"
            >
              <p className="text-sm font-semibold text-brand-red">Talk to us now</p>
              <p className="mt-1 text-sm leading-relaxed text-ink">
                WhatsApp is the fastest way to reach dispatch about this delay.
              </p>
              <WhatsAppSupportButton orderId={supportId} late className="mt-3" />
            </section>
          </FadeLift>
        ) : null}

        <FadeLift delayMs={fadeLiftDelayMs(order.late ? 2 : 1)} className="mb-5">
          <div className="grid gap-2 sm:grid-cols-2">
            <NowNextCard tone={order.late ? "critical" : "safe"} label="Now" body={nowLabel} />
            <NowNextCard tone="next" label="Next" body={nextLabel} />
          </div>
        </FadeLift>

        <FadeLift delayMs={fadeLiftDelayMs(order.late ? 3 : 2)} className="mb-5">
          <section
            className="overflow-hidden rounded-2xl border border-border bg-surface-soft shadow-gasgo-soft"
            data-tracking-motion="truck"
            data-late={order.late ? "true" : "false"}
          >
            <DeliveryTruck
              variant="tracking"
              size="lg"
              label={`${title} — ${nowLabel}. Next: ${nextLabel}`}
              showLabel={false}
              className="px-1 pb-1 pt-4"
            />
          </section>
        </FadeLift>

        <FadeLift delayMs={fadeLiftDelayMs(order.late ? 4 : 3)} className="mb-5">
          <section className={`${cardClassName} px-4 py-4`}>
            <p className="text-sm font-medium text-ink-muted">Order number</p>
            <p className="mt-1 font-mono text-[17px] font-semibold tracking-tight text-ink">
              {supportId}
            </p>
            {paidSummary ? (
              <div className="mt-3 space-y-1.5 text-sm text-ink-muted">
                <p className="font-medium text-ink">{paidSummary.fillSummary}</p>
                <p>{fulfillmentLabel(paidSummary.fulfillmentMode)}</p>
                <p className="leading-relaxed">{PAYMENT_VARIANCE_COPY}</p>
              </div>
            ) : null}
          </section>
        </FadeLift>

        {order.pickupDate || order.returnDate || window ? (
          <FadeLift delayMs={fadeLiftDelayMs(order.late ? 5 : 4)} className="mb-5">
            <section className={`${cardClassName} px-4 py-4`}>
              <p className="text-sm font-medium text-ink-muted">Pickup & return</p>
              {order.pickupDate ? (
                <DateLine label="Pickup" value={formatCalendarDate(order.pickupDate)} />
              ) : null}
              {order.returnDate ? (
                <DateLine label="Return" value={formatCalendarDate(order.returnDate)} />
              ) : null}
              {window ? (
                <DateLine label="Window" value={`${window.title} — ${window.detail}`} />
              ) : null}
              {sameDay ? (
                <p className="mt-3 rounded-xl bg-surface-soft px-3 py-2.5 text-sm leading-relaxed text-ink">
                  {SAME_DAY_CUSTOMER_REMINDER}
                </p>
              ) : null}
            </section>
          </FadeLift>
        ) : null}

        <FadeLift delayMs={fadeLiftDelayMs(order.late ? 6 : 5)}>
          <section className={`${cardClassName} px-4 py-5`}>
            <h3 className="mb-4 text-sm font-semibold tracking-wide text-ink-muted">
              Loop progress
            </h3>
            <TrackingTimeline currentStageId={order.stageId} late={order.late} />
          </section>
        </FadeLift>

        {placed ? (
          <FadeLift delayMs={fadeLiftDelayMs(order.late ? 7 : 6)} className="mt-5">
            <DemoStageStepper
              orderId={placed.id}
              stageId={order.stageId}
              onStage={(stageId) => setStage(placed.id, stageId)}
            />
          </FadeLift>
        ) : null}
      </PageBody>

      <StickyAction
        className={cn(order.late && "border-brand-red/30 bg-surface")}
      >
        <p
          className={cn(
            "mb-2.5 text-center text-sm",
            order.late ? "font-medium text-brand-red" : "text-ink-muted",
          )}
        >
          {order.late
            ? "We’re late — WhatsApp is the fastest way to reach us."
            : "Need a hand on this loop? Talk to us on WhatsApp."}
        </p>
        <WhatsAppSupportButton orderId={supportId} late={order.late} />
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

function NowNextCard({
  label,
  body,
  tone,
}: {
  label: string;
  body: string;
  tone: "safe" | "critical" | "next";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3",
        tone === "safe" && "border-brand-green/25 bg-surface-soft",
        tone === "critical" && "border-brand-red/30 bg-brand-red/10",
        tone === "next" && "border-border bg-surface-muted",
      )}
    >
      <p
        className={cn(
          "text-[12px] font-medium",
          tone === "critical" ? "text-brand-red" : "text-ink-muted",
        )}
      >
        {label}
      </p>
      <p className="mt-1 text-[15px] font-semibold leading-snug tracking-tight text-ink">
        {body}
      </p>
    </div>
  );
}

function DateLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-3">
      <p className="text-sm font-medium text-ink-muted">{label}</p>
      <p className="mt-0.5 text-[15px] font-semibold leading-snug tracking-tight text-ink">
        {value}
      </p>
    </div>
  );
}
