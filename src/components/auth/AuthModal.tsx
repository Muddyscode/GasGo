"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AuthIdentityForm } from "@/components/auth/AuthIdentityForm";
import { FadeLift } from "@/components/motion/FadeLift";
import { DEMO_SESSION_USER } from "@/data/profile";
import { OVERLAY_SCRIM_45_CLASS, useBodyScrollLock } from "@/lib/overlay";
import { cn } from "@/lib/utils";
import { useSession, type SessionUser } from "@/stores/session";

type AuthModalProps = {
  open: boolean;
  intent: string | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function AuthModal({ open, intent, onClose, onSuccess }: AuthModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const signIn = useSession((state) => state.signIn);
  const isCheckout = intent === "/order/checkout";
  const signInHref = intent
    ? `/login?next=${encodeURIComponent(intent)}`
    : "/login";

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusables = () =>
      panel?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
      ) ?? [];

    const first = focusables()[0];
    first?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
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
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const heading = isCheckout
    ? "Create an account to checkout"
    : "Create your GasGo account";

  function complete(user: SessionUser) {
    signIn(user);
    onSuccess();
  }

  return createPortal(
    <>
      <button
        type="button"
        aria-label="Close sign up"
        data-overlay-scrim=""
        className={cn("auth-backdrop fixed inset-0 z-50", OVERLAY_SCRIM_45_CLASS)}
        onClick={onClose}
      />
      <FadeLift
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 w-full max-w-md border border-border bg-surface",
          "max-h-[min(92dvh,44rem)] overflow-y-auto overscroll-contain",
          "rounded-t-3xl px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4",
          "shadow-gasgo-lg sm:inset-0 sm:m-auto sm:h-fit sm:rounded-3xl sm:px-6 sm:pt-6",
        )}
      >
        <div ref={panelRef}>
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border sm:hidden" />
          <p className="text-[13px] font-semibold text-ink">
            {isCheckout ? "Checkout" : "GasGo account"}
          </p>
          <h2
            id={titleId}
            className="mt-1.5 text-[22px] font-semibold tracking-tight text-ink"
          >
            {heading}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            {isCheckout
              ? "Your fill and Port Harcourt address stay on this device. We’ll take you to checkout next."
              : "Your details stay on this device. Signing in keeps any fill you already drafted."}
          </p>

          <div className="mt-6">
            <AuthIdentityForm
              submitLabel={isCheckout ? "Sign up and continue to checkout" : "Create account"}
              onComplete={complete}
            />
            <button
              type="button"
              onClick={() => complete(DEMO_SESSION_USER)}
              className={cn(
                "mt-3.5 flex h-12 min-h-12 w-full items-center justify-center rounded-2xl",
                "border border-border bg-surface-muted text-[15px] font-semibold text-ink",
                "transition-[transform,background-color] duration-150",
                "ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.985]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40",
              )}
            >
              Continue with demo account
            </button>
            <p className="mt-4 text-center text-sm text-ink-muted">
              Already have an account?{" "}
              <Link
                href={signInHref}
                className="font-semibold text-brand-green underline-offset-4 hover:underline"
                onClick={onClose}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </FadeLift>
    </>,
    document.body,
  );
}
