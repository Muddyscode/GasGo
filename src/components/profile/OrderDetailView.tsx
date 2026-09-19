import Link from "next/link";
import { formatInTimeZone } from "date-fns-tz";
import { OrderHeader } from "@/components/order/OrderHeader";
import { WhatsAppSupportButton } from "@/components/order/WhatsAppSupportButton";
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
      <div className="flex min-h-dvh flex-col bg-surface">
        <OrderHeader title="Order" backHref="/profile" backLabel="Back to profile" />
        <main className="flex flex-1 flex-col px-5 pt-10">
          <h2 className="text-[28px] font-semibold leading-[1.15] tracking-tight text-ink">
            Order not found
          </h2>
          <p className="mt-2 max-w-[32ch] text-[15px] leading-relaxed text-ink-muted">
            That refill isn’t on this device. Check your history or start a new order.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/profile"
              className="flex h-14 items-center justify-center rounded-2xl bg-brand-green text-base font-semibold text-white shadow-gasgo-md transition-transform duration-150 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
            >
              Back to profile
            </Link>
            <Link
              href="/order/cylinder"
              className="flex h-12 items-center justify-center rounded-2xl bg-surface-muted text-[15px] font-semibold text-ink transition-transform duration-150 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
            >
              Order gas
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const stage = orderStage(order);
  const address = orderAddress(order);
  const placed = formatInTimeZone(order.placedAt, "Africa/Lagos", "d MMMM yyyy · h:mm a");

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <OrderHeader
        title={order.orderNumber}
        backHref="/profile"
        backLabel="Back to profile"
      />

      <main className="flex flex-1 flex-col px-5 pt-6 pb-8">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-green">
          {stage?.title ?? "Order"}
        </p>
        <h2 className="mt-2 text-[28px] font-semibold leading-[1.15] tracking-tight text-ink">
          {orderCylinderLabel(order)}
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{placed}</p>

        <section className="mt-6 rounded-2xl border border-border bg-surface px-4 py-4 shadow-gasgo-soft">
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
      </main>

      <div className="sticky bottom-0 z-20 border-t border-border/80 bg-surface/95 px-5 pt-3 backdrop-blur-md pb-[max(1rem,env(safe-area-inset-bottom))]">
        <WhatsAppSupportButton orderId={order.id} />
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
