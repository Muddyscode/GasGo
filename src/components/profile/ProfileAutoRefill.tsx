import {
  MotionDashesGlyph,
  SealedValveGlyph,
} from "@/components/illustrations/gas-scenes";
import { cardClassName } from "@/components/ui/card";

export function ProfileAutoRefill() {
  return (
    <section className={`${cardClassName} relative overflow-hidden bg-surface-muted px-4 py-4`}>
      <span
        aria-hidden="true"
        className="absolute inset-y-3 left-0 w-1 rounded-full bg-brand-yellow"
      />
      <div className="flex items-start justify-between gap-3 pl-2">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold tracking-tight text-ink">
            Never run out
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">
            Auto-refill will watch your gauge and book a plant refill before you
            hit empty. Not available yet — no background orders today.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="mt-0.5 rounded-full border border-border bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
            Coming soon
          </span>
          <div className="flex items-end gap-1.5">
            <MotionDashesGlyph className="h-3 w-5 text-brand-green" />
            <SealedValveGlyph className="size-9" />
          </div>
        </div>
      </div>
    </section>
  );
}
