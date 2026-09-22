"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { THEME_PREFERENCES, type ThemePreference } from "@/lib/theme";
import { cn } from "@/lib/utils";

const OPTIONS: {
  value: ThemePreference;
  label: string;
  Icon: typeof Sun;
}[] = [
  { value: "system", label: "System", Icon: Monitor },
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
];

export function ThemePreferenceRow() {
  const { preference, setPreference, ready } = useTheme();

  return (
    <section className="rounded-2xl border border-border bg-surface px-4 py-4 shadow-gasgo-soft">
      <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        Appearance
      </p>
      <p className="mt-1 text-sm text-ink-muted">
        Follows your device until you pick a side. Brand colors stay the same.
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="Theme">
        {OPTIONS.map(({ value, label, Icon }) => {
          const active = ready && preference === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => setPreference(value)}
              className={cn(
                "inline-flex min-h-11 flex-col items-center justify-center gap-1 rounded-2xl border px-2 py-2.5",
                "text-[12px] font-semibold transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40",
                active
                  ? "border-brand-green bg-surface-soft text-brand-green"
                  : "border-border bg-surface-muted text-ink hover:bg-surface-soft",
              )}
            >
              <Icon className="size-4" strokeWidth={1.85} />
              {label}
            </button>
          );
        })}
      </div>
      <p className="sr-only">{THEME_PREFERENCES.join(", ")}</p>
    </section>
  );
}
