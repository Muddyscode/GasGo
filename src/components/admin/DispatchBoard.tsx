"use client";

import { useEffect, useMemo, useState } from "react";
import { DispatchEmpty } from "@/components/admin/DispatchEmpty";
import { DispatchHeader } from "@/components/admin/DispatchHeader";
import { DispatchSkeleton } from "@/components/admin/DispatchSkeleton";
import { FilterTabs } from "@/components/admin/FilterTabs";
import { OrderCard } from "@/components/admin/OrderCard";
import type { DeliveryStageId } from "@/config/delivery-stages";
import {
  DISPATCH_FILTERS,
  matchesDispatchFilter,
  type DispatchFilter,
} from "@/lib/admin/filters";
import {
  getOrdersSnapshot,
  listOrders,
  subscribeOrders,
  updateOrderStage,
  type AdminOrder,
} from "@/lib/admin/orders";

export function DispatchBoard() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<DispatchFilter>("all");
  const [query, setQuery] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    void listOrders().then((data) => {
      if (!alive) return;
      setOrders(data);
      setLoading(false);
    });
    const unsub = subscribeOrders(() => {
      setOrders(getOrdersSnapshot());
    });
    return () => {
      alive = false;
      unsub();
    };
  }, []);

  const counts = useMemo(() => {
    const next = {
      all: 0,
      pending: 0,
      out: 0,
      delivered: 0,
    } satisfies Record<DispatchFilter, number>;
    for (const order of orders) {
      for (const key of DISPATCH_FILTERS) {
        if (matchesDispatchFilter(order.stage, key)) next[key] += 1;
      }
    }
    return next;
  }, [orders]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase().replace(/\s+/g, "");
    return orders.filter((order) => {
      if (!matchesDispatchFilter(order.stage, filter)) return false;
      if (!needle) return true;
      const phone = order.customerPhone.replace(/\s+/g, "").toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(needle) ||
        phone.includes(needle) ||
        order.customerName.toLowerCase().includes(needle)
      );
    });
  }, [filter, orders, query]);

  async function handleStageChange(id: string, stage: DeliveryStageId) {
    const previous = orders;
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, stage } : order)),
    );
    setPendingId(id);
    try {
      await updateOrderStage(id, stage);
    } catch {
      setOrders(previous);
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-5xl flex-col bg-surface-muted">
      <DispatchHeader query={query} onQueryChange={setQuery} />

      <div className="px-4 pt-3 md:px-6">
        <FilterTabs value={filter} counts={counts} onChange={setFilter} />
      </div>

      <div className="flex flex-1 flex-col px-4 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:px-6">
        {loading ? (
          <DispatchSkeleton />
        ) : visible.length === 0 ? (
          <DispatchEmpty filter={filter} query={query} />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            {visible.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                pending={pendingId === order.id}
                onStageChange={handleStageChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
