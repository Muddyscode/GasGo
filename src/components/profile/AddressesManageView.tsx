import Link from "next/link";
import { MapPin } from "lucide-react";
import { OrderHeader } from "@/components/order/OrderHeader";
import type { DeliveryAddress } from "@/config/delivery";

type AddressesManageViewProps = {
  addresses: DeliveryAddress[];
};

export function AddressesManageView({ addresses }: AddressesManageViewProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <OrderHeader
        title="Addresses"
        backHref="/profile"
        backLabel="Back to profile"
      />

      <main className="flex flex-1 flex-col px-5 pt-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <p className="text-[28px] font-semibold leading-[1.15] tracking-tight text-ink">
          Saved places
        </p>
        <p className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-ink-muted">
          These are the Lagos addresses on this device. Editing lands with your account.
        </p>

        {addresses.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-surface-muted px-4 py-8 text-center">
            <p className="text-[17px] font-semibold tracking-tight text-ink">
              No addresses yet
            </p>
            <p className="mx-auto mt-1.5 max-w-[28ch] text-sm leading-relaxed text-ink-muted">
              Add a drop-off the next time you order.
            </p>
            <Link
              href="/order/address"
              className="mt-5 inline-flex h-12 items-center justify-center rounded-2xl bg-brand-green px-5 text-[15px] font-semibold text-white shadow-gasgo-md"
            >
              Add during order
            </Link>
          </div>
        ) : (
          <ul className="mt-6 flex flex-col gap-2.5">
            {addresses.map((address) => (
              <li
                key={address.id}
                className="flex items-start gap-3.5 rounded-2xl border border-border bg-surface px-4 py-4 shadow-gasgo-soft"
              >
                <span
                  aria-hidden="true"
                  className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-muted text-ink-muted"
                >
                  <MapPin className="size-5" strokeWidth={1.75} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[17px] font-semibold tracking-tight text-ink">
                    {address.label}
                  </span>
                  <span className="mt-0.5 block text-sm leading-snug text-ink">
                    {address.line}
                  </span>
                  <span className="mt-1 block text-sm text-ink-muted">
                    {address.area}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
