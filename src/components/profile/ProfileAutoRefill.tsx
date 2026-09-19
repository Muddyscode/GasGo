import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { cn } from "@/lib/utils";

type ProfileAutoRefillProps = {
  enabled: boolean;
  onToggle: (next: boolean) => void;
};

export function ProfileAutoRefill({ enabled, onToggle }: ProfileAutoRefillProps) {
  return (
    <SurfaceCard className="relative overflow-hidden bg-surface-muted">
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
            {enabled
              ? "Auto-refill is on. We’ll deliver before your gauge hits empty."
              : "Auto-refill watches your gauge and delivers before you hit empty."}
          </p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
            {enabled ? "On · demo only" : "Off · demo only"}
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label="Never run out auto-refill"
          onClick={() => onToggle(!enabled)}
          className={cn(
            "relative mt-0.5 h-7 w-12 shrink-0 rounded-full transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2",
            enabled ? "bg-brand-green" : "bg-border",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "absolute top-0.5 size-6 rounded-full bg-white shadow-gasgo-soft",
              "transition-transform duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]",
              enabled ? "translate-x-5" : "translate-x-0.5",
            )}
          />
        </button>
      </div>
    </SurfaceCard>
  );
}
