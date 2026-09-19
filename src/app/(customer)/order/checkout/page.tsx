import type { Metadata } from "next";
import { CheckoutEmpty } from "@/components/order/CheckoutEmpty";
import { CheckoutSummary } from "@/components/order/CheckoutSummary";
import { OrderHeader } from "@/components/order/OrderHeader";
import { PaystackPayButton } from "@/components/order/PaystackPayButton";
import { getCylinderById } from "@/config/cylinders";
import { getPresenceById, getWindowById } from "@/config/delivery";
import { quoteOrder } from "@/config/pricing";
import { isOrderReady, orderPath, parseOrderQuery } from "@/lib/order-query";

export const metadata: Metadata = {
  title: "Checkout · GasGo",
  description: "Review your GasGo order and pay with Paystack.",
};

type CheckoutPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const query = parseOrderQuery(await searchParams);
  const cylinder = getCylinderById(query.cylinderId);
  const presence = getPresenceById(query.presenceId);
  const window = getWindowById(query.windowId);

  if (!isOrderReady(query) || !cylinder || !query.address || !presence || !window) {
    return <CheckoutEmpty cylinderId={query.cylinderId} />;
  }

  const quote = quoteOrder(cylinder.priceNgn);
  const backHref = orderPath("/order/address", {
    cylinderId: query.cylinderId,
    address: query.address,
    presenceId: query.presenceId,
    windowId: query.windowId,
    notes: query.notes,
  });

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <OrderHeader
        title="Checkout"
        backHref={backHref}
        backLabel="Back to delivery details"
      />

      <div className="flex flex-1 flex-col px-5 pt-6 pb-4">
        <section className="mb-6">
          <p className="text-[28px] font-semibold leading-[1.15] tracking-tight text-ink">
            Review and pay
          </p>
          <p className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-ink-muted">
            Confirm the cylinder and drop-off, then pay securely with Paystack.
          </p>
        </section>

        <CheckoutSummary
          cylinder={cylinder}
          address={query.address}
          presence={presence}
          window={window}
          notes={query.notes}
        />
      </div>

      <PaystackPayButton
        quote={quote}
        cylinderId={cylinder.id}
        address={query.address}
        presenceId={presence.id}
        windowId={window.id}
        notes={query.notes}
      />
    </div>
  );
}