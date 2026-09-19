"use client";

import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils";

type EditProfileSheetProps = {
  open: boolean;
  name: string;
  phone: string;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
};

export function EditProfileSheet({
  open,
  name,
  phone,
  onNameChange,
  onPhoneChange,
  onClose,
  onSave,
}: EditProfileSheetProps) {
  const titleId = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const canSave = name.trim().length > 1 && phone.trim().length > 6;

  useEffect(() => {
    if (!open) return;
    const timeout = window.setTimeout(() => nameRef.current?.focus(), 40);
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

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close edit profile"
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
          Edit profile
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">
          Saved on this device only — your account comes next.
        </p>

        <form
          className="mt-5 flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (canSave) onSave();
          }}
        >
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Name</span>
            <input
              ref={nameRef}
              value={name}
              autoComplete="name"
              placeholder="Tunde Adebayo"
              onChange={(event) => onNameChange(event.target.value)}
              className="h-12 w-full rounded-2xl border border-border bg-surface-muted px-4 text-[15px] text-ink outline-none transition-[border-color,background-color,box-shadow] duration-150 placeholder:text-ink-muted/70 focus:border-brand-green focus:bg-surface focus:ring-2 focus:ring-brand-green/20"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Phone</span>
            <input
              value={phone}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+234 803 441 2291"
              onChange={(event) => onPhoneChange(event.target.value)}
              className="h-12 w-full rounded-2xl border border-border bg-surface-muted px-4 text-[15px] text-ink outline-none transition-[border-color,background-color,box-shadow] duration-150 placeholder:text-ink-muted/70 focus:border-brand-green focus:bg-surface focus:ring-2 focus:ring-brand-green/20"
            />
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
