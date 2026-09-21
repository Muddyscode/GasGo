"use client";

import { useEffect, useId, useState } from "react";
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

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const heading =
    intent === "/order/checkout"
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
          {heading}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">
          Mock signup for now — your fill and address stay on this device. We never
          fill at your door; payment is required before empty pickup.
        </p>

        <form
          className="mt-5 flex flex-col gap-3"
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
              "mt-2 flex h-12 items-center justify-center rounded-2xl text-[15px] font-semibold",
              "transition-[background-color,color,transform] duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40",
              canSubmit
                ? "bg-brand-green text-white shadow-gasgo-md active:scale-[0.985]"
                : "cursor-not-allowed bg-surface-muted text-ink-muted",
            )}
          >
            {intent === "/order/checkout" ? "Sign up and continue to checkout" : "Create account"}
          </button>
          <button
            type="button"
            onClick={() => complete(DEMO_SESSION_USER)}
            className="flex h-12 items-center justify-center rounded-2xl bg-surface-muted text-[15px] font-semibold text-ink transition-transform duration-150 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
          >
            Continue with demo account
          </button>
        </form>
      </div>
    </div>
  );
}

const fieldClassName =
  "h-12 w-full rounded-2xl border border-border bg-surface-muted px-4 text-[15px] text-ink outline-none transition-[border-color,background-color,box-shadow] duration-150 placeholder:text-ink-muted/70 focus:border-brand-green focus:bg-surface focus:ring-2 focus:ring-brand-green/20";
