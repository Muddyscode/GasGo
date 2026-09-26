"use client";

import { Search } from "lucide-react";
import { HUB_CONFIGURED_STUB_LABEL } from "@/config/fulfillment";
import { useAdminSession } from "@/stores/admin-session";

type DispatchHeaderProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export function DispatchHeader({ query, onQueryChange }: DispatchHeaderProps) {
  const lock = useAdminSession((state) => state.lock);

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-surface/95 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-md md:px-6">
      <div className="flex h-14 items-center justify-between gap-3">
        <h1 className="text-[17px] font-semibold tracking-tight text-ink">Dispatch</h1>
        <button
          type="button"
          onClick={lock}
          className="text-sm font-semibold text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
        >
          Lock
        </button>
      </div>
      <p className="mb-2 text-xs leading-relaxed text-ink-muted">
        Live ₦/kg and PH zones are {HUB_CONFIGURED_STUB_LABEL}. Admin fee UI
        later.
      </p>
      <label className="relative mb-3 block">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
          strokeWidth={2}
        />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search order number or phone"
          className="h-11 w-full rounded-xl border border-border bg-surface-muted pl-10 pr-3 text-[15px] text-ink outline-none placeholder:text-ink-muted/70 focus:border-brand-green focus:bg-surface focus:ring-2 focus:ring-brand-green/20"
        />
      </label>
    </header>
  );
}
