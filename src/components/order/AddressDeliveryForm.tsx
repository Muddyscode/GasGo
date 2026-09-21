"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { AddAddressSheet } from "@/components/order/AddAddressSheet";
import { AddressCard } from "@/components/order/AddressCard";
import { DeliveryWindowPicker } from "@/components/order/DeliveryWindowPicker";
import { OrderHeader } from "@/components/order/OrderHeader";
import { PresenceOption } from "@/components/order/PresenceOption";
import { buttonClassName } from "@/components/ui/button";
import { interactiveCardClassName } from "@/components/ui/card";
import { PageBody, PageFrame, PageTitle, StickyAction } from "@/components/ui/page";
import { formatCylinderSize, getCylinderById } from "@/config/cylinders";
import {
  PRESENCE_OPTIONS,
  SAVED_ADDRESSES,
  type DeliveryAddress,
} from "@/config/delivery";
import { formatNaira } from "@/lib/money";
import { cn } from "@/lib/utils";
import { useOrderDraft } from "@/stores/order-draft";

export function AddressDeliveryForm() {
  const router = useRouter();
  const cylinderId = useOrderDraft((state) => state.cylinderId);
  const address = useOrderDraft((state) => state.address);
  const presenceId = useOrderDraft((state) => state.presenceId);
  const windowId = useOrderDraft((state) => state.windowId);
  const notes = useOrderDraft((state) => state.notes);
  const setAddress = useOrderDraft((state) => state.setAddress);
  const setPresence = useOrderDraft((state) => state.setPresence);
  const setWindow = useOrderDraft((state) => state.setWindow);
  const setNotes = useOrderDraft((state) => state.setNotes);

  const cylinder = getCylinderById(cylinderId);
  const [customAddresses, setCustomAddresses] = useState<DeliveryAddress[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (!address) return;
    if (SAVED_ADDRESSES.some((saved) => saved.id === address.id)) return;
    setCustomAddresses((current) =>
      current.some((item) => item.id === address.id) ? current : [...current, address],
    );
  }, [address]);

  const addresses = useMemo(
    () => [...SAVED_ADDRESSES, ...customAddresses],
    [customAddresses],
  );
  const selectedAddress =
    addresses.find((item) => item.id === address?.id) ?? address;
  const selectedPresence = PRESENCE_OPTIONS.find((option) => option.id === presenceId);
  const canContinue = Boolean(selectedAddress && selectedPresence);

  function handleSaveAddress(next: DeliveryAddress) {
    setCustomAddresses((current) => [...current, next]);
    setAddress(next);
    setSheetOpen(false);
  }

  function handleContinue() {
    if (!selectedAddress || !selectedPresence) return;
    setAddress(selectedAddress);
    setPresence(selectedPresence.id);
    setWindow(windowId);
    setNotes(notes);
    router.push("/order/checkout");
  }

  const helper = !canContinue
    ? selectedAddress
      ? "Choose who receives it"
      : selectedPresence
        ? "Choose a delivery address"
        : "Select an address and who receives it"
    : `${selectedAddress?.label} · ${selectedPresence?.title}`;

  return (
    <PageFrame>
      <OrderHeader
        title="Delivery details"
        backHref="/order/cylinder"
        backLabel="Back to cylinder selection"
      />

      <PageBody>
        <PageTitle
          eyebrow="Drop-off"
          subtitle="Lagos addresses, a clear handover, and a window that works for you."
        >
          Where should we bring it?
        </PageTitle>
        {cylinder ? (
          <p className="-mt-4 mb-6 text-sm font-medium tabular-nums text-ink-muted">
            {formatCylinderSize(cylinder.sizeKg)} · {formatNaira(cylinder.priceNgn)}
          </p>
        ) : null}

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <section className="mb-8 lg:col-span-7 lg:mb-0">
            <h3 className="mb-3 text-sm font-semibold tracking-wide text-ink-muted">
              Saved addresses
            </h3>
            <div
              role="radiogroup"
              aria-label="Delivery address"
              className="flex flex-col gap-3"
            >
              {addresses.map((item) => (
                <AddressCard
                  key={item.id}
                  address={item}
                  selected={address?.id === item.id}
                  onSelect={(id) => {
                    const next = addresses.find((entry) => entry.id === id);
                    if (next) setAddress(next);
                  }}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className={cn(
                interactiveCardClassName,
                "mt-3 flex min-h-14 w-full items-center gap-3.5 border-dashed border-ink-muted/25 px-4 py-4 text-left",
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

          <div className="lg:col-span-5">
            <section className="mb-8">
              <h3 className="mb-1 text-sm font-semibold tracking-wide text-ink-muted">
                Who receives it
              </h3>
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
                    onSelect={setPresence}
                  />
                ))}
              </div>
            </section>

            <section className="mb-8">
              <h3 className="mb-3 text-sm font-semibold tracking-wide text-ink-muted">
                Preferred window
              </h3>
              <DeliveryWindowPicker selectedId={windowId} onSelect={setWindow} />
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
        </div>
      </PageBody>

      <StickyAction>
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
          className={buttonClassName(
            { variant: "primary", size: "lg" },
            !canContinue &&
              "cursor-not-allowed bg-surface-muted text-ink-muted shadow-none hover:shadow-none",
          )}
        >
          Continue to Checkout
        </button>
      </StickyAction>

      <AddAddressSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSave={handleSaveAddress}
      />
    </PageFrame>
  );
}
