"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Clock3, Flame, ShieldCheck } from "lucide-react";
import {
  GasGauge,
  clampPercent,
  type CalibrateAction,
} from "@/components/gauge";
import { PageBody, PageFrame, StickyAction } from "@/components/ui/page";
import { buttonClassName } from "@/components/ui/button";
import { cardClassName } from "@/components/ui/card";
import { greetingNow } from "@/lib/greeting";
import { cn } from "@/lib/utils";

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

type HomeHeroProps = {
  firstName?: string | null;
};

export function HomeHero({ firstName }: HomeHeroProps) {
  const [demo, setDemo] = useState<DemoLevel>(INITIAL_DEMO);
  const [flash, setFlash] = useState(false);
  const greeting = useMemo(() => greetingNow(), []);
  const name = firstName?.trim();

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
    <PageFrame>
      <PageBody className="pb-4 lg:pb-8">
        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-10">
          <section className="lg:col-span-6">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-green">
              Port Harcourt LPG, plant refill
            </p>
            <h2 className="mt-2 text-[28px] font-semibold leading-[1.15] tracking-tight text-ink md:text-[34px] lg:text-[40px]">
              {name ? `${greeting}, ${name}` : greeting}
            </h2>
            <p className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-ink-muted md:text-base">
              Your cylinder, estimated from your last refill. Order before the flame goes quiet.
            </p>

            <div className="relative mt-5 overflow-hidden rounded-[1.25rem] border border-border shadow-gasgo-md lg:hidden">
              <Image
                src="/images/lit-stove.png"
                alt="Blue flame on a cooking hob"
                width={720}
                height={405}
                priority
                sizes="(max-width: 1023px) 100vw, 0px"
                className="h-28 w-full object-cover sm:h-36"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
            </div>

            <div className="relative mt-5 overflow-hidden rounded-[1.5rem] border border-border bg-white px-4 pb-5 pt-5 shadow-gasgo-lg sm:px-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-8 top-6 h-40 rounded-full bg-brand-green/10 blur-3xl"
              />
              <GasGauge
                percent={demo.percent}
                size="hero"
                daysSinceLastOrder={demo.daysSinceLastOrder}
                estimatedDaysRange={demo.estimatedDaysRange}
                onCalibrate={handleCalibrate}
                flash={flash}
                className="relative"
              />
            </div>
          </section>

          <aside className="mt-5 flex flex-col gap-3 lg:col-span-6 lg:mt-12">
            <div className="relative hidden overflow-hidden rounded-[1.5rem] border border-border shadow-gasgo-md lg:block">
              <Image
                src="/images/lit-stove.png"
                alt="Blue flame on a cooking hob"
                width={720}
                height={405}
                priority
                sizes="(min-width: 1024px) 480px, 0px"
                className="h-56 w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-[15px] font-semibold tracking-tight text-white">
                Keep the kitchen lit — refill before you hit empty.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <NeverRunOutTease />
              <StoryCard
                icon={<Clock3 className="size-4" strokeWidth={2} />}
                title="Same-day Port Harcourt"
                body="Collect the empty, refill at the plant, return it filled — usually today."
              />
            </div>

            <Link
              href="/order/cylinder"
              className={cn(
                cardClassName,
                "group relative overflow-hidden p-0",
                "motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-gasgo-md",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40",
              )}
            >
              <div className="relative h-32 sm:h-36">
                <Image
                  src="/images/cooking-gas-cylinders.png"
                  alt="Rows of cooking gas cylinders ready for delivery"
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
                <div className="absolute inset-x-4 bottom-4 text-white">
                  <p className="text-[15px] font-semibold tracking-tight">
                    Choose your cylinder
                  </p>
                  <p className="mt-0.5 text-sm text-white/80">
                    Full, by kg, or by ₦ — refilled at the plant, never at your door.
                  </p>
                </div>
              </div>
            </Link>

            <div className="hidden items-center gap-2 text-sm text-ink-muted lg:flex">
              <ShieldCheck className="size-4 text-brand-green" strokeWidth={2} />
              Pay before pickup. Plant refill. WhatsApp if the rider runs late.
            </div>
          </aside>
        </div>
      </PageBody>

      <StickyAction>
        <Link href="/order/cylinder" className={buttonClassName({ variant: "primary", size: "lg" })}>
          <Flame className="size-4" strokeWidth={2.25} />
          Refill Now
        </Link>
      </StickyAction>
    </PageFrame>
  );
}

function NeverRunOutTease() {
  return (
    <section
      aria-labelledby="never-run-out-heading"
      className={cn(cardClassName, "relative overflow-hidden bg-surface-muted px-4 py-4")}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-3 left-0 w-1 rounded-full bg-brand-yellow"
      />
      <div className="flex items-start justify-between gap-3 pl-2">
        <div className="min-w-0">
          <h3
            id="never-run-out-heading"
            className="text-[15px] font-semibold tracking-tight text-ink"
          >
            Never run out
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">
            Auto-refill watches your gauge and delivers before you hit empty.
          </p>
        </div>
        <span className="mt-0.5 shrink-0 rounded-full border border-border bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
          Coming soon
        </span>
      </div>
    </section>
  );
}

function StoryCard({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <section className={cn(cardClassName, "px-4 py-4")}>
      <span className="inline-flex size-8 items-center justify-center rounded-full bg-surface-soft text-brand-green">
        {icon}
      </span>
      <h3 className="mt-3 text-[15px] font-semibold tracking-tight text-ink">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-ink-muted">{body}</p>
    </section>
  );
}
