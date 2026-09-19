"use client";

import { forwardRef, useEffect, useId, useRef, useState } from "react";
import type { DeliveryAddress } from "@/config/delivery";
import { createCustomAddress } from "@/config/delivery";
import { tactilePrimary, tactileSecondary } from "@/components/ui/tactile";

type AddAddressSheetProps = {
  open: boolean;
  onClose: () => void;
  onSave: (address: DeliveryAddress) => void;
};

export function AddAddressSheet({ open, onClose, onSave }: AddAddressSheetProps) {
  const titleId = useId();
  const labelRef = useRef<HTMLInputElement>(null);
  const [label, setLabel] = useState("");
  const [line, setLine] = useState("");
  const [area, setArea] = useState("");

  const canSave = label.trim().length > 1 && line.trim().length > 4 && area.trim().length > 1;

  useEffect(() => {
    if (!open) return;
    const timeout = window.setTimeout(() => labelRef.current?.focus(), 40);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  function handleSave() {
    if (!canSave) return;
    onSave(createCustomAddress({ label, line, area }));
    setLabel("");
    setLine("");
    setArea("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close add address"
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md rounded-t-3xl bg-surface px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 shadow-gasgo-lg sm:rounded-3xl"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
        <h2 id={titleId} className="text-lg font-semibold tracking-tight text-ink">
          Add new address
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">
          We’ll save it on this device for this order.
        </p>

        <form
          className="mt-5 flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            handleSave();
          }}
        >
          <Field
            ref={labelRef}
            label="Label"
            placeholder="Weekend place"
            value={label}
            onChange={setLabel}
            autoComplete="nickname"
          />
          <Field
            label="Street address"
            placeholder="12 Adeola Odeku Street"
            value={line}
            onChange={setLine}
            autoComplete="street-address"
          />
          <Field
            label="Area"
            placeholder="Victoria Island"
            value={area}
            onChange={setArea}
            autoComplete="address-level2"
          />

          <div className="mt-2 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className={tactileSecondary("h-12 text-[15px]")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSave}
              className={tactilePrimary("h-12 text-[15px]")}
            >
              Save address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
};

const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, placeholder, value, onChange, autoComplete },
  ref,
) {
  const id = useId();
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <input
        ref={ref}
        id={id}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-border bg-surface-muted px-4 text-[15px] text-ink outline-none transition-[border-color,background-color,box-shadow] duration-150 placeholder:text-ink-muted/70 focus:border-brand-green focus:bg-surface focus:ring-2 focus:ring-brand-green/20"
      />
    </label>
  );
});
