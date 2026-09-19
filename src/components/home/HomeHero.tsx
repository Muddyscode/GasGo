"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  GasGauge,
  clampPercent,
  type CalibrateAction,
} from "@/components/gauge";
import { DeliveryTruckMotion } from "@/components/motion/DeliveryTruckMotion";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { PressableLink } from "@/components/ui/Pressable";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { WideShell } from "@/components/ui/PageShell";
import { tactilePrimary, tactileSecondary } from "@/components/ui/tactile";
import { getMockOrders, getMockProfile, isOrderDelivered } from "@/data/profile";
import { cn } from "@/lib/utils";

const DEMO_PERCENT = 62;
const DEMO_DAYS_SINCE_ORDER = 8;
const DEMO_DAYS_RANGE: [number, number] = [12, 16];
const CALIBRATE_STEP = 8;
const FULL_DAYS_RANGE: [number, number] = [26, 32];
const FULL_CYLINDER_DAYS = 28;

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

export function HomeHero() {
  const [demo, setDemo] = useState<DemoLevel>(INITIAL_DEMO);
  const [calibratePop, setCalibratePop] = useState(false);
  const skipFirst = useRef(true);
  const profile = getMockProfile();
  const liveOrder = getMockOrders().find((order) => !isOrderDelivered(order));
  const firstName = profile.firstName?.trim() || "there";
  const greeting = `Welcome back, ${firstName}`;

  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    setCalibratePop(true);
    const timer = window.setTimeout(() => setCalibratePop(false), 320);
    return () => window.clearTimeout(timer);
  }, [demo.percent]);

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
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <WideShell className="flex flex-1 flex-col pb-28 pt-5 md:pb-16 md:pt-8">
        <section className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="min-w-0">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-green">
              {greeting}
            </p>
            <h2 className="mt-2 max-w-[16ch] text-[32px] font-semibold leading-[1.1] tracking-tight text-ink md:text-[44px] lg:text-[52px]">
              Know your gas.
            </h2>
            <p className="mt-3 max-w-[36ch] text-[15px] leading-relaxed text-ink-muted md:text-base">
              Your cylinder, estimated from your last refill. Order a fill and
              we’ll bring it to the door.
            </p>

            <div className="mt-6 hidden items-center gap-3 md:flex">
              <PressableLink href="/order/cylinder" className="min-w-[11rem]">
                Order gas
              </PressableLink>
              {liveOrder ? (
                <PressableLink
                  href={`/order/tracking/${encodeURIComponent(liveOrder.id)}`}
                  variant="secondary"
                  className="min-w-[11rem]"
                >
                  Track {liveOrder.orderNumber}
                </PressableLink>
              ) : null}
            </div>

            <SurfaceCard
              className={cn(
                "mt-8 hidden bg-surface shadow-gasgo-lg lg:block",
                calibratePop && "gauge-calibrate-pop",
              )}
            >
              <GasGauge
                percent={demo.percent}
                size="lg"
                daysSinceLastOrder={demo.daysSinceLastOrder}
                estimatedDaysRange={demo.estimatedDaysRange}
                onCalibrate={handleCalibrate}
                className="max-w-none"
              />
            </SurfaceCard>
          </div>

          <div className="relative">
            <EditorialImage
              src="/images/lit-stove.png"
              alt="Blue flame on a gas stove"
              priority
              overlay="brand"
              objectPosition="50% 40%"
              className="h-40 rounded-[28px] shadow-gasgo-lg md:h-56 lg:h-[36rem]"
              sizes="(min-width: 1024px) 42vw, 100vw"
            />
            <p className="pointer-events-none absolute left-4 top-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/90">
              Still cooking
            </p>

            <SurfaceCard
              className={cn(
                "relative z-10 mx-auto -mt-14 max-w-md bg-surface/95 shadow-gasgo-lg backdrop-blur-md lg:hidden",
                calibratePop && "gauge-calibrate-pop",
              )}
            >
              <GasGauge
                percent={demo.percent}
                size="hero"
                daysSinceLastOrder={demo.daysSinceLastOrder}
                estimatedDaysRange={demo.estimatedDaysRange}
                onCalibrate={handleCalibrate}
                className="max-w-none"
              />
            </SurfaceCard>
          </div>
        </section>

        <TrustRow className="mt-8" />

        <section className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2 lg:grid-cols-[1.15fr_0.85fr]">
          <SizeStory />
          <NeverRunOutTease />
        </section>

        <HowItArrives />
      </WideShell>

      <div className="sticky bottom-0 z-20 border-t border-border/80 bg-surface/95 px-5 pt-3 backdrop-blur-md pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
        <Link href="/order/cylinder" className={tactilePrimary()}>
          Order gas
        </Link>
      </div>
    </div>
  );
}

