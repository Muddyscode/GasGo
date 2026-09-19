import Link from "next/link";
import { OrderHeader } from "@/components/order/OrderHeader";
import type { CylinderId } from "@/config/cylinders";
import { orderPath } from "@/lib/order-query";

type CheckoutEmptyProps = {
  cylinderId?: CylinderId | null;
};

export function CheckoutEmpty({ cylinderId = null }: CheckoutEmptyProps) {
  const addressHref = orderPath("/order/address", { cylinderId });
  const cylinderHref = cylinderId
    ? `/order/cylinder?cylinder=${encodeURIComponent(cylinderId)}`
    : "/order/cylinder";

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <OrderHeader
        title="Checkout"
        backHref={addressHref}
        backLabel="Back to delivery details"
      />
      <main className="flex flex-1 flex-col px-5 pt-10">
        <p className="text-[28px] font-semibold leading-[1.15] tracking-tight text-ink">
          A few details first
        </p>
        <p className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-ink-muted">
          Choose a cylinder and where to deliver it before you pay. Nothing has been charged.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href={addressHref}
            className="flex h-14 items-center justify-center rounded-2xl bg-brand-green text-base font-semibold text-white shadow-gasgo-md transition-transform duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2"
          >
            Delivery details
          </Link>
          <Link
            href={cylinderHref}
            className="flex h-14 items-center justify-center rounded-2xl bg-surface-muted text-base font-semibold text-ink transition-transform duration-150 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
          >
            Choose a cylinder
          </Link>
        </div>
      </main>
    </div>
  );
}