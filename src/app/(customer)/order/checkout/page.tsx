import type { Metadata } from "next";
import Link from "next/link";
import { OrderHeader } from "@/components/order/OrderHeader";
import { formatCylinderSize, getCylinderById } from "@/config/cylinders";
import { getPresenceById, getWindowById } from "@/config/delivery";
import { formatNaira } from "@/lib/money";
import { buildOrderQuery, parseOrderQuery } from "@/lib/order-query";

export const metadata: Metadata = {
  title: "Checkout · GasGo",
  description: "Review your GasGo cylinder order before payment.",
};

type CheckoutPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const query = parseOrderQuery(await searchParams);
  const cylinder = getCylinderById(query.cylinderId);
  const presence = getPresenceById(query.presenceId);
  const window = getWindowById(query.windowId);
  const backQuery = buildOrderQuery({
    cylinderId: query.cylinderId,
    address: query.address,
    presenceId: query.presenceId,
    windowId: query.windowId,
    notes: query.notes,
  });
  const backHref = backQuery ? `/order/address?${backQuery}` : "/order/address";

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <OrderHeader
        title="Checkout"
        backHref={backHref}
        backLabel="Back to delivery details"
      />

      <main className="flex flex-1 flex-col px-5 pt-8">
        <p className="text-[28px] font-semibold leading-[1.15] tracking-tight text-ink">
          Checkout is next
        </p>
        <p className="mt-2 max-w-[36ch] text-[15px] leading-relaxed text-ink-muted">
          Payment will live here. Your delivery choices are saved on this order.
        </p>

        <dl className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface-muted shadow-gasgo-soft">
          <SummaryRow
            label="Cylinder"
            value={
              cylinder
                ? `${formatCylinderSize(cylinder.sizeKg)} · ${formatNaira(cylinder.priceNgn)}`
                : "Not selected"
            }
          />
          <SummaryRow
            label="Address"
            value={
              query.address
                ? `${query.address.label} · ${query.address.line}, ${query.address.area}`
                : "Not selected"
            }
          />
          <SummaryRow
            label="Handover"
            value={presence?.title ?? "Not selected"}
          />
          <SummaryRow
            label="Window"
            value={window ? `${window.title} · ${window.detail}` : "Not selected"}
          />
          {query.notes ? (
            <SummaryRow label="Instructions" value={query.notes} />
          ) : null}
        </dl>

        {!query.address || !presence ? (
          <Link
            href={backHref}
            className="mt-8 flex h-14 items-center justify-center rounded-2xl bg-brand-green text-base font-semibold text-white shadow-gasgo-md"
          >
            Complete delivery details
          </Link>
        ) : null}
      </main>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3.5">
      <dt className="text-sm font-medium text-ink-muted">{label}</dt>
      <dd className="mt-1 text-[15px] font-semibold leading-snug tracking-tight text-ink">
        {value}
      </dd>
    </div>
  );
}
