"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Flame, ShieldCheck } from "lucide-react";
import {
  GasGauge,
  clampPercent,
  type CalibrateAction,
} from "@/components/gauge";
import { buttonClassName } from "@/components/ui/button";
import { cardClassName } from "@/components/ui/card";
import { PageBody, PageFrame, StickyAction } from "@/components/ui/page";
import {
  activeOrderForUser,
  orderHref,
  orderStage,
  type CustomerOrder,
} from "@/data/profile";
import { greetingNow } from "@/lib/greeting";
import { formatNaira } from "@/lib/money";
import { cn } from "@/lib/utils";
import { useSession } from "@/stores/session";

const DEMO_PERCENT = 62;
const DEMO_DAYS_SINCE_ORDER = 8;
const DEMO_DAYS_RANGE: [number, number] = [12, 16];
const CALIBRATE_STEP = 8;
const FULL_DAYS_RANGE: [number, number] = [26, 32];
const FULL_CYLINDER_DAYS = 28;

const CALIBRATE_TOAST: Record<CalibrateAction, string> = {
  refilled: "Marked as full — enjoy the cook.",
  too_high: "Adjusted down. Your estimate is sharper.",
  too_low: "Adjusted up. Your estimate is sharper.",
};

function nudgeDaysRange(
  range: [number, number],
  deltaPercent: number,
): [number, number] {
  const daysDelta = Math.round((deltaPercent / 100) * FULL_CYLINDER_DAYS);
  return [
    Math.max(0, range[0] + daysDelta),
    Math.max(0, range[1] + daysDelta),
  ];
}

type DemoLevel = {
  percent: number;
  daysSinceLastOrder: number;
  estimatedDaysRange: [number, number];
};

const INITIAL_DEMO: DemoLevel = {
  percent: DEMO_PERCENT,
  daysSinceLastOrder: DEMO_DAYS_SINCE_ORDER,
  estimatedDaysRange: DEMO_DAYS_RANGE,
};

export function AppHome() {
  const user = useSession((state) => state.user);
  const greeting = useMemo(() => greetingNow(), []);
  const name = user?.firstName?.trim();
  const activeOrder = user ? activeOrderForUser(user.id) : undefined;

  return (
    <PageFrame>
      <PageBody className="pb-4 lg:pb-8">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-green">
          Port Harcourt · plant refill
        </p>
        <h1 className="mt-2 text-[28px] font-semibold leading-[1.15] tracking-tight text-ink md:text-[34px]">
          {name ? `${greeting}, ${name}` : greeting}
        </h1>
        <p className="mt-2 max-w-[40ch] text-[15px] leading-relaxed text-ink-muted">
          {activeOrder
            ? "Your refill is in motion. We collect the empty, fill it at the plant, and return it."
            : "Order a refill whenever you’re ready. Pay in full before we pick up the empty."}
        </p>

        <div className="mt-5 grid gap-3 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {activeOrder ? (
              <ActiveOrderCard order={activeOrder} />
            ) : (
              <OrderPromptCard />
            )}
          </div>
          <div className="lg:col-span-5">
            <SecondaryGauge />
          </div>
        </div>

        <section
          className={cn(
            cardClassName,
            "relative mt-3 overflow-hidden bg-surface-muted px-4 py-4",
          )}
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-3 left-0 w-1 rounded-full bg-brand-yellow"
          />
          <div className="flex items-start justify-between gap-3 pl-2">
            <div>
              <h2 className="text-[15px] font-semibold tracking-tight text-ink">
                Never run out
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                Auto-refill will watch your gauge later. Today it’s a teaser — we
                don’t place plant refills in the background.
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-border bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
              Coming soon
            </span>
          </div>
        </section>
      </PageBody>

      <StickyAction>
        {activeOrder ? (
          <Link
            href={orderHref(activeOrder)}
            className={buttonClassName({ variant: "primary", size: "lg" })}
          >
            Track this refill
          </Link>
        ) : (
          <Link
            href="/order/cylinder"
            className={buttonClassName({ variant: "primary", size: "lg" })}
          >
            <Flame className="size-4" strokeWidth={2.25} />
            Order a refill
          </Link>
        )}
      </StickyAction>
    </PageFrame>
  );
}

function ActiveOrderCard({ order }: { order: CustomerOrder }) {
  const stage = orderStage(order);
  return (
    <Link
      href={orderHref(order)}
      className={cn(
        cardClassName,
        "block overflow-hidden p-0",
        "motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-gasgo-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40",
      )}
    >
      <div className="relative h-36">
        <Image
          src="/images/cooking-gas-trolley.jpg"
          alt="Filled cylinder returning from the plant"
          fill
          sizes="(min-width: 1024px) 520px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />
        <div className="absolute inset-x-4 bottom-4 text-white">
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-white/80">
            Active order · {order.orderNumber}
          </p>
          <p className="mt-1 text-[18px] font-semibold tracking-tight">
            {stage?.title ?? "On the way"}
          </p>
          <p className="mt-0.5 text-sm text-white/85">
            {stage?.detail ?? "Collect → plant refill → return"}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-sm text-ink-muted">Pay already landed</p>
        <p className="text-sm font-semibold tabular-nums text-ink">
          {formatNaira(order.totalNgn)}
        </p>
      </div>
    </Link>
  );
}

function OrderPromptCard() {
  return (
    <Link
      href="/order/cylinder"
      className={cn(
        cardClassName,
        "block overflow-hidden p-0",
        "motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-gasgo-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40",
      )}
    >
      <div className="relative h-40">
        <Image
          src="/images/cooking-gas-filling-point.png"
          alt="Plant refill point for Port Harcourt cylinders"
          fill
          sizes="(min-width: 1024px) 520px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-transparent" />
        <div className="absolute inset-x-4 bottom-4 text-white">
          <p className="text-[18px] font-semibold tracking-tight">Order a plant refill</p>
          <p className="mt-0.5 text-sm text-white/85">
            Full, by kg, or by ₦ — live rate, zone fee on the next step.
          </p>
        </div>
      </div>
    </Link>
  );
}

function SecondaryGauge() {
  const [demo, setDemo] = useState<DemoLevel>(INITIAL_DEMO);
  const [flash, setFlash] = useState(false);

  const handleCalibrate = useCallback((action: CalibrateAction) => {
    setDemo((current) => {
      if (action === "refilled") {
        return {
          percent: 100,
          daysSinceLastOrder: 0,
          estimatedDaysRange: FULL_DAYS_RANGE,
        };
      }
      const delta = action === "too_high" ? -CALIBRATE_STEP : CALIBRATE_STEP;
      const next = clampPercent(current.percent + delta);
      return {
        ...current,
        percent: next,
        estimatedDaysRange:
          next === current.percent
            ? current.estimatedDaysRange
            : nudgeDaysRange(current.estimatedDaysRange, next - current.percent),
      };
    });
    setFlash(true);
    window.setTimeout(() => setFlash(false), 700);
    toast.success(CALIBRATE_TOAST[action]);
  }, []);

  return (
    <section className={cn(cardClassName, "relative overflow-hidden px-4 py-4")}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
            Gauge
          </p>
          <p className="text-sm text-ink-muted">Secondary — estimate only</p>
        </div>
        <ShieldCheck className="size-4 text-brand-green" strokeWidth={2} />
      </div>
      <GasGauge
        percent={demo.percent}
        size="sm"
        daysSinceLastOrder={demo.daysSinceLastOrder}
        estimatedDaysRange={demo.estimatedDaysRange}
        onCalibrate={handleCalibrate}
        flash={flash}
      />
    </section>
  );
}
