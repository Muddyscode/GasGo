"use client";

import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { CountUpNaira } from "@/components/motion";
import { PriceBreakdown } from "@/components/order/PriceBreakdown";
import type { FulfillmentMode } from "@/config/fulfillment";
import type { OrderQuote } from "@/config/pricing";
import {
  CHECKOUT_RECEIPT_SHEET_ID,
  OVERLAY_SCRIM_45_CLASS,
  useBodyScrollLock,
} from "@/lib/overlay";
import { cn } from "@/lib/utils";

const FOCUSABLE =
  'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

const OPEN_MS = 200;

export const CHECKOUT_RECEIPT_SHEET_ATTR = "data-checkout-receipt-sheet";
export { CHECKOUT_RECEIPT_SHEET_ID };

function readReducedMotion() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type CheckoutReceiptSheetProps = {
  open: boolean;
  onClose: () => void;
  quote: OrderQuote;
  fulfillmentMode: FulfillmentMode;
  returnFocusTo: RefObject<HTMLElement | null>;
};

export function CheckoutReceiptSheet({
  open,
  onClose,
  quote,
  fulfillmentMode,
  returnFocusTo,
}: CheckoutReceiptSheetProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [risen, setRisen] = useState(false);
  const reduced = readReducedMotion();

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) {
      setRisen(false);
      return;
    }
    if (reduced) {
      setRisen(true);
      return;
    }
    const id = window.requestAnimationFrame(() => setRisen(true));
    return () => window.cancelAnimationFrame(id);
  }, [open, reduced]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const previous = returnFocusTo.current;
    const focusables = () =>
      panel?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [];

    const first = focusables()[0];
    first?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = [...focusables()];
      if (nodes.length === 0) return;
      const start = nodes[0];
      const end = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === start) {
        event.preventDefault();
        end?.focus();
      } else if (!event.shiftKey && document.activeElement === end) {
        event.preventDefault();
        start?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [open, onClose, returnFocusTo]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <>
      <button
        type="button"
        aria-label="Close receipt"
        data-overlay-scrim=""
        className={cn("fixed inset-0 z-50 lg:hidden", OVERLAY_SCRIM_45_CLASS)}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        id={CHECKOUT_RECEIPT_SHEET_ID}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-checkout-receipt-sheet=""
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-lg rounded-t-3xl border-t border-border bg-surface px-5 pt-4 shadow-gasgo-lg lg:hidden",
          "pb-[max(1.25rem,env(safe-area-inset-bottom))]",
          "motion-safe:transition-transform motion-safe:duration-200",
          "motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)]",
          "motion-reduce:translate-y-0 motion-reduce:transition-none",
          reduced || risen ? "translate-y-0" : "translate-y-full",
        )}
        style={{ transitionDuration: reduced ? "0ms" : `${OPEN_MS}ms` }}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-[13px] font-medium text-ink-muted">Receipt</p>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
          >
            Close
          </button>
        </div>
        <PriceBreakdown
          quote={quote}
          fulfillmentMode={fulfillmentMode}
          headingId={titleId}
        />
        <button
          type="button"
          onClick={onClose}
          className="mt-5 flex h-12 w-full items-center justify-center rounded-2xl bg-surface-muted text-[15px] font-semibold text-ink transition-transform duration-150 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
        >
          Done
        </button>
      </div>
    </>,
    document.body,
  );
}

export function CheckoutBreakdownRow({
  totalNgn,
  expanded,
  onOpen,
}: {
  totalNgn: number;
  expanded: boolean;
  onOpen: (trigger: HTMLElement) => void;
}) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-expanded={expanded}
      aria-controls={CHECKOUT_RECEIPT_SHEET_ID}
      onClick={(event) => onOpen(event.currentTarget)}
      className="flex w-full items-center justify-between gap-3 border-t border-border/60 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
    >
      <span>
        <span className="block text-[13px] font-medium text-ink-muted">Receipt</span>
        <span className="mt-0.5 block text-[15px] font-semibold text-ink">
          View breakdown
        </span>
      </span>
      <span className="font-display text-[20px] font-semibold tabular-nums tracking-tight text-ink">
        <CountUpNaira value={totalNgn} />
      </span>
    </button>
  );
}
