"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, UserRound } from "lucide-react";
import { formatKg } from "@/config/pricing";
import {
  activeOrderForUser,
  orderHref,
  orderStage,
} from "@/data/profile";
import { cn } from "@/lib/utils";
import { usePersistHydrated } from "@/lib/use-persist-hydrated";
import { useCustomerOrders } from "@/stores/customer-orders";
import { useOrderDraft } from "@/stores/order-draft";
import { useSession } from "@/stores/session";

export function NavActions({ island = false }: { island?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = usePersistHydrated();
  const user = useSession((state) => state.user);
  const quote = useOrderDraft((state) => state.quote);
  const isReadyForCheckout = useOrderDraft((state) => state.isReadyForCheckout);
  const live = quote();
  const placed = useCustomerOrders((state) => state.orders);
  const activeOrder = user ? activeOrderForUser(user.id, placed) : undefined;
  const stage = activeOrder ? orderStage(activeOrder) : undefined;
  const onProfile = pathname.startsWith("/profile");

  function continueDraft() {
    if (isReadyForCheckout()) {
      router.push("/order/checkout");
      return;
    }
    router.push(live.fillKg > 0 ? "/order/address" : "/order/cylinder");
  }

  if (!hydrated) {
    return <div className="h-9 w-11" aria-hidden="true" />;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 sm:gap-1.5",
        island && "rounded-full bg-white py-0.5 pl-0.5 pr-1 shadow-gasgo-md ring-1 ring-black/5",
      )}
    >
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
          <span className="truncate">{stage?.title ?? "Plant refill loop"}</span>
        </Link>
      ) : null}

      {live.fillKg > 0 && !island ? (
        <button
          type="button"
          onClick={continueDraft}
          aria-label={`Continue ${formatKg(live.fillKg)} kg order`}
          className={cn(
            "inline-flex h-9 items-center gap-1 rounded-full border border-border bg-white px-2.5",
            "text-[12px] font-semibold text-ink shadow-gasgo-soft",
            "transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "hover:shadow-gasgo-md active:scale-[0.97]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40",
          )}
        >
          <ShoppingBag className="size-3.5" strokeWidth={2} />
          <span className="hidden tabular-nums sm:inline">{formatKg(live.fillKg)} kg</span>
        </button>
      ) : null}

      {user ? (
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
      ) : (
        <Link
          href="/login"
          className={cn(
            "inline-flex h-9 items-center rounded-full px-3",
            "text-[13px] font-semibold text-ink",
            "hover:bg-surface-muted",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40",
          )}
        >
          Sign in
        </Link>
      )}
    </div>
  );
}
