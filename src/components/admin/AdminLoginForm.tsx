"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buttonClassName } from "@/components/ui/button";
import { PageBody, PageTitle } from "@/components/ui/page";
import { ADMIN_DEMO_PIN_FALLBACK } from "@/lib/admin/auth";
import { useAdminSession } from "@/stores/admin-session";

export function AdminLoginForm() {
  const router = useRouter();
  const unlock = useAdminSession((state) => state.unlock);
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    const ok = unlock(pin);
    if (!ok) {
      setError("That PIN doesn’t match.");
      return;
    }
    setError(null);
    router.replace("/admin");
  }

  return (
    <PageBody className="pt-8">
      <PageTitle
        eyebrow="Plant ops"
        subtitle="Demo gate only — not RBAC. Random visitors can’t bump order stages."
      >
        Admin login
      </PageTitle>

      <form
        className="mt-2 flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Demo PIN</span>
          <input
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            value={pin}
            onChange={(event) => {
              setPin(event.target.value);
              setError(null);
            }}
            placeholder="Enter admin PIN"
            className="h-12 w-full rounded-2xl border border-border bg-surface-muted px-4 text-[15px] tracking-[0.3em] text-ink outline-none focus:border-brand-green focus:bg-surface focus:ring-2 focus:ring-brand-green/20"
          />
        </label>
        {error ? (
          <p className="text-sm font-medium text-brand-red" role="alert">
            {error}
          </p>
        ) : (
          <p className="text-sm leading-relaxed text-ink-muted">
            Uses <code className="font-mono text-ink">NEXT_PUBLIC_ADMIN_DEMO_PIN</code>{" "}
            when set, otherwise the documented demo PIN{" "}
            <code className="font-mono text-ink">{ADMIN_DEMO_PIN_FALLBACK}</code>.
          </p>
        )}
        <button type="submit" className={buttonClassName({ variant: "primary", size: "lg" })}>
          Unlock dispatch
        </button>
      </form>
    </PageBody>
  );
}
