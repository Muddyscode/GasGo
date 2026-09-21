"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, UserRound } from "lucide-react";
import { formatCylinderSize, getCylinderById } from "@/config/cylinders";
import {
  isOrderDelivered,
  MOCK_ORDERS,
  orderHref,
  orderStage,
} from "@/data/profile";
import { cn } from "@/lib/utils";
import { useOrderDraft } from "@/stores/order-draft";

export function NavActions() {
  const pathname = usePathname();
  const cylinderId = useOrderDraft((state) => state.cylinderId);
  const isReadyForCheckout = useOrderDraft((state) => state.isReadyForCheckout);
  const cylinder = getCylinderById(cylinderId);
  const activeOrder = MOCK_ORDERS.find((order) => !isOrderDelivered(order));
  const stage = activeOrder ? orderStage(activeOrder) : undefined;
  const draftHref = isReadyForCheckout() ? "/order/checkout" : "/order/address";
  const onProfile = pathname.startsWith("/profile");

  return (
    <div className="flex items-center gap-1 sm:gap-1.5">
      {activeOrder ? (
        <Link
          href={orderHref(activeOrder)}
          className={cn(
            "inline-flex h-9 max-w-[9.5rem] items-center gap-1.5 rounded-full border border-brand-green/20 bg-surface-soft px-2.5",
            "text-[12px] font-semibold text-brand-green shadow-gasgo-soft",
            "transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "hover:shadow-gasgo-md active:scale-[0.97]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40",
          )}
        >
          <span className="relative flex size-1.5 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-green/50" />
            <span className="relative inline-flex size-1.5 rounded-full bg-brand-green" />
          </span>
          <span className="truncate">{stage?.title ?? "On the way"}</span>
        </Link>
      ) : null}

      {cylinder ? (
        <Link
          href={draftHref}
          aria-label={`Continue ${formatCylinderSize(cylinder.sizeKg)} order`}
          className={cn(
            "inline-flex h-9 items-center gap-1 rounded-full border border-border bg-white px-2.5",
            "text-[12px] font-semibold text-ink shadow-gasgo-soft",
            "transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "hover:shadow-gasgo-md active:scale-[0.97]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40",
          )}
        >
          <ShoppingBag className="size-3.5" strokeWidth={2} />
          <span className="hidden tabular-nums sm:inline">
            {formatCylinderSize(cylinder.sizeKg)}
          </span>
        </Link>
      ) : null}

      <Link
        href="/profile"
        aria-label="Profile"
        aria-current={onProfile ? "page" : undefined}
        className={cn(
          "inline-flex size-11 items-center justify-center rounded-full text-ink",
          "transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "hover:bg-surface-muted active:scale-[0.96]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40",
          onProfile && "bg-surface-soft text-brand-green",
        )}
      >
        <UserRound className="size-5" strokeWidth={1.75} />
      </Link>
    </div>
  );
}
