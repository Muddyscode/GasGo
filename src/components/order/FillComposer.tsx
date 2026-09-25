"use client";

import { useRouter } from "next/navigation";
import { OrderHeader } from "@/components/order/OrderHeader";
import { OrderSection, orderFieldClassName } from "@/components/order/OrderSection";
import { PriceBreakdown } from "@/components/order/PriceBreakdown";
import { RadioMark } from "@/components/order/RadioMark";
import {
  fillStickyHint,
  PLANT_REFILL_LINE,
} from "@/components/order/order-quote-hint";
import { buttonClassName } from "@/components/ui/button";
import { interactiveCardClassName, selectedCardClassName } from "@/components/ui/card";
import { PageBody, PageFrame, PageTitle, StickyAction } from "@/components/ui/page";
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

const COMMON_CAPACITIES_KG = [6, 12.5, 25, 50] as const;

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
        <PageTitle eyebrow="Port Harcourt plant refill" subtitle={PLANT_REFILL_LINE}>
          What should we fill?
        </PageTitle>

        <ol className="mb-8 grid grid-cols-3 gap-2 rounded-2xl border border-border bg-surface px-3 py-3.5">
          {["Collect empty", "Plant refill", "Return filled"].map((step, index) => (
            <li key={step} className="min-w-0 text-center">
              <span className="block font-display text-[13px] font-semibold tabular-nums text-brand-green">
                {index + 1}
              </span>
              <span className="mt-0.5 block text-[12px] font-medium leading-snug text-ink">
                {step}
              </span>
            </li>
          ))}
        </ol>

        <OrderSection
          title="Cylinder capacity"
          hint="Type the kilograms stamped on your cylinder. Common sizes are shortcuts, not a product list."
        >
          <label className="block">
            <span className="sr-only">Cylinder capacity in kilograms</span>
            <div className="relative">
              <input
                name="capacityKg"
                type="number"
                min={1}
                max={50}
                step={0.5}
                inputMode="decimal"
                autoComplete="off"
                value={capacityKg ?? ""}
                placeholder="12.5"
                onChange={(event) => {
                  const raw = event.target.value;
                  if (raw === "") {
                    setCapacityKg(0);
                    return;
                  }
                  const next = Number(raw);
                  if (Number.isFinite(next)) setCapacityKg(next);
                }}
                className={cn(orderFieldClassName, "pr-14 font-display text-[22px] font-semibold")}
              />
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-medium text-ink-muted">
                kg
              </span>
            </div>
          </label>
          <div
            role="group"
            aria-label="Common capacities"
            className="mt-3 flex flex-wrap gap-2"
          >
            {COMMON_CAPACITIES_KG.map((size) => {
              const selected = capacityKg === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setCapacityKg(size)}
                  className={cn(
                    "inline-flex h-10 items-center rounded-full border px-3.5 text-[13px] font-semibold tabular-nums",
                    "transition-[background-color,border-color,transform] duration-150 active:scale-[0.98]",
                    selected
                      ? "border-brand-green bg-surface-soft text-ink shadow-gasgo-soft"
                      : "border-border bg-surface text-ink-muted hover:border-brand-green/35 hover:text-ink",
                  )}
                >
                  {formatKg(size)} kg
                </button>
              );
            })}
          </div>
        </OrderSection>

        <OrderSection
          title="Fill mode"
          hint={`Live rate ${formatNaira(LIVE_RATE_NGN_PER_KG)}/kg. Transport is added with your address — not a flat fee.`}
        >
          <div role="radiogroup" aria-label="Fill mode" className="flex flex-col gap-2.5">
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
                    "flex w-full items-center gap-3.5 px-4 py-4 text-left",
                    selected && selectedCardClassName,
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[17px] font-semibold tracking-tight text-ink">
                      {FILL_COPY[mode].title}
                    </span>
                    <span className="mt-0.5 block text-sm leading-snug text-ink-muted">
                      {FILL_COPY[mode].hint}
                    </span>
                  </span>
                  <RadioMark selected={selected} />
                </button>
              );
            })}
          </div>

          {fillMode === "kg" ? (
            <label className="mt-3 block">
              <span className="mb-1.5 block text-sm font-medium text-ink">
                Kilograms to fill
              </span>
              <input
                name="fillKg"
                type="number"
                min={0.5}
                max={capacityKg ?? 50}
                step={0.5}
                inputMode="decimal"
                autoComplete="off"
                value={fillKg ?? ""}
                placeholder="6"
                onChange={(event) => {
                  const next = Number(event.target.value);
                  if (Number.isFinite(next)) setFillKg(next);
                }}
                className={orderFieldClassName}
              />
            </label>
          ) : null}

          {fillMode === "naira" ? (
            <label className="mt-3 block">
              <span className="mb-1.5 block text-sm font-medium text-ink">Spend (₦)</span>
              <input
                name="spendNaira"
                type="number"
                min={500}
                step={100}
                inputMode="numeric"
                autoComplete="off"
                value={spendNaira ?? ""}
                placeholder="10000"
                onChange={(event) => {
                  const next = Number(event.target.value);
                  if (Number.isFinite(next)) setSpendNaira(next);
                }}
                className={orderFieldClassName}
              />
            </label>
          ) : null}
        </OrderSection>

        {live.fillKg > 0 ? <PriceBreakdown quote={toOrderQuote(live)} /> : null}
      </PageBody>

      <StickyAction>
        <p
          className={cn(
            "mb-2.5 min-h-5 text-center text-sm tabular-nums text-ink-muted transition-opacity duration-150",
            ready ? "opacity-100" : "opacity-0",
          )}
          aria-live="polite"
        >
          {ready ? fillStickyHint(live) : "Enter a capacity to continue"}
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
