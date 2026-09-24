import { CountUpNaira } from "@/components/motion";
import type { FulfillmentMode } from "@/config/fulfillment";
import type { OrderQuote } from "@/config/pricing";
import {
  PAYMENT_VARIANCE_COPY,
  prepayQuoteLines,
  visibleQuoteLines,
} from "@/config/pricing";

/**
 * Receipt-style pre-pay summary: no boxed card, thin dividers between lines,
 * the total carrying the visual weight. Totals count up/down as they change.
 */
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
    <section>
      <p className="font-display text-[15px] font-semibold tracking-tight text-ink">
        To pay before pickup
      </p>
      <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
        {hub ? "Hub self-collect is gas only — no transport fee. " : null}
        {PAYMENT_VARIANCE_COPY}
      </p>
      <dl className="mt-3">
        {lines.map((line) => (
          <div
            key={line.id}
            className="flex items-start justify-between gap-3 border-t border-border/60 py-2.5 text-[15px]"
          >
            <dt className="leading-snug text-ink-muted">{line.label}</dt>
            <dd className="font-semibold tabular-nums text-ink">
              <CountUpNaira value={line.amountNgn} />
            </dd>
          </div>
        ))}
        <div className="flex items-baseline justify-between gap-3 border-t border-ink/20 pt-3">
          <dt className="text-[15px] font-semibold tracking-tight text-ink">Total</dt>
          <dd className="font-display text-[24px] font-semibold tabular-nums tracking-tight text-ink">
            <CountUpNaira value={quote.totalNgn} />
          </dd>
        </div>
      </dl>
    </section>
  );
}
