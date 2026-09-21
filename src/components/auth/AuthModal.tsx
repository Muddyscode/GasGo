"use client";

import { useEffect, useId, useState } from "react";
import { FadeLift } from "@/components/motion/FadeLift";
import { DEMO_SESSION_USER } from "@/data/profile";
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
  const signIn = useSession((state) => state.signIn);
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const canSubmit =
    firstName.trim().length > 1 && phone.replace(/\D/g, "").length >= 10;
  const isCheckout = intent === "/order/checkout";

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const heading = isCheckout
    ? "Create an account to checkout"
    : "Create your GasGo account";

  function complete(user: SessionUser) {
    signIn(user);
    setFirstName("");
    setPhone("");
    setEmail("");
    onSuccess();
  }

  function handleSubmit() {
    if (!canSubmit) return;
    const digits = phone.replace(/\D/g, "");
    complete({
      id: `usr_${Date.now().toString(36)}`,
      firstName: firstName.trim().split(/\s+/)[0] ?? firstName.trim(),
      lastName: firstName.trim().split(/\s+/).slice(1).join(" "),
      phone: digits.startsWith("234") ? `+${digits}` : `+234${digits.replace(/^0/, "")}`,
      email: email.trim() || `${digits}@guest.gasgo.app`,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close sign up"
        className="auth-backdrop absolute inset-0 bg-ink/45"
        onClick={onClose}
      />
      <FadeLift
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "relative w-full max-w-md border border-border bg-surface",
          "max-h-[min(92dvh,44rem)] overflow-y-auto overscroll-contain",
          "rounded-t-3xl px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4",
          "shadow-gasgo-lg sm:mx-4 sm:rounded-3xl sm:px-6 sm:pt-6",
        )}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border sm:hidden" />
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-green">
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
            : "Mock signup for now — your details stay on this device. Order a plant refill whenever you’re ready."}
        </p>

        <form
          className="mt-6 flex flex-col gap-3.5"
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Full name</span>
            <input
              value={firstName}
              autoComplete="name"
              placeholder="Chioma Okeke"
              onChange={(event) => setFirstName(event.target.value)}
              className={fieldClassName}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Phone</span>
            <input
              value={phone}
              inputMode="tel"
              autoComplete="tel"
              placeholder="0803 000 0000"
              onChange={(event) => setPhone(event.target.value)}
              className={fieldClassName}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">
              Email <span className="font-normal text-ink-muted">· optional</span>
            </span>
            <input
              value={email}
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              onChange={(event) => setEmail(event.target.value)}
              className={fieldClassName}
            />
          </label>

          <button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              "mt-2 flex min-h-12 h-14 items-center justify-center rounded-2xl text-[15px] font-semibold",
              "transition-[background-color,color,transform,box-shadow] duration-150",
              "ease-[cubic-bezier(0.16,1,0.3,1)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40",
              canSubmit
                ? "bg-brand-green text-white shadow-gasgo-md active:scale-[0.985]"
                : "cursor-not-allowed bg-surface-muted text-ink-muted",
            )}
          >
            {isCheckout ? "Sign up and continue to checkout" : "Create account"}
          </button>
          <button
            type="button"
            onClick={() => complete(DEMO_SESSION_USER)}
            className={cn(
              "flex min-h-12 h-12 items-center justify-center rounded-2xl",
              "border border-border bg-surface-muted text-[15px] font-semibold text-ink",
              "transition-[transform,background-color] duration-150",
              "ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.985]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40",
            )}
          >
            Continue with demo account
          </button>
        </form>
      </FadeLift>
    </div>
  );
}

const fieldClassName =
  "h-12 min-h-12 w-full rounded-2xl border border-border bg-surface-muted px-4 text-[16px] text-ink outline-none transition-[border-color,background-color,box-shadow] duration-150 placeholder:text-ink-muted/70 focus:border-brand-green focus:bg-surface focus:ring-2 focus:ring-brand-green/20";
