import type { OrderQuote } from "@/config/pricing";
import { formatNaira } from "@/lib/money";

export function PriceBreakdown({ quote }: { quote: OrderQuote }) {
  return (
    <section className="rounded-2xl border border-border bg-surface-muted px-4 py-4 shadow-gasgo-soft">
      <p className="text-sm font-medium text-ink-muted">To pay</p>
      <dl className="mt-3 space-y-2.5">
        <div className="flex items-center justify-between gap-3 text-[15px]">
          <dt className="text-ink-muted">Gas fill</dt>
          <dd className="font-semibold tabular-nums text-ink">
            {formatNaira(quote.gasFillNgn)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3 text-[15px]">
          <dt className="text-ink-muted">Lagos delivery</dt>
          <dd className="font-semibold tabular-nums text-ink">
            {formatNaira(quote.deliveryNgn)}
          </dd>
        </div>
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