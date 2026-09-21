"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { OrderHeader } from "@/components/order/OrderHeader";
import { PriceBreakdown } from "@/components/order/PriceBreakdown";
import { buttonClassName } from "@/components/ui/button";
import { interactiveCardClassName, selectedCardClassName } from "@/components/ui/card";
import { PageBody, PageFrame, PageTitle, StickyAction } from "@/components/ui/page";
import { CYLINDER_OPTIONS, formatCylinderSize } from "@/config/cylinders";
import {
  FILL_MODES,
  LIVE_RATE_NGN_PER_KG,
  formatKg,
  toOrderQuote,
  type FillMode,
} from "@/config/pricing";
import { formatNaira } from "@/lib/money";
import { cn } from "@/lib/utils";
import { useOrderDraft } from "@/stores/order-draft";

const FILL_COPY: Record<FillMode, { title: string; hint: string }> = {
  full: {
    title: "Full",
    hint: "Fill the whole cylinder at the plant",
  },
  kg: {
    title: "By kg",
    hint: "Choose how many kilograms to put in",
  },
  naira: {
    title: "By ₦",
    hint: "Tell us a spend; we’ll convert at the live rate",
  },
};

export function FillComposer() {
  const router = useRouter();
  const capacityKg = useOrderDraft((state) => state.capacityKg);
  const fillMode = useOrderDraft((state) => state.fillMode);
  const fillKg = useOrderDraft((state) => state.fillKg);
  const spendNaira = useOrderDraft((state) => state.spendNaira);
  const setCapacityKg = useOrderDraft((state) => state.setCapacityKg);
  const setFillMode = useOrderDraft((state) => state.setFillMode);
  const setFillKg = useOrderDraft((state) => state.setFillKg);
  const setSpendNaira = useOrderDraft((state) => state.setSpendNaira);
  const quote = useOrderDraft((state) => state.quote);
  const isFillReady = useOrderDraft((state) => state.isFillReady);

  const live = quote();
  const ready = isFillReady();

  function handleContinue() {
    if (!ready) return;
    router.push("/order/address");
  }

  return (
    <PageFrame>
      <OrderHeader title="Your fill" backHref="/" backLabel="Go back" />

      <PageBody className="pb-8">
        <PageTitle
          eyebrow="Order gas · Port Harcourt"
          subtitle="We collect your empty cylinder, refill it offsite at the plant, and return it filled. You pay before pickup."
        >
          What should we fill?
        </PageTitle>

        <div className="relative mb-5 overflow-hidden rounded-[1.25rem] border border-border shadow-gasgo-md">
          <Image
            src="/images/cooking-gas-filling-point.png"
            alt="Cooking gas being filled at a plant, not at the doorstep"
            width={736}
            height={375}
            sizes="(max-width: 1024px) 100vw, 720px"
            className="h-32 w-full object-cover sm:h-40 lg:h-48"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
          <p className="absolute bottom-3 left-4 text-sm font-semibold text-white">
            Plant refill · Port Harcourt only
          </p>
        </div>

        <section className="mb-6">
          <h3 className="mb-2 text-sm font-semibold tracking-wide text-ink-muted">
            Cylinder capacity
          </h3>
          <div
            role="radiogroup"
            aria-label="Cylinder capacity"
            className="grid grid-cols-2 gap-3 md:grid-cols-4"
          >
            {CYLINDER_OPTIONS.map((option) => {
              const selected = capacityKg === option.sizeKg;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setCapacityKg(option.sizeKg)}
                  className={cn(
                    interactiveCardClassName,
                    "px-4 py-4 text-left",
                    selected && selectedCardClassName,
                  )}
                >
                  <span className="block text-[17px] font-semibold tracking-tight text-ink">
                    {formatCylinderSize(option.sizeKg)}
                  </span>
                  <span className="mt-0.5 block text-sm text-ink-muted">
                    {option.bestFor}
                  </span>
                </button>
              );
            })}
          </div>
          <label className="mt-3 block">
            <span className="mb-1.5 block text-sm font-medium text-ink">
              Or enter capacity (kg)
            </span>
            <input
              type="number"
              min={1}
              max={50}
              step={0.5}
              inputMode="decimal"
              value={capacityKg ?? ""}
              placeholder="12.5"
              onChange={(event) => {
                const next = Number(event.target.value);
                if (Number.isFinite(next)) setCapacityKg(next);
              }}
              className="h-12 w-full rounded-2xl border border-border bg-surface-muted px-4 text-[15px] text-ink outline-none focus:border-brand-green focus:bg-surface focus:ring-2 focus:ring-brand-green/20"
            />
          </label>
        </section>

        <section className="mb-6">
          <h3 className="mb-2 text-sm font-semibold tracking-wide text-ink-muted">
            Fill mode
          </h3>
          <div role="radiogroup" aria-label="Fill mode" className="grid grid-cols-3 gap-2">
            {FILL_MODES.map((mode) => {
              const selected = fillMode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setFillMode(mode)}
                  className={cn(
                    interactiveCardClassName,
                    "px-3 py-3 text-left",
                    selected && selectedCardClassName,
                  )}
                >
                  <span className="block text-[15px] font-semibold text-ink">
                    {FILL_COPY[mode].title}
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-snug text-ink-muted">
                    {FILL_COPY[mode].hint}
                  </span>
                </button>
              );
            })}
          </div>

          {fillMode === "kg" ? (
            <label className="mt-3 block">
              <span className="mb-1.5 block text-sm font-medium text-ink">Kilograms to fill</span>
              <input
                type="number"
                min={0.5}
                max={capacityKg ?? 50}
                step={0.5}
                inputMode="decimal"
                value={fillKg ?? ""}
                placeholder="6"
                onChange={(event) => {
                  const next = Number(event.target.value);
                  if (Number.isFinite(next)) setFillKg(next);
                }}
                className="h-12 w-full rounded-2xl border border-border bg-surface-muted px-4 text-[15px] text-ink outline-none focus:border-brand-green focus:bg-surface focus:ring-2 focus:ring-brand-green/20"
              />
            </label>
          ) : null}

          {fillMode === "naira" ? (
            <label className="mt-3 block">
              <span className="mb-1.5 block text-sm font-medium text-ink">
                Spend (₦)
              </span>
              <input
                type="number"
                min={500}
                step={100}
                inputMode="numeric"
                value={spendNaira ?? ""}
                placeholder="10000"
                onChange={(event) => {
                  const next = Number(event.target.value);
                  if (Number.isFinite(next)) setSpendNaira(next);
                }}
                className="h-12 w-full rounded-2xl border border-border bg-surface-muted px-4 text-[15px] text-ink outline-none focus:border-brand-green focus:bg-surface focus:ring-2 focus:ring-brand-green/20"
              />
            </label>
          ) : null}

          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Live rate {formatNaira(LIVE_RATE_NGN_PER_KG)}/kg. Zone pickup-and-return
            is added on the next step — not a flat fee.
          </p>
        </section>

        {live.fillKg > 0 ? (
          <PriceBreakdown quote={toOrderQuote(live)} />
        ) : null}
      </PageBody>

      <StickyAction>
        <p
          className={cn(
            "mb-2.5 min-h-5 text-center text-sm tabular-nums text-ink-muted transition-opacity duration-150",
            ready ? "opacity-100" : "opacity-0",
          )}
          aria-live="polite"
        >
          {ready
            ? `${formatKg(live.fillKg)} kg of ${formatKg(live.capacityKg)} kg · ${formatNaira(live.gasFillNgn)}`
            : "Choose a capacity to continue"}
        </p>
        <button
          type="button"
          disabled={!ready}
          onClick={handleContinue}
          className={buttonClassName(
            { variant: "primary", size: "lg" },
            !ready && "cursor-not-allowed bg-surface-muted text-ink-muted shadow-none hover:shadow-none",
          )}
        >
          Continue
        </button>
      </StickyAction>
    </PageFrame>
  );
}
