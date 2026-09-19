import Link from "next/link";
import { StageBadge } from "@/components/admin/StageBadge";
import { StageUpdater } from "@/components/admin/StageUpdater";
import { formatCylinderSize, getCylinderById } from "@/config/cylinders";
import { getPresenceById } from "@/config/delivery";
import type { DeliveryStageId } from "@/config/delivery-stages";
import type { AdminOrder } from "@/lib/admin/orders";
import { formatPhone, formatPlacedAt } from "@/lib/admin/time";

type OrderCardProps = {
  order: AdminOrder;
  pending?: boolean;
  onStageChange: (id: string, stage: DeliveryStageId) => void;
};

export function OrderCard({ order, pending = false, onStageChange }: OrderCardProps) {
  const cylinder = getCylinderById(order.cylinderId);
  const presence = getPresenceById(order.presenceId);
  const size = cylinder ? formatCylinderSize(cylinder.sizeKg) : `${order.cylinderId} kg`;

  return (
    <article className="rounded-2xl border border-border bg-surface px-3.5 py-3 shadow-gasgo-soft">
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/admin/orders/${encodeURIComponent(order.id)}`}
          className="min-w-0 font-mono text-[15px] font-semibold tracking-tight text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
        >
          {order.orderNumber}
        </Link>
        <StageBadge stage={order.stage} />
      </div>

      <p className="mt-1.5 truncate text-[15px] font-medium text-ink">
        {order.customerName}
        <span className="font-normal text-ink-muted">
          {" · "}
          {formatPhone(order.customerPhone)}
        </span>
      </p>

      <p className="mt-1 text-sm text-ink-muted">
        {size}
        {order.quantity > 1 ? ` × ${order.quantity}` : ""}
        {" · "}
        {order.area}
      </p>
      <p className="mt-0.5 text-sm text-ink-muted">
        {presence?.title ?? order.presenceId}
        {" · "}
        <time dateTime={order.placedAt}>{formatPlacedAt(order.placedAt)}</time>
      </p>

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
