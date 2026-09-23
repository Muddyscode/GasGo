import Link from "next/link";
import { StageBadge } from "@/components/admin/StageBadge";
import { StageUpdater } from "@/components/admin/StageUpdater";
import { getWindowById } from "@/config/delivery";
import {
  SAME_DAY_OPS_REMINDER,
  formatCalendarDate,
  fulfillmentLabel,
  isSameDayLoop,
} from "@/config/fulfillment";
import type { DeliveryStageId } from "@/config/delivery-stages";
import { formatFillSummary, type AdminOrder } from "@/lib/admin/orders";
import { formatPhone, formatPlacedAt } from "@/lib/admin/time";

type OrderCardProps = {
  order: AdminOrder;
  pending?: boolean;
  onStageChange: (id: string, stage: DeliveryStageId) => void;
};

export function OrderCard({ order, pending = false, onStageChange }: OrderCardProps) {
  const window = getWindowById(order.windowId);
  const sameDay = isSameDayLoop(order.pickupDate, order.returnDate);

  return (
    <article className="border-b border-border bg-surface px-4 py-4 last:border-b-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/admin/orders/${encodeURIComponent(order.id)}`}
            className="font-mono text-[15px] font-semibold tracking-tight text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
          >
            {order.orderNumber}
          </Link>
          <p className="mt-1 truncate text-[15px] font-medium text-ink">
            {order.customerName}
            <span className="font-normal text-ink-muted">
              {" "}
              {formatPhone(order.customerPhone)}
            </span>
          </p>
        </div>
        <StageBadge stage={order.stage} />
      </div>

      <p className="mt-2 text-sm text-ink-muted">
        {formatFillSummary(order)}
        {order.quantity > 1 ? ` × ${order.quantity}` : ""}
        {` — ${order.area}`}
      </p>
      <p className="mt-0.5 text-sm text-ink-muted">
        {fulfillmentLabel(order.fulfillmentMode)}
        {` — ${formatCalendarDate(order.pickupDate)} to ${formatCalendarDate(order.returnDate)}`}
      </p>
      <p className="mt-0.5 text-sm text-ink-muted">
        {window?.title ?? order.windowId}
        {` — `}
        <time dateTime={order.placedAt}>{formatPlacedAt(order.placedAt)}</time>
      </p>
      {sameDay ? (
        <p className="mt-1.5 text-xs font-medium leading-relaxed text-brand-green">
          {SAME_DAY_OPS_REMINDER}
        </p>
      ) : null}

      <div className="mt-3">
        <StageUpdater
          orderId={order.id}
          stage={order.stage}
          pending={pending}
          onChange={(stage) => onStageChange(order.id, stage)}
        />
      </div>
    </article>
  );
}
