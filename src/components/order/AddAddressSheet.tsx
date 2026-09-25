"use client";

import { forwardRef, useEffect, useId, useRef, useState } from "react";
import type { DeliveryAddress } from "@/config/delivery";
import { createCustomAddress } from "@/config/delivery";
import { PH_ZONES, isZoneId, type ZoneId } from "@/config/pricing";
import { cn } from "@/lib/utils";

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
  const [zoneId, setZoneId] = useState<ZoneId>("old-gra");

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
    onSave(createCustomAddress({ label, line, area, zoneId }));
    setLabel("");
    setLine("");
    setArea("");
    setZoneId("old-gra");
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
        className="fade-lift relative w-full max-w-md rounded-t-3xl bg-surface px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 shadow-gasgo-lg sm:rounded-3xl"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
        <h2 id={titleId} className="font-display text-lg font-semibold tracking-tight text-ink">
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
            placeholder="12 Forces Avenue"
            value={line}
            onChange={setLine}
            autoComplete="street-address"
          />
          <Field
            label="Area"
            placeholder="Old GRA"
            value={area}
            onChange={setArea}
            autoComplete="address-level2"
          />
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Zone</span>
            <select
              value={zoneId}
              onChange={(event) => {
                if (isZoneId(event.target.value)) setZoneId(event.target.value);
              }}
              className="h-12 w-full rounded-2xl border border-border bg-surface-muted px-4 text-[15px] text-ink outline-none transition-[border-color,background-color,box-shadow] duration-150 focus:border-brand-green focus:bg-surface focus:ring-2 focus:ring-brand-green/20"
            >
              {PH_ZONES.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name} — ₦{zone.feeNgn.toLocaleString("en-NG")} pickup and return
                </option>
              ))}
            </select>
            <span className="mt-1.5 block text-xs text-ink-muted">
              Zones are hub-configured (stub).
            </span>
          </label>

          <div className="mt-2 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex h-12 items-center justify-center rounded-2xl bg-surface-muted text-[15px] font-semibold text-ink transition-transform duration-150 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSave}
              className={cn(
                "flex h-12 items-center justify-center rounded-2xl text-[15px] font-semibold transition-[background-color,color,transform] duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40",
                canSave
                  ? "bg-brand-green text-white shadow-gasgo-md active:scale-[0.985]"
                  : "cursor-not-allowed bg-surface-muted text-ink-muted",
              )}
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
