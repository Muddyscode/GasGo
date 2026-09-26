"use client";

import { useCallback, useRef, type KeyboardEvent } from "react";
import { Building2, ChefHat, Home, type LucideIcon } from "lucide-react";
import { DEMO_PERSONAS, type DemoPersonaId } from "@/data/demo-personas";
import { cn } from "@/lib/utils";

const ICONS: Record<(typeof DEMO_PERSONAS)[number]["icon"], LucideIcon> = {
  home: Home,
  chefHat: ChefHat,
  building2: Building2,
};

type DemoPersonaPickerProps = {
  selectedId: DemoPersonaId;
  onSelect: (id: DemoPersonaId) => void;
  onContinue: () => void;
};

export function DemoPersonaPicker({
  selectedId,
  onSelect,
  onContinue,
}: DemoPersonaPickerProps) {
  const buttonRefs = useRef<Partial<Record<DemoPersonaId, HTMLButtonElement | null>>>({});
  const selectedIndex = DEMO_PERSONAS.findIndex((persona) => persona.id === selectedId);

  const selectPersona = useCallback(
    (id: DemoPersonaId) => {
      onSelect(id);
      buttonRefs.current[id]?.focus();
    },
    [onSelect],
  );

  const move = useCallback(
    (delta: number) => {
      const count = DEMO_PERSONAS.length;
      const current = selectedIndex < 0 ? 0 : selectedIndex;
      const next = (current + delta + count) % count;
      const persona = DEMO_PERSONAS[next];
      if (persona) selectPersona(persona.id);
    },
    [selectPersona, selectedIndex],
  );

  function onGroupKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      move(1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      move(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      const first = DEMO_PERSONAS[0];
      if (first) selectPersona(first.id);
    } else if (event.key === "End") {
      event.preventDefault();
      const last = DEMO_PERSONAS[DEMO_PERSONAS.length - 1];
      if (last) selectPersona(last.id);
    }
  }

  return (
    <section aria-labelledby="account-heading">
      <h2
        id="account-heading"
        className="font-display text-[1.15rem] font-semibold tracking-tight text-ink"
      >
        Choose an account
      </h2>

      <div
        role="radiogroup"
        aria-labelledby="account-heading"
        onKeyDown={onGroupKeyDown}
        className="mt-4 grid gap-2.5"
      >
        {DEMO_PERSONAS.map((persona) => {
          const Icon = ICONS[persona.icon];
          const selected = persona.id === selectedId;
          return (
            <button
              key={persona.id}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              ref={(node) => {
                buttonRefs.current[persona.id] = node;
              }}
              onClick={() => selectPersona(persona.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl border bg-surface px-3.5 py-3 text-left",
                "transition-[transform,box-shadow,border-color,background-color] duration-150",
                "ease-[cubic-bezier(0.16,1,0.3,1)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green",
                "focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                selected
                  ? "border-brand-green shadow-gasgo-md ring-2 ring-brand-green/35"
                  : "border-border hover:border-brand-green/40 hover:bg-surface-muted",
                selected && "motion-safe:-translate-y-0.5",
                !selected && "motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-gasgo-soft",
              )}
            >
              <span
                aria-hidden="true"
                className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-green/12 text-brand-green"
              >
                <Icon className="size-5" strokeWidth={1.75} />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[16px] font-semibold tracking-tight text-ink">
                  {persona.name}
                </span>
                <span className="mt-0.5 block text-[13px] leading-snug text-ink-muted">
                  {persona.role}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onContinue}
        className={cn(
          "mt-4 flex h-12 min-h-12 w-full items-center justify-center rounded-2xl",
          "bg-brand-green text-[15px] font-semibold text-white shadow-gasgo-md",
          "transition-[transform,background-color] duration-150",
          "ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.985]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40",
        )}
      >
        Continue
      </button>
    </section>
  );
}
