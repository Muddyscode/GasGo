import type { OrderQuote } from "@/config/pricing";
import { PAYMENT_VARIANCE_COPY } from "@/config/pricing";
import { formatNaira } from "@/lib/money";

export function PriceBreakdown({ quote }: { quote: OrderQuote }) {
  const lines = quote.lines ?? [
    { id: "gas" as const, label: "Gas fill", amountNgn: quote.gasFillNgn },
    {
      id: "delivery" as const,
      label: quote.zoneName
        ? `${quote.zoneName} pickup & return`
        : "Zone pickup & return",
      amountNgn: quote.deliveryNgn,
    },
  ];

  return (
    <section className="rounded-2xl border border-border bg-surface-muted px-4 py-3.5 shadow-gasgo-soft">
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
