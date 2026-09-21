import Link from "next/link";
import { MapPin } from "lucide-react";
import { OrderHeader } from "@/components/order/OrderHeader";
import { buttonClassName } from "@/components/ui/button";
import { cardClassName } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageBody, PageFrame, PageTitle } from "@/components/ui/page";
import type { DeliveryAddress } from "@/config/delivery";

type AddressesManageViewProps = {
  addresses: DeliveryAddress[];
};

export function AddressesManageView({ addresses }: AddressesManageViewProps) {
  return (
    <PageFrame>
      <OrderHeader
        title="Addresses"
        backHref="/profile"
        backLabel="Back to profile"
      />

      <PageBody className="pb-[max(2rem,env(safe-area-inset-bottom))]">
        <PageTitle subtitle="These are the Lagos addresses on this device. Editing lands with your account.">
          Saved places
        </PageTitle>

        {addresses.length === 0 ? (
          <EmptyState
            image="/images/cooking-gas-field.png"
            alt="Empty plant field waiting for a drop-off"
            title="No addresses yet"
            body="Add a drop-off the next time you order."
            action={
              <Link
                href="/order/address"
                className={buttonClassName({ variant: "primary", size: "md" })}
              >
                Add during order
              </Link>
            }
          />
        ) : (
          <ul className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
            {addresses.map((address) => (
              <li
                key={address.id}
                className={`${cardClassName} flex items-start gap-3.5 px-4 py-4`}
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
      </PageBody>
    </PageFrame>
  );
}
