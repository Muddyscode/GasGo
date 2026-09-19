"use client";

import {
  DISPATCH_FILTERS,
  DISPATCH_FILTER_LABELS,
  type DispatchFilter,
} from "@/lib/admin/filters";
import { cn } from "@/lib/utils";

type FilterTabsProps = {
  value: DispatchFilter;
  counts: Record<DispatchFilter, number>;
  onChange: (filter: DispatchFilter) => void;
};

export function FilterTabs({ value, counts, onChange }: FilterTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Dispatch filters"
      className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5"
    >
      {DISPATCH_FILTERS.map((filter) => {
        const selected = value === filter;
        return (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(filter)}
            className={cn(
              "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-semibold",
              "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40",
              selected
                ? "bg-brand-green text-white"
                : "bg-surface-muted text-ink-muted hover:bg-surface-soft hover:text-ink",
            )}
          >
            {DISPATCH_FILTER_LABELS[filter]}
            <span
              className={cn(
                "tabular-nums text-[11px]",
                selected ? "text-white/85" : "text-ink-muted",
              )}
            >
              {counts[filter]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
