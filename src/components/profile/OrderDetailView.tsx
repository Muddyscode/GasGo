import Link from "next/link";
import { formatInTimeZone } from "date-fns-tz";
import { OrderHeader } from "@/components/order/OrderHeader";
import { WhatsAppSupportButton } from "@/components/order/WhatsAppSupportButton";
import { buttonClassName } from "@/components/ui/button";
import { cardClassName } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageBody, PageFrame, StickyAction } from "@/components/ui/page";
import {
  getProfileOrderById,
  orderAddress,
  orderCylinderLabel,
  orderStage,
} from "@/data/profile";
import { formatNaira } from "@/lib/money";

type OrderDetailViewProps = {
  orderId: string;
};

export function OrderDetailView({ orderId }: OrderDetailViewProps) {
  const order = getProfileOrderById(orderId);

  if (!order) {
    return (
      <PageFrame>
        <OrderHeader title="Order" backHref="/profile" backLabel="Back to profile" />
        <PageBody className="pt-6">
          <EmptyState
            image="/images/cooking-gas-station.png"
            alt="Gas station with no matching order"
            title="Order not found"
            body="That refill isn’t on this device. Check your history or start a new order."
            action={
              <div className="flex flex-col gap-3">
                <Link
                  href="/profile"
                  className={buttonClassName({ variant: "primary", size: "lg" })}
                >
                  Back to profile
                </Link>
                <Link
                  href="/order/cylinder"
                  className={buttonClassName({ variant: "secondary", size: "lg" })}
                >
                  Order gas
                </Link>
              </div>
            }
          />
        </PageBody>
      </PageFrame>
    );
  }

  const stage = orderStage(order);
  const address = orderAddress(order);
  const placed = formatInTimeZone(order.placedAt, "Africa/Lagos", "d MMMM yyyy · h:mm a");

  return (
    <PageFrame>
      <OrderHeader
        title={order.orderNumber}
        backHref="/profile"
        backLabel="Back to profile"
      />

      <PageBody className="pb-8">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-green">
          {stage?.title ?? "Order"}
        </p>
        <h2 className="mt-2 text-[28px] font-semibold leading-[1.15] tracking-tight text-ink md:text-[32px]">
          {orderCylinderLabel(order)}
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{placed}</p>

        <section className={`${cardClassName} mt-6 px-4 py-4`}>
          <Row label="Order" value={order.orderNumber} mono />
          <Row label="Total" value={formatNaira(order.totalNgn)} />
          <Row
            label="Delivered to"
            value={
              address
                ? `${address.label} · ${address.line}, ${address.area}`
                : "Saved address"
            }
          />
        </section>

        <p className="mt-4 text-sm leading-relaxed text-ink-muted">
          {stage?.detail ?? "This refill is complete."}
        </p>
      </PageBody>

      <StickyAction>
        <WhatsAppSupportButton orderId={order.id} />
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

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="border-b border-border/70 py-3 last:border-b-0 last:pb-0 first:pt-0">
      <p className="text-sm font-medium text-ink-muted">{label}</p>
      <p
        className={
          mono
            ? "mt-1 font-mono text-[17px] font-semibold tracking-tight text-ink"
            : "mt-1 text-[17px] font-semibold tracking-tight text-ink"
        }
      >
        {value}
      </p>
    </div>
  );
}
