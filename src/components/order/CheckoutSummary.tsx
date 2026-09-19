import type { CylinderOption } from "@/config/cylinders";
import { formatCylinderSize } from "@/config/cylinders";
import type {
  DeliveryAddress,
  DeliveryWindow,
  PresenceOption,
} from "@/config/delivery";
import { formatNaira } from "@/lib/money";

type CheckoutSummaryProps = {
  cylinder: CylinderOption;
  address: DeliveryAddress;
  presence: PresenceOption;
  window: DeliveryWindow;
  notes: string;
};

export function CheckoutSummary({
  cylinder,
  address,
  presence,
  window,
  notes,
}: CheckoutSummaryProps) {
  return (
    <div className="flex flex-col gap-3">
      <section className="rounded-2xl border border-border bg-surface px-4 py-4 shadow-gasgo-soft">
        <p className="text-sm font-medium text-ink-muted">Cylinder</p>
        <div className="mt-1.5 flex items-baseline justify-between gap-3">
          <p className="text-lg font-semibold tracking-tight text-ink">
            {formatCylinderSize(cylinder.sizeKg)}
          </p>
          <p className="text-lg font-semibold tabular-nums tracking-tight text-ink">
            {formatNaira(cylinder.priceNgn)}
          </p>
        </div>
        <p className="mt-0.5 text-sm text-ink-muted">
          Best for {cylinder.bestFor.toLowerCase()}
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-surface px-4 py-4 shadow-gasgo-soft">
        <p className="text-sm font-medium text-ink-muted">Delivery</p>
        <p className="mt-1.5 text-[17px] font-semibold tracking-tight text-ink">
          {address.label}
        </p>
        <p className="mt-0.5 text-sm leading-snug text-ink">{address.line}</p>
        <p className="mt-0.5 text-sm text-ink-muted">{address.area}</p>

        <dl className="mt-4 space-y-3 border-t border-border pt-3">
          <SummaryLine label="Handover" value={presence.title} />
          <SummaryLine
            label="Window"
            value={`${window.title} · ${window.detail}`}
          />
          {notes ? <SummaryLine label="Instructions" value={notes} /> : null}
        </dl>
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