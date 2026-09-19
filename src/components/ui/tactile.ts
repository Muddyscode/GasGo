import { cn } from "@/lib/utils";

/** Shared tactile motion — locked to token easing. Respects reduced motion. */
export const tactile = {
  motion:
    "transition-[transform,box-shadow,border-color,background-color,filter] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none",
  press: "active:scale-[0.985] motion-reduce:active:scale-100",
  lift: "md:hover:-translate-y-0.5 md:hover:shadow-gasgo-md motion-reduce:md:hover:translate-y-0",
  focus:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2",
  card: "rounded-2xl border border-border bg-surface shadow-gasgo-soft",
} as const;

export function tactileSelect(selected: boolean, className?: string) {
  return cn(
    "min-h-11 rounded-2xl border px-4 py-4 text-left",
    tactile.motion,
    tactile.press,
    tactile.focus,
    selected
      ? "border-brand-green bg-surface-soft shadow-gasgo-md"
      : cn(
          "border-border bg-surface shadow-gasgo-soft hover:border-ink-muted/25 hover:shadow-gasgo-md",
          tactile.lift,
        ),
    className,
  );
}

export function tactilePrimary(className?: string) {
  return cn(
    "inline-flex h-14 min-h-11 w-full items-center justify-center rounded-2xl bg-brand-green px-5 text-base font-semibold tracking-tight text-white shadow-gasgo-md",
    tactile.motion,
    tactile.press,
    tactile.lift,
    tactile.focus,
    "hover:brightness-[1.03] disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-muted disabled:shadow-none disabled:hover:translate-y-0 disabled:hover:brightness-100",
    className,
  );
}

export function tactileSecondary(className?: string) {
  return cn(
    "inline-flex h-14 min-h-11 w-full items-center justify-center rounded-2xl bg-surface-muted px-5 text-base font-semibold tracking-tight text-ink shadow-gasgo-soft",
    tactile.motion,
    tactile.press,
    tactile.lift,
    tactile.focus,
    className,
  );
}
