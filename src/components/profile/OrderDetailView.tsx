import Link from "next/link";
import { formatInTimeZone } from "date-fns-tz";
import { OrderHeader } from "@/components/order/OrderHeader";
import { WhatsAppSupportButton } from "@/components/order/WhatsAppSupportButton";
import { FocusShell } from "@/components/ui/PageShell";
import { PressableLink } from "@/components/ui/Pressable";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { tactileSecondary } from "@/components/ui/tactile";
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
      <FocusShell>
        <OrderHeader title="Order" backHref="/profile" backLabel="Back to profile" />
        <main className="flex flex-1 flex-col px-5 pt-10">
          <h2 className="text-[28px] font-semibold leading-[1.15] tracking-tight text-ink">
            Order not found
          </h2>
          <p className="mt-2 max-w-[32ch] text-[15px] leading-relaxed text-ink-muted">
            That refill isn’t on this device. Check your history or start a new order.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <PressableLink href="/profile">Back to profile</PressableLink>
            <PressableLink href="/order/cylinder" variant="secondary" size="md">
              Order gas
            </PressableLink>
          </div>
        </main>
      </FocusShell>
    );
  }

  const stage = orderStage(order);
  const address = orderAddress(order);
  const placed = formatInTimeZone(order.placedAt, "Africa/Lagos", "d MMMM yyyy · h:mm a");

  return (
    <FocusShell>
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

        <SurfaceCard className="mt-6">
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
        </SurfaceCard>

        <p className="mt-4 text-sm leading-relaxed text-ink-muted">
          {stage?.detail ?? "This refill is complete."}
        </p>
      </main>

      <div className="sticky bottom-0 z-20 border-t border-border/80 bg-surface/95 px-5 pt-3 backdrop-blur-md pb-[max(1rem,env(safe-area-inset-bottom))]">
        <WhatsAppSupportButton orderId={order.id} />
        <Link href="/order/cylinder" className={tactileSecondary("mt-3 h-12 text-[15px]")}>
          Order again
        </Link>
      </div>
    </FocusShell>
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
