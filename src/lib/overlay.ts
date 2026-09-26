"use client";

import { useEffect } from "react";

export const CHECKOUT_RECEIPT_SHEET_ID = "checkout-receipt-sheet";

/**
 * Tailwind `bg-ink/45` is transparent — `/opacity` cannot tint a CSS-variable color.
 * Dark remaps `--gasgo-ink` to cream, so dark overlays tint from `--gasgo-surface`
 * (the dark plate) instead. Shared so CheckoutReceiptSheet, AuthModal,
 * AddAddressSheet, and EditProfileSheet darken the page the same way.
 */
export const OVERLAY_SCRIM_DARK_CLASS =
  "dark:bg-[color-mix(in_srgb,var(--gasgo-surface)_70%,transparent)]";

export const OVERLAY_SCRIM_45_CLASS = [
  "bg-[color-mix(in_srgb,var(--gasgo-ink)_45%,transparent)]",
  OVERLAY_SCRIM_DARK_CLASS,
].join(" ");

export const OVERLAY_SCRIM_40_CLASS = [
  "bg-[color-mix(in_srgb,var(--gasgo-ink)_40%,transparent)]",
  OVERLAY_SCRIM_DARK_CLASS,
].join(" ");

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}
