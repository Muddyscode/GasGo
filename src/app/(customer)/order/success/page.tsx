import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { DeliveryTruck } from "@/components/motion/DeliveryTruck";
import { OrderHeader } from "@/components/order/OrderHeader";
import { buttonClassName } from "@/components/ui/button";
import { cardClassName } from "@/components/ui/card";
import { PageBody, PageFrame } from "@/components/ui/page";
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
    <PageFrame>
      <OrderHeader
        title="Confirmed"
        backHref={checkoutHref}
        backLabel="Back to checkout"
      />

      <PageBody className="pb-[max(2rem,env(safe-area-inset-bottom))]">
        <span className="grid size-14 place-items-center rounded-full bg-brand-green text-white shadow-gasgo-md">
          <Check className="size-7" strokeWidth={2.5} />
        </span>

        <h2 className="mt-5 text-[28px] font-semibold leading-[1.15] tracking-tight text-ink md:text-[32px]">
          {isMock ? "Payment successful (test)" : "Payment successful"}
        </h2>
        <p className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-ink-muted">
          {isMock
            ? "Test checkout — no card was charged. Your rider can be dispatched from here."
            : "We’ve got your payment. A rider will fill and deliver your cylinder."}
        </p>

        <div className="mt-6">
          <DeliveryTruck label="Dispatching your refill" />
        </div>

        {cylinder && query.address && quote ? (
          <section className={`${cardClassName} mt-5 bg-surface-muted px-4 py-4`}>
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
          <Link href="/" className={buttonClassName({ variant: "primary", size: "lg" })}>
            Back home
          </Link>
          <Link
            href="/order/cylinder"
            className={buttonClassName({ variant: "secondary", size: "lg" })}
          >
            Order again
          </Link>
        </div>
      </PageBody>
    </PageFrame>
  );
}
