import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { DeliveryTruck } from "@/components/motion/DeliveryTruck";
import { OrderHeader } from "@/components/order/OrderHeader";
import { PAID_RELIEF_BODY, PAID_RELIEF_TITLE } from "@/components/order/order-quote-hint";
import { buttonClassName } from "@/components/ui/button";
import { PageBody, PageFrame } from "@/components/ui/page";
import { formatKg, quoteFill } from "@/config/pricing";
import { formatNaira } from "@/lib/money";
import { firstParam, orderPath, parseOrderQuery } from "@/lib/order-query";

export const metadata: Metadata = {
  title: "Payment successful — GasGo",
  description: "Your GasGo order is confirmed.",
};

type SuccessPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const query = parseOrderQuery(params);
  const typedKg = Number(firstParam(params.kg));
  const capacityKg =
    Number.isFinite(typedKg) && typedKg > 0
      ? typedKg
      : query.cylinderId === "12.5"
        ? 12.5
        : query.cylinderId
          ? Number(query.cylinderId)
          : null;
  const quote =
    capacityKg && capacityKg > 0
      ? quoteFill({
          fillMode: "full",
          capacityKg,
          zoneId: query.address?.zoneId,
        })
      : null;
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

        <p className="mt-5 text-[13px] font-semibold text-ink">
          {isMock ? "Paid — test checkout" : "Paid"}
        </p>
        <h2 className="mt-1.5 font-display text-[28px] font-semibold leading-[1.12] tracking-tight text-ink md:text-[32px]">
          {PAID_RELIEF_TITLE}
        </h2>
        <p className="mt-2 max-w-[36ch] text-[15px] leading-relaxed text-ink-muted">
          {isMock
            ? "Test checkout — no card was charged. We’ll still collect the empty, refill it at the plant, and return it filled. Nothing is filled at your door."
            : PAID_RELIEF_BODY}
        </p>

        <div className="mt-6">
          <DeliveryTruck label="Dispatching your refill" />
        </div>

        {query.address && quote ? (
          <section className="mt-5 rounded-2xl border border-border bg-surface px-4 py-4">
            <p className="font-display text-lg font-semibold tracking-tight text-ink">
              {formatKg(quote.capacityKg)} kg — {formatNaira(quote.totalNgn)}
            </p>
            <p className="mt-1 text-sm leading-snug text-ink">
              {query.address.label}, {query.address.area}
            </p>
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
