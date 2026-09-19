"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { AddAddressSheet } from "@/components/order/AddAddressSheet";
import { AddressCard } from "@/components/order/AddressCard";
import { DeliveryWindowPicker } from "@/components/order/DeliveryWindowPicker";
import { OrderHeader } from "@/components/order/OrderHeader";
import { PresenceOption } from "@/components/order/PresenceOption";
import {
  formatCylinderSize,
  getCylinderById,
  type CylinderId,
} from "@/config/cylinders";
import {
  DEFAULT_DELIVERY_WINDOW,
  PRESENCE_OPTIONS,
  SAVED_ADDRESSES,
  type DeliveryAddress,
  type DeliveryWindowId,
  type PresenceId,
} from "@/config/delivery";
import { formatNaira } from "@/lib/money";
import { buildOrderQuery } from "@/lib/order-query";
import { cn } from "@/lib/utils";

type AddressDeliveryFormProps = {
  cylinderId?: CylinderId | null;
  initialAddress?: DeliveryAddress | null;
  initialPresenceId?: PresenceId | null;
  initialWindowId?: DeliveryWindowId;
  initialNotes?: string;
};

export function AddressDeliveryForm({
  cylinderId = null,
  initialAddress = null,
  initialPresenceId = null,
  initialWindowId = DEFAULT_DELIVERY_WINDOW,
  initialNotes = "",
}: AddressDeliveryFormProps) {
  const router = useRouter();
  const cylinder = getCylinderById(cylinderId);
  const extras = useMemo(() => {
    if (!initialAddress) return [] as DeliveryAddress[];
    if (SAVED_ADDRESSES.some((address) => address.id === initialAddress.id)) {
      return [];
    }
    return [initialAddress];
  }, [initialAddress]);

  const [customAddresses, setCustomAddresses] = useState<DeliveryAddress[]>(extras);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    initialAddress?.id ?? null,
  );
  const [presenceId, setPresenceId] = useState<PresenceId | null>(initialPresenceId);
  const [windowId, setWindowId] = useState<DeliveryWindowId>(initialWindowId);
  const [notes, setNotes] = useState(initialNotes);
  const [sheetOpen, setSheetOpen] = useState(false);

  const addresses = useMemo(
    () => [...SAVED_ADDRESSES, ...customAddresses],
    [customAddresses],
  );
  const selectedAddress =
    addresses.find((address) => address.id === selectedAddressId) ?? null;
  const selectedPresence = PRESENCE_OPTIONS.find((option) => option.id === presenceId);
  const canContinue = Boolean(selectedAddress && selectedPresence);

  const backHref = cylinder
    ? `/order/cylinder?cylinder=${encodeURIComponent(cylinder.id)}`
    : "/order/cylinder";

  function handleSaveAddress(address: DeliveryAddress) {
    setCustomAddresses((current) => [...current, address]);
    setSelectedAddressId(address.id);
    setSheetOpen(false);
  }

  function handleContinue() {
    if (!selectedAddress || !selectedPresence) return;
    const query = buildOrderQuery({
      cylinderId: cylinder?.id ?? null,
      address: selectedAddress,
      presenceId: selectedPresence.id,
      windowId,
      notes,
    });
    router.push(`/order/checkout?${query}`);
  }

  const helper = !canContinue
    ? selectedAddress
      ? "Choose who receives it"
      : selectedPresence
        ? "Choose a delivery address"
        : "Select an address and who receives it"
    : `${selectedAddress?.label} · ${selectedPresence?.title}`;

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <OrderHeader
        title="Delivery details"
        backHref={backHref}
        backLabel="Back to cylinder selection"
      />

      <div className="flex flex-1 flex-col px-5 pt-6">
        <section className="mb-7">
          <p className="text-[28px] font-semibold leading-[1.15] tracking-tight text-ink">
            Where should we bring it?
          </p>
          <p className="mt-2 max-w-[36ch] text-[15px] leading-relaxed text-ink-muted">
            Lagos addresses, a clear handover, and a window that works for you.
          </p>
          {cylinder ? (
            <p className="mt-3 text-sm font-medium tabular-nums text-ink-muted">
              {formatCylinderSize(cylinder.sizeKg)} · {formatNaira(cylinder.priceNgn)}
            </p>
          ) : null}
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-ink-muted">
            Saved addresses
          </h2>
          <div
            role="radiogroup"
            aria-label="Delivery address"
            className="flex flex-col gap-3"
          >
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                selected={selectedAddressId === address.id}
                onSelect={setSelectedAddressId}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className={cn(
              "mt-3 flex min-h-14 w-full items-center gap-3.5 rounded-2xl border border-dashed border-ink-muted/25 bg-surface px-4 py-4 text-left",
              "transition-[border-color,background-color,transform] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]",
              "active:scale-[0.985] hover:border-brand-green/40 hover:bg-surface-soft",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2",
            )}
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-muted text-brand-green">
              <Plus className="size-5" strokeWidth={2} />
            </span>
            <span>
              <span className="block text-[15px] font-semibold tracking-tight text-ink">
                Add new address
              </span>
              <span className="mt-0.5 block text-sm text-ink-muted">
                Estate, street, and area
              </span>
            </span>
          </button>
        </section>

        <section className="mb-8">
          <h2 className="mb-1 text-sm font-semibold tracking-wide text-ink-muted">
            Who receives it
          </h2>
          <p className="mb-3 text-sm leading-relaxed text-ink-muted">
            Tell the rider what to do when they arrive.
          </p>
          <div
            role="radiogroup"
            aria-label="Presence and handover"
            className="flex flex-col gap-2.5"
          >
            {PRESENCE_OPTIONS.map((option) => (
              <PresenceOption
                key={option.id}
                option={option}
                selected={presenceId === option.id}
                onSelect={setPresenceId}
              />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-ink-muted">
            Preferred window
          </h2>
          <DeliveryWindowPicker selectedId={windowId} onSelect={setWindowId} />
        </section>

        <section className="mb-6">
          <label htmlFor="delivery-notes" className="block">
            <span className="mb-1 block text-sm font-semibold tracking-wide text-ink-muted">
              Delivery instructions
              <span className="ml-1 font-medium normal-case tracking-normal">
                · optional
              </span>
            </span>
            <textarea
              id="delivery-notes"
              value={notes}
              maxLength={200}
              rows={3}
              placeholder="Blue gate after the mosque, second turn on the right…"
              onChange={(event) => setNotes(event.target.value)}
              className="mt-2 min-h-[96px] w-full resize-none rounded-2xl border border-border bg-surface-muted px-4 py-3 text-[15px] leading-relaxed text-ink outline-none transition-[border-color,background-color,box-shadow] duration-150 placeholder:text-ink-muted/70 focus:border-brand-green focus:bg-surface focus:ring-2 focus:ring-brand-green/20"
            />
          </label>
        </section>
      </div>

      <div className="sticky bottom-0 z-20 border-t border-border/80 bg-surface/95 px-5 pt-3 backdrop-blur-md pb-[max(1rem,env(safe-area-inset-bottom))]">
        <p
          className={cn(
            "mb-2.5 min-h-5 text-center text-sm text-ink-muted transition-opacity duration-150",
            selectedAddress || selectedPresence ? "opacity-100" : "opacity-0",
          )}
          aria-live="polite"
        >
          {helper}
        </p>
        <button
          type="button"
          disabled={!canContinue}
          onClick={handleContinue}
          className={cn(
            "flex h-14 w-full items-center justify-center rounded-2xl text-base font-semibold tracking-tight",
            "transition-[background-color,color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2",
            canContinue
              ? "bg-brand-green text-white shadow-gasgo-md active:scale-[0.985]"
              : "cursor-not-allowed bg-surface-muted text-ink-muted",
          )}
        >
          Continue to Checkout
        </button>
      </div>

      <AddAddressSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSave={handleSaveAddress}
      />
    </div>
  );
}
