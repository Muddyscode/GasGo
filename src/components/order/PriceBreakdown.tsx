import type { FulfillmentMode } from "@/config/fulfillment";
import type { OrderQuote } from "@/config/pricing";
import {
  PAYMENT_VARIANCE_COPY,
  prepayQuoteLines,
  visibleQuoteLines,
} from "@/config/pricing";
import { formatNaira } from "@/lib/money";

export function PriceBreakdown({
  quote,
  fulfillmentMode,
}: {
  quote: OrderQuote;
  fulfillmentMode?: FulfillmentMode;
}) {
  const lines = fulfillmentMode
    ? prepayQuoteLines(quote, fulfillmentMode)
    : visibleQuoteLines(quote);
  const hub = fulfillmentMode === "hub";

  return (
    <section className="rounded-2xl border border-border bg-surface px-4 py-4">
      <p className="font-display text-[15px] font-semibold tracking-tight text-ink">
        To pay before pickup
      </p>
      <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
        {hub ? "Hub self-collect is gas only — no transport fee. " : null}
        {PAYMENT_VARIANCE_COPY}
      </p>
      <dl className="mt-3 space-y-2.5">
        {lines.map((line) => (
          <div
            key={line.id}
            className="flex items-start justify-between gap-3 text-[15px]"
          >
            <dt className="leading-snug text-ink-muted">{line.label}</dt>
            <dd className="font-semibold tabular-nums text-ink">
              {formatNaira(line.amountNgn)}
            </dd>
          </div>
        ))}
        <div className="flex items-baseline justify-between gap-3 border-t border-border pt-3">
          <dt className="text-[15px] font-semibold tracking-tight text-ink">Total</dt>
          <dd className="font-display text-[22px] font-semibold tabular-nums tracking-tight text-ink">
            {formatNaira(quote.totalNgn)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
