import Link from "next/link";
import { MapPin } from "lucide-react";
import { cardClassName } from "@/components/ui/card";
import type { DeliveryAddress } from "@/config/delivery";

type ProfileAddressesProps = {
  addresses: DeliveryAddress[];
};

export function ProfileAddresses({ addresses }: ProfileAddressesProps) {
  const preview = addresses.slice(0, 3);

  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="text-[17px] font-semibold tracking-tight text-ink">
          Addresses
        </h2>
        <Link
          href="/profile/addresses"
          className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
        >
          Manage addresses
        </Link>
      </div>

      {preview.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface-muted px-4 py-6 text-center">
          <p className="text-[15px] font-semibold text-ink">No saved addresses</p>
          <p className="mt-1 text-sm text-ink-muted">
            Add one when you place your first order.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {preview.map((address) => (
            <li
              key={address.id}
              className={`${cardClassName} flex items-start gap-3 px-4 py-3.5`}
            >
              <span
                aria-hidden="true"
                className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-muted text-ink-muted"
              >
                <MapPin className="size-5" strokeWidth={1.75} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold tracking-tight text-ink">
                  {address.label}
                </span>
                <span className="mt-0.5 block text-sm leading-snug text-ink-muted">
                  {address.line}, {address.area}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
