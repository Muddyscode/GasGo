import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { PressableLink } from "@/components/ui/Pressable";
import { tactile } from "@/components/ui/tactile";
import {
  isOrderDelivered,
  orderCylinderLabel,
  orderHref,
  orderStage,
  type CustomerOrder,
} from "@/data/profile";
import { formatNaira } from "@/lib/money";
import { cn } from "@/lib/utils";

type ProfileOrderHistoryProps = {
  orders: CustomerOrder[];
};

export function ProfileOrderHistory({ orders }: ProfileOrderHistoryProps) {
  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="text-[17px] font-semibold tracking-tight text-ink">
          Order history
        </h2>
        {orders.length > 0 ? (
          <p className="text-sm text-ink-muted">{orders.length} orders</p>
        ) : null}
      </div>

      {orders.length === 0 ? (
        <OrderHistoryEmpty />
      ) : (
        <ul className="flex flex-col gap-2.5">
          {orders.map((order) => (
            <li key={order.id}>
              <OrderRow order={order} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function OrderHistoryEmpty() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface-muted px-4 py-8 text-center">
      <p className="text-[17px] font-semibold tracking-tight text-ink">
        No orders yet
      </p>
      <p className="mx-auto mt-1.5 max-w-[28ch] text-sm leading-relaxed text-ink-muted">
        Your first refill will show up here, from queue to door.
      </p>
      <PressableLink href="/order/cylinder" size="md" className="mt-5 min-w-40">
        Order gas
      </PressableLink>
    </div>
  );
}

function OrderRow({ order }: { order: CustomerOrder }) {
  const stage = orderStage(order);
  const delivered = isOrderDelivered(order);
  const dateLabel = formatLagosDate(order.placedAt);

  return (
    <Link
      href={orderHref(order)}
      className={cn(
        "flex min-h-14 items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5 shadow-gasgo-soft",
        tactile.motion,
        tactile.press,
        tactile.lift,
        tactile.focus,
        "hover:border-ink-muted/25",
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="font-mono text-[13px] font-semibold tracking-tight text-ink">
            {order.orderNumber}
          </span>
          <StatusChip
            label={stage?.title ?? order.status}
            tone={delivered ? "safe" : order.status === "nearby" ? "caution" : "live"}
          />
        </span>
        <span className="mt-1 block text-sm text-ink-muted">
          {orderCylinderLabel(order)} · {dateLabel}
        </span>
      </span>

      <span className="shrink-0 text-right">
        <span className="block text-[15px] font-semibold tabular-nums tracking-tight text-ink">
          {formatNaira(order.totalNgn)}
        </span>
        <span className="mt-0.5 block text-[11px] font-medium text-ink-muted">
          {delivered ? "Details" : "Track"}
        </span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-ink-muted" strokeWidth={2} />
    </Link>
  );
}

function StatusChip({
  label,
  tone,
}: {
  label: string;
  tone: "safe" | "caution" | "live";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em]",
        tone === "safe" && "bg-brand-green/12 text-brand-green",
        tone === "caution" && "bg-brand-yellow/30 text-ink",
        tone === "live" && "bg-surface-soft text-brand-green",
      )}
    >
      {label}
    </span>
  );
}

function formatLagosDate(iso: string): string {
  try {
    return formatInTimeZone(iso, "Africa/Lagos", "d MMM");
  } catch {
    return format(new Date(iso), "d MMM");
  }
}
