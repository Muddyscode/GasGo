import { cardClassName } from "@/components/ui/card";
import type {
  DeliveryAddress,
  DeliveryWindow,
  PresenceOption,
} from "@/config/delivery";
import {
  SAME_DAY_CUSTOMER_REMINDER,
  formatCalendarDate,
  fulfillmentLabel,
  isSameDayLoop,
  type FulfillmentMode,
} from "@/config/fulfillment";
import { formatKg, type FillQuote } from "@/config/pricing";
import { formatNaira } from "@/lib/money";

const FILL_MODE_LABEL = {
  full: "Full fill",
  kg: "Fill by kg",
  naira: "Fill by ₦",
} as const;

type CheckoutSummaryProps = {
  quote: FillQuote;
  address: DeliveryAddress;
  presence: PresenceOption | undefined;
  window: DeliveryWindow;
  notes: string;
  fulfillmentMode: FulfillmentMode;
  pickupDate: string;
  returnDate: string;
};

export function CheckoutSummary({
  quote,
  address,
  presence,
  window,
  notes,
  fulfillmentMode,
  pickupDate,
  returnDate,
}: CheckoutSummaryProps) {
  const hub = fulfillmentMode === "hub";
  const sameDay = isSameDayLoop(pickupDate, returnDate);

  return (
    <div className="flex flex-col gap-3">
      <section className={`${cardClassName} px-4 py-4`}>
        <p className="text-sm font-medium text-ink-muted">Plant refill</p>
        <div className="mt-1.5 flex items-baseline justify-between gap-3">
          <p className="text-lg font-semibold tracking-tight text-ink">
            {formatKg(quote.fillKg)} kg of {formatKg(quote.capacityKg)} kg
          </p>
          <p className="text-lg font-semibold tabular-nums tracking-tight text-ink">
            {formatNaira(quote.gasFillNgn)}
          </p>
        </div>
        <p className="mt-0.5 text-sm text-ink-muted">
          {FILL_MODE_LABEL[quote.fillMode]} · {formatNaira(quote.rateNgnPerKg)}/kg
          · refilled offsite, never at your door
        </p>
      </section>

      <section className={`${cardClassName} px-4 py-4`}>
        <p className="text-sm font-medium text-ink-muted">
          {hub ? "Hub collection" : "Pickup & return"}
        </p>
        <p className="mt-1.5 text-[17px] font-semibold tracking-tight text-ink">
          {address.label}
        </p>
        <p className="mt-0.5 text-sm leading-snug text-ink">{address.line}</p>
        <p className="mt-0.5 text-sm text-ink-muted">
          {quote.zoneName && quote.zoneName !== address.area
            ? `${address.area} · ${quote.zoneName}`
            : address.area}
        </p>

        <dl className="mt-4 space-y-3 border-t border-border pt-3">
          <SummaryLine label="Fulfillment" value={fulfillmentLabel(fulfillmentMode)} />
          <SummaryLine
            label="Pickup date"
            value={formatCalendarDate(pickupDate)}
          />
          <SummaryLine
            label="Return date"
            value={formatCalendarDate(returnDate)}
          />
          {presence && !hub ? (
            <SummaryLine label="Handover" value={presence.title} />
          ) : null}
          <SummaryLine
            label="Window"
            value={`${window.title} · ${window.detail}`}
          />
          {notes ? <SummaryLine label="Instructions" value={notes} /> : null}
        </dl>
        {sameDay ? (
          <p className="mt-3 rounded-xl bg-surface-soft px-3 py-2.5 text-sm leading-relaxed text-ink">
            {SAME_DAY_CUSTOMER_REMINDER}
          </p>
        ) : null}
      </section>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm font-medium text-ink-muted">{label}</dt>
      <dd className="mt-0.5 text-[15px] font-semibold leading-snug tracking-tight text-ink">
        {value}
      </dd>
    </div>
  );
}
