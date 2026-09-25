"use client";

import { useState } from "react";
import { guestSessionUser } from "@/lib/session-user";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/stores/session";

export const authFieldClassName =
  "h-12 min-h-12 w-full rounded-2xl border border-border bg-surface-muted px-4 text-[16px] text-ink outline-none transition-[border-color,background-color,box-shadow] duration-150 placeholder:text-ink-muted/70 focus:border-brand-green focus:bg-surface focus:ring-2 focus:ring-brand-green/20";

type AuthIdentityFormProps = {
  submitLabel: string;
  onComplete: (user: SessionUser) => void;
  emailOptional?: boolean;
};

/**
 * Shared sign-up fields used by the login/signup pages and the checkout modal,
 * so an account is captured the same way everywhere.
 */
export function AuthIdentityForm({
  submitLabel,
  onComplete,
  emailOptional = true,
}: AuthIdentityFormProps) {
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const canSubmit =
    firstName.trim().length > 1 && phone.replace(/\D/g, "").length >= 10;

  return (
    <form
      className="flex flex-col gap-3.5"
      onSubmit={(event) => {
        event.preventDefault();
        if (!canSubmit) return;
        onComplete(guestSessionUser({ firstName, phone, email }));
      }}
    >
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">Full name</span>
        <input
          name="name"
          value={firstName}
          required
          autoComplete="name"
          autoCapitalize="words"
          placeholder="Chioma Okeke"
          onChange={(event) => setFirstName(event.target.value)}
          className={authFieldClassName}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">Phone</span>
        <input
          name="tel"
          value={phone}
          required
          inputMode="tel"
          autoComplete="tel"
          placeholder="0803 000 0000"
          onChange={(event) => setPhone(event.target.value)}
          className={authFieldClassName}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">
          Email{" "}
          {emailOptional ? (
            <span className="font-normal text-ink-muted">(optional)</span>
          ) : null}
        </span>
        <input
          name="email"
          value={email}
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          onChange={(event) => setEmail(event.target.value)}
          className={authFieldClassName}
        />
      </label>

      <button
        type="submit"
        disabled={!canSubmit}
        className={cn(
          "mt-2 flex h-14 min-h-12 items-center justify-center rounded-2xl text-[15px] font-semibold",
          "transition-[background-color,color,transform,box-shadow] duration-150",
          "ease-[cubic-bezier(0.16,1,0.3,1)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40",
          canSubmit
            ? "bg-brand-green text-white shadow-gasgo-md active:scale-[0.985]"
            : "cursor-not-allowed bg-surface-muted text-ink-muted",
        )}
      >
        {submitLabel}
      </button>
    </form>
  );
}
