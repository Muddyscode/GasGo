import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { OrderHeader } from "@/components/order/OrderHeader";
import { formatCylinderSize, getCylinderById } from "@/config/cylinders";
import { getPresenceById, getWindowById } from "@/config/delivery";
import { quoteOrder } from "@/config/pricing";
import { formatNaira } from "@/lib/money";
import { firstParam, orderPath, parseOrderQuery } from "@/lib/order-query";

export const metadata: Metadata = {
  title: "Payment successful · GasGo",
  description: "Your GasGo order is confirmed.",
};

type SuccessPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const query = parseOrderQuery(params);
  const cylinder = getCylinderById(query.cylinderId);
  const presence = getPresenceById(query.presenceId);
  const window = getWindowById(query.windowId);
  const quote = cylinder ? quoteOrder(cylinder.priceNgn) : null;
  const mode = firstParam(params.mode);
  const reference = firstParam(params.ref);
  const isMock = mode !== "paystack";

  const checkoutHref = orderPath("/order/checkout", {
    cylinderId: query.cylinderId,
    address: query.address,
    presenceId: query.presenceId,
    windowId: query.windowId,
    notes: query.notes,
  });

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <OrderHeader
        title="Confirmed"
        backHref={checkoutHref}
        backLabel="Back to checkout"
      />

      <main className="flex flex-1 flex-col px-5 pt-10 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <span className="grid size-14 place-items-center rounded-full bg-brand-green text-white shadow-gasgo-md">
          <Check className="size-7" strokeWidth={2.5} />
        </span>

        <h2 className="mt-5 text-[28px] font-semibold leading-[1.15] tracking-tight text-ink">
          {isMock ? "Payment successful (test)" : "Payment successful"}
        </h2>
        <p className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-ink-muted">
          {isMock
            ? "Test checkout — no card was charged. Your rider can be dispatched from here."
            : "We’ve got your payment. A rider will fill and deliver your cylinder."}
        </p>

        {cylinder && query.address && quote ? (
          <section className="mt-8 rounded-2xl border border-border bg-surface-muted px-4 py-4 shadow-gasgo-soft">
            <p className="text-lg font-semibold tracking-tight text-ink">
              {formatCylinderSize(cylinder.sizeKg)} · {formatNaira(quote.totalNgn)}
            </p>
            <p className="mt-1 text-sm leading-snug text-ink">
              {query.address.label} · {query.address.area}
            </p>
            {presence ? (
              <p className="mt-1 text-sm text-ink-muted">{presence.title}</p>
            ) : null}
            {window ? (
              <p className="mt-0.5 text-sm text-ink-muted">
                {window.title} · {window.detail}
              </p>
            ) : null}
            {reference ? (
              <p className="mt-3 text-xs tabular-nums text-ink-muted">
                Ref {reference}
              </p>
            ) : null}
          </section>
        ) : null}

        <div className="mt-auto flex flex-col gap-3 pt-10">
          <Link
            href="/"
            className="flex h-14 items-center justify-center rounded-2xl bg-brand-green text-base font-semibold text-white shadow-gasgo-md transition-transform duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2"
          >
            Back home
          </Link>
          <Link
            href="/order/cylinder"
            className="flex h-14 items-center justify-center rounded-2xl bg-surface-muted text-base font-semibold text-ink transition-transform duration-150 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
          >
            Order again
          </Link>
        </div>
      </main>
    </div>
  );
}