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

  return (
    <section className="rounded-xl border border-border bg-surface px-4 py-3.5">
      <p className="text-sm font-medium text-ink-muted">To pay before pickup</p>
      <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
        {PAYMENT_VARIANCE_COPY}
      </p>
      <dl className="mt-2.5 space-y-2">
        {lines.map((line) => (
          <div
            key={line.id}
            className="flex items-center justify-between gap-3 text-[15px]"
          >
            <dt className="text-ink-muted">{line.label}</dt>
            <dd className="font-semibold tabular-nums text-ink">
              {formatNaira(line.amountNgn)}
            </dd>
          </div>
        ))}
        <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
          <dt className="text-base font-semibold tracking-tight text-ink">Total</dt>
          <dd className="text-xl font-semibold tabular-nums tracking-tight text-ink">
            {formatNaira(quote.totalNgn)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
