"use client";

import { useEffect, useState } from "react";
import { OrderHeader } from "@/components/order/OrderHeader";
import { StageBadge } from "@/components/admin/StageBadge";
import { StageUpdater } from "@/components/admin/StageUpdater";
import { formatCylinderSize, getCylinderById } from "@/config/cylinders";
import { getPresenceById, getWindowById } from "@/config/delivery";
import { getDeliveryStage, type DeliveryStageId } from "@/config/delivery-stages";
import {
  HUB_CONFIGURED_STUB_LABEL,
  SAME_DAY_OPS_REMINDER,
  formatCalendarDate,
  fulfillmentLabel,
  isSameDayLoop,
} from "@/config/fulfillment";
import {
  formatFillSummary,
  getOrder,
  getOrdersSnapshot,
  subscribeOrders,
  updateOrderStage,
  type AdminOrder,
} from "@/lib/admin/orders";
import { formatPhone, formatPlacedAtExact } from "@/lib/admin/time";

type OrderDetailViewProps = {
  orderId: string;
};

export function OrderDetailView({ orderId }: OrderDetailViewProps) {
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let alive = true;
    void getOrder(orderId).then((data) => {
      if (!alive) return;
      setOrder(data);
      setLoading(false);
    });
    const unsub = subscribeOrders(() => {
      const next = getOrdersSnapshot().find((item) => item.id === orderId) ?? null;
      setOrder(next);
    });
    return () => {
      alive = false;
      unsub();
    };
  }, [orderId]);

  async function handleStageChange(stage: DeliveryStageId) {
    if (!order) return;
    const previous = order;
    setOrder({ ...order, stage });
    setPending(true);
    try {
      await updateOrderStage(order.id, stage);
    } catch {
      setOrder(previous);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <OrderHeader title="Order" backHref="/admin" backLabel="Back to dispatch" />

      <div className="flex flex-1 flex-col px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {loading ? (
          <DetailSkeleton />
        ) : !order ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface-muted px-4 py-10 text-center">
            <p className="text-[17px] font-semibold tracking-tight text-ink">
              Order not found
            </p>
            <p className="mt-1.5 text-sm text-ink-muted">
              It may have been removed from this mock board.
            </p>
          </div>
        ) : (
          <DetailBody
            order={order}
            pending={pending}
            onStageChange={handleStageChange}
          />
        )}
      </div>
    </div>
  );
}

function DetailBody({
  order,
  pending,
  onStageChange,
}: {
  order: AdminOrder;
  pending: boolean;
  onStageChange: (stage: DeliveryStageId) => void;
}) {
  const cylinder = getCylinderById(order.cylinderId);
  const presence = getPresenceById(order.presenceId);
  const window = getWindowById(order.windowId);
  const stage = getDeliveryStage(order.stage);
  const size = cylinder ? formatCylinderSize(cylinder.sizeKg) : `${order.cylinderId} kg`;
  const sameDay = isSameDayLoop(order.pickupDate, order.returnDate);
  const hub = order.fulfillmentMode === "hub";

  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-lg font-semibold tracking-tight text-ink">
            {order.orderNumber}
          </p>
          <p className="mt-1 text-[15px] font-medium text-ink">{order.customerName}</p>
          <p className="text-sm text-ink-muted">{formatPhone(order.customerPhone)}</p>
        </div>
        <StageBadge stage={order.stage} />
      </div>

      <section className="mt-5 rounded-2xl border border-border bg-surface px-4 py-4 shadow-gasgo-soft">
        <DetailLine label="Cylinder" value={`${size}${order.quantity > 1 ? ` × ${order.quantity}` : ""}`} />
        <DetailLine label="Fill" value={formatFillSummary(order)} />
        <DetailLine label="Fulfillment" value={fulfillmentLabel(order.fulfillmentMode)} />
        <DetailLine label="Pickup date" value={formatCalendarDate(order.pickupDate)} />
        <DetailLine label="Return date" value={formatCalendarDate(order.returnDate)} />
        <DetailLine label="Window" value={window ? `${window.title} · ${window.detail}` : order.windowId} />
        <DetailLine label="Area" value={order.area} />
        <DetailLine label="Address" value={order.addressLine} />
        {hub ? null : (
          <DetailLine label="Presence" value={presence?.title ?? order.presenceId} />
        )}
        <DetailLine label="Placed" value={formatPlacedAtExact(order.placedAt)} />
        <DetailLine label="Stage" value={stage?.detail ?? order.stage} last />
      </section>

      {sameDay ? (
        <p
          className="mt-3 rounded-2xl border border-brand-green/25 bg-surface-soft px-3.5 py-3 text-sm leading-relaxed text-ink"
          role="status"
        >
          {SAME_DAY_OPS_REMINDER}
        </p>
      ) : null}

      <p className="mt-3 text-xs leading-relaxed text-ink-muted">
        Live ₦/kg and PH zones are {HUB_CONFIGURED_STUB_LABEL}. Admin fee UI
        later — no admin CRUD in this demo.
      </p>

      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold tracking-wide text-ink-muted">
          Update status
        </p>
        <StageUpdater
          orderId={order.id}
          stage={order.stage}
          pending={pending}
          onChange={onStageChange}
        />
      </div>
    </>
  );
}

function DetailLine({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div className={last ? "" : "mb-3"}>
      <p className="text-sm font-medium text-ink-muted">{label}</p>
      <p className="mt-0.5 text-[15px] font-semibold leading-snug tracking-tight text-ink">
        {value}
      </p>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="h-6 w-48 animate-pulse rounded bg-surface-muted" />
      <div className="mt-3 h-4 w-36 animate-pulse rounded bg-surface-muted" />
      <div className="mt-6 h-56 animate-pulse rounded-2xl bg-surface-muted" />
      <div className="mt-5 h-11 animate-pulse rounded-xl bg-surface-muted" />
    </div>
  );
}
