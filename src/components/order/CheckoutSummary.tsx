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

/**
 * Order details as a clean receipt — thin dividers, no boxed cards. The money
 * lives in the pre-pay receipt (PriceBreakdown), so this panel only describes
 * what is being filled and where, without repeating the pricing.
 */
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
  const area =
    quote.zoneName && quote.zoneName !== address.area
      ? `${address.area}, ${quote.zoneName}`
      : address.area;

  return (
    <div className="flex flex-col">
      <div className="border-t border-border/60 pt-4">
        <p className="text-[13px] font-medium text-ink-muted">Plant refill</p>
        <p className="mt-1.5 font-display text-[20px] font-semibold tracking-tight text-ink">
          {formatKg(quote.fillKg)} kg of {formatKg(quote.capacityKg)} kg
        </p>
        <p className="mt-1 text-sm leading-snug text-ink-muted">
          {FILL_MODE_LABEL[quote.fillMode]} at {formatNaira(quote.rateNgnPerKg)}/kg,
          refilled offsite, never at your door
        </p>
      </div>

      <div className="mt-4 border-t border-border/60 pt-4">
        <p className="text-[13px] font-medium text-ink-muted">
          {hub ? "Hub collection" : "Pickup and return"}
        </p>
        <p className="mt-1.5 font-display text-[18px] font-semibold tracking-tight text-ink">
          {address.label}
        </p>
        <p className="mt-0.5 text-sm leading-snug text-ink">{address.line}</p>
        <p className="mt-0.5 text-sm text-ink-muted">{area}</p>
      </div>

      <dl className="mt-2">
        <SummaryLine label="Fulfillment" value={fulfillmentLabel(fulfillmentMode)} />
        <SummaryLine label="Pickup" value={formatCalendarDate(pickupDate)} />
        <SummaryLine label="Return" value={formatCalendarDate(returnDate)} />
        {presence && !hub ? <SummaryLine label="Handover" value={presence.title} /> : null}
        <SummaryLine label="Window" value={`${window.title} — ${window.detail}`} />
        {notes ? <SummaryLine label="Instructions" value={notes} /> : null}
      </dl>

      {sameDay ? (
        <p className="mt-3 rounded-xl bg-surface-soft px-3 py-2.5 text-sm leading-relaxed text-ink">
          {SAME_DAY_CUSTOMER_REMINDER}
        </p>
      ) : null}
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6 border-t border-border/60 py-2.5">
      <dt className="shrink-0 text-sm font-medium text-ink-muted">{label}</dt>
      <dd className="text-right text-[15px] font-semibold leading-snug tracking-tight text-ink">
        {value}
      </dd>
    </div>
  );
}
