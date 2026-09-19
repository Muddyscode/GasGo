"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, UserRound } from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { tactile } from "@/components/ui/tactile";
import { formatCylinderSize, getCylinderById } from "@/config/cylinders";
import { getMockOrders, isOrderDelivered } from "@/data/profile";
import { cn } from "@/lib/utils";
import { useOrderDraft } from "@/stores/order-draft";

type AppNavbarProps = {
  variant?: "app" | "flow";
  title?: string;
  backHref?: string;
  backLabel?: string;
  showProfile?: boolean;
  showStatusChip?: boolean;
};

export function AppNavbar({
  variant = "app",
  title,
  backHref,
  backLabel = "Go back",
  showProfile = true,
  showStatusChip = variant === "app",
}: AppNavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-surface/80 pt-[env(safe-area-inset-top)] shadow-gasgo-soft backdrop-blur-xl">
      <div
        className={cn(
          "mx-auto flex h-14 items-center gap-2 px-2",
          variant === "app" ? "max-w-6xl md:px-6" : "w-full",
        )}
      >
        {variant === "flow" && backHref ? (
          <Link
            href={backHref}
            aria-label={backLabel}
            className={cn(
              "inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink",
              tactile.motion,
              tactile.press,
              tactile.focus,
              "hover:bg-surface-muted",
            )}
          >
            <ChevronLeft className="size-6" strokeWidth={2} />
          </Link>
        ) : (
          <div className="pl-2">
            <BrandMark />
          </div>
        )}

        {variant === "flow" ? (
          <div className="flex min-w-0 flex-1 items-center justify-center pr-11">
            <h1 className="truncate text-[15px] font-semibold tracking-tight text-ink">
              {title}
            </h1>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        <div className="flex shrink-0 items-center gap-1 pr-1">
          {showStatusChip ? <StatusChip /> : null}
          {showProfile ? (
            <Link
              href="/profile"
              aria-label="Profile"
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-full text-ink",
                tactile.motion,
                tactile.press,
                tactile.focus,
                "hover:bg-surface-muted",
              )}
            >
              <UserRound className="size-5" strokeWidth={1.75} />
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function StatusChip() {
  const [hydrated, setHydrated] = useState(false);
  const cylinderId = useOrderDraft((state) => state.cylinderId);
  const address = useOrderDraft((state) => state.address);
  const presenceId = useOrderDraft((state) => state.presenceId);

  useEffect(() => {
    const finish = () => setHydrated(true);
    if (useOrderDraft.persist.hasHydrated()) finish();
    return useOrderDraft.persist.onFinishHydration(finish);
  }, []);

  const draftHref = draftContinueHref({
    cylinderId,
    hasAddress: Boolean(address),
    hasPresence: Boolean(presenceId),
  });
  const cylinder = getCylinderById(cylinderId);
  const liveOrder = getMockOrders().find((order) => !isOrderDelivered(order));

  if (hydrated && cylinderId) {
    return (
      <Link
        href={draftHref}
        className={cn(
          "hidden min-h-11 items-center rounded-full border border-border bg-surface px-3 text-[12px] font-semibold text-ink shadow-gasgo-soft sm:inline-flex",
          tactile.motion,
          tactile.press,
          tactile.focus,
          "hover:border-brand-green/35",
        )}
      >
        <span className="mr-1.5 size-1.5 rounded-full bg-brand-yellow" />
        {cylinder ? `Continue · ${formatCylinderSize(cylinder.sizeKg)}` : "Continue order"}
      </Link>
    );
  }

  if (!liveOrder) return null;

  return (
    <Link
      href={`/order/tracking/${encodeURIComponent(liveOrder.id)}`}
      className={cn(
        "inline-flex min-h-11 items-center rounded-full border border-brand-green/20 bg-surface-soft px-3 text-[12px] font-semibold text-brand-green shadow-gasgo-soft",
        tactile.motion,
        tactile.press,
        tactile.focus,
        "hover:border-brand-green/40",
      )}
    >
      <span className="mr-1.5 size-1.5 rounded-full bg-brand-green motion-safe:animate-pulse" />
      Track {liveOrder.orderNumber}
    </Link>
  );
}

function draftContinueHref({
  cylinderId,
  hasAddress,
  hasPresence,
}: {
  cylinderId: string | null;
  hasAddress: boolean;
  hasPresence: boolean;
}) {
  if (!cylinderId) return "/order/cylinder";
  if (!hasAddress || !hasPresence) return "/order/address";
  return "/order/checkout";
}