function TrustRow({ className }: { className?: string }) {
  return (
    <ul className={cn("grid grid-cols-3 gap-2.5", className)}>
      <TrustTile
        src="/images/cooking-gas-trolley.jpg"
        position="18% 50%"
        label="Doorstep"
        detail="Trolley to your gate"
      />
      <TrustTile
        src="/images/cooking-gas-filling-point.png"
        position="60% 40%"
        label="Filled fresh"
        detail="From the plant"
      />
      <TrustTile
        src="/images/cooking-gas-station.png"
        position="50% 35%"
        label="Same-day"
        detail="Lagos windows"
      />
    </ul>
  );
}

function TrustTile({
  src,
  position,
  label,
  detail,
}: {
  src: string;
  position: string;
  label: string;
  detail: string;
}) {
  return (
    <li className="overflow-hidden rounded-2xl border border-border bg-surface shadow-gasgo-soft">
      <EditorialImage
        src={src}
        alt=""
        objectPosition={position}
        overlay="ink"
        className="h-16 sm:h-20"
        sizes="30vw"
      />
      <div className="px-2.5 py-2">
        <p className="text-[12px] font-semibold tracking-tight text-ink sm:text-[13px]">
          {label}
        </p>
        <p className="text-[11px] leading-snug text-ink-muted">{detail}</p>
      </div>
    </li>
  );
}

function SizeStory() {
  return (
    <SurfaceCard padded={false} className="overflow-hidden">
      <EditorialImage
        src="/images/cooking-gas-cylinders.png"
        alt="Rows of cooking gas cylinders ready to fill"
        objectPosition="50% 70%"
        overlay="ink"
        className="h-40 md:h-48"
        sizes="(min-width: 768px) 40vw, 100vw"
      />
      <div className="px-4 py-4">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-green">
          Choose size
        </p>
        <h3 className="mt-1 text-[20px] font-semibold tracking-tight text-ink">
          6 kg to 50 kg, filled and delivered
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
          Pick the cylinder that matches how you cook. We’ll fill it at the plant
          and roll it to your door.
        </p>
        <Link href="/order/cylinder" className={cn(tactileSecondary(), "mt-4")}>
          See sizes
        </Link>
      </div>
    </SurfaceCard>
  );
}

function NeverRunOutTease() {
  return (
    <SurfaceCard className="relative overflow-hidden bg-surface-muted">
      <span
        aria-hidden="true"
        className="absolute inset-y-4 left-0 w-1 rounded-full bg-brand-yellow"
      />
      <EditorialImage
        src="/images/lit-gas.png"
        alt=""
        objectPosition="50% 45%"
        overlay="soft"
        className="mb-4 h-28 rounded-2xl"
        sizes="(min-width: 768px) 30vw, 100vw"
      />
      <div className="flex items-start justify-between gap-3 pl-2">
        <div className="min-w-0">
          <h3
            id="never-run-out-heading"
            className="text-[17px] font-semibold tracking-tight text-ink"
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
    </SurfaceCard>
  );
}

function HowItArrives() {
  return (
    <section className="mt-10 md:mt-14" aria-labelledby="how-it-arrives">
      <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-green">
            Delivery
          </p>
          <h3
            id="how-it-arrives"
            className="mt-1 text-[22px] font-semibold tracking-tight text-ink"
          >
            From plant to pot
          </h3>
        </div>
        <p className="max-w-[36ch] text-sm leading-relaxed text-ink-muted">
          A rider fills at the station, then brings the cylinder to your Lagos
          address.
        </p>
      </div>

      <DeliveryTruckMotion className="mb-4" label="GasGo rider en route" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <ArrivalShot
          src="/images/cooking-gas-field.png"
          alt="Gas storage field that supplies refills"
          caption="Plant stock"
          position="50% 60%"
        />
        <ArrivalShot
          src="/images/cooking-gas-station.png"
          alt="Cooking gas station tanks"
          caption="Station"
          position="50% 40%"
        />
        <ArrivalShot
          src="/images/cooking-gas-filling-point.png"
          alt="Cylinder filling point"
          caption="Fill"
          position="70% 50%"
        />
        <ArrivalShot
          src="/images/cooking-gas-trolley.jpg"
          alt="Cylinder on a delivery trolley"
          caption="Last metre"
          position="8% 40%"
        />
      </div>
    </section>
  );
}

function ArrivalShot({
  src,
  alt,
  caption,
  position,
}: {
  src: string;
  alt: string;
  caption: string;
  position: string;
}) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-border bg-surface shadow-gasgo-soft">
      <EditorialImage
        src={src}
        alt={alt}
        objectPosition={position}
        overlay="ink"
        className="h-28 md:h-36"
        sizes="(min-width: 1024px) 20vw, 45vw"
      />
      <figcaption className="px-3 py-2 text-[13px] font-semibold tracking-tight text-ink">
        {caption}
      </figcaption>
    </figure>
  );
}
