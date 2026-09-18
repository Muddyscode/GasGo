import { Check } from "lucide-react";
import type { CylinderOption } from "@/config/cylinders";
import { formatCylinderSize } from "@/config/cylinders";
import { formatNaira } from "@/lib/money";
import { cn } from "@/lib/utils";

type CylinderCardProps = {
  option: CylinderOption;
  selected: boolean;
  onSelect: (id: CylinderOption["id"]) => void;
};

export function CylinderCard({ option, selected, onSelect }: CylinderCardProps) {
  const sizeLabel = formatCylinderSize(option.sizeKg);

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`${sizeLabel}, ${formatNaira(option.priceNgn)}. Best for ${option.bestFor}${
        option.badge ? `. ${option.badge}` : ""
      }`}
      onClick={() => onSelect(option.id)}
      className={cn(
        "group flex w-full items-center gap-3.5 rounded-2xl border px-4 py-4 text-left",
        "min-h-[76px] outline-none transition-[border-color,background-color,box-shadow,transform] duration-150",
        "ease-[cubic-bezier(0.16,1,0.3,1)]",
        "active:scale-[0.985] focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2",
        selected
          ? "border-brand-green bg-surface-soft shadow-gasgo-md"
          : "border-border bg-surface shadow-gasgo-soft hover:border-ink-muted/25 hover:shadow-gasgo-md",
      )}
    >
      <CylinderGlyph sizeKg={option.sizeKg} selected={selected} />

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-[17px] font-semibold tracking-tight text-ink">
            {sizeLabel}
          </span>
          {option.badge ? <CylinderBadgeLabel badge={option.badge} /> : null}
        </span>
        <span className="mt-0.5 block text-sm leading-snug text-ink-muted">
          Best for {option.bestFor.toLowerCase()}
        </span>
        <span className="mt-1.5 block text-[15px] font-semibold tabular-nums tracking-tight text-ink">
          {formatNaira(option.priceNgn)}
        </span>
      </span>

      <span
        aria-hidden="true"
        className={cn(
          "grid size-6 shrink-0 place-items-center rounded-full border-2 transition-colors duration-150",
          selected
            ? "border-brand-green bg-brand-green text-white"
            : "border-border bg-surface text-transparent",
        )}
      >
        <Check className="size-3.5 stroke-[3]" />
      </span>
    </button>
  );
}

function CylinderBadgeLabel({ badge }: { badge: NonNullable<CylinderOption["badge"]> }) {
  const popular = badge === "Most Popular";

  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-full px-2 text-[10px] font-semibold uppercase tracking-wide",
        popular
          ? "bg-brand-green text-white"
          : "bg-ink text-white",
      )}
    >
      {badge}
    </span>
  );
}

function CylinderGlyph({ sizeKg, selected }: { sizeKg: number; selected: boolean }) {
  const height = 28 + Math.min(sizeKg, 50) * 0.36;

  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid h-14 w-11 shrink-0 place-items-end justify-center rounded-xl transition-colors duration-150",
        selected ? "bg-white" : "bg-surface-muted",
      )}
    >
      <svg
        width="22"
        height={height}
        viewBox="0 0 22 48"
        preserveAspectRatio="xMidYMax meet"
        className={cn(
          "mb-1.5 transition-colors duration-150",
          selected ? "text-brand-green" : "text-ink-muted",
        )}
      >
        <rect x="8.5" y="1" width="5" height="5" rx="1.2" fill="currentColor" opacity="0.85" />
        <rect x="7" y="5" width="8" height="3.5" rx="1" fill="currentColor" />
        <rect x="3" y="9" width="16" height="37" rx="5" fill="currentColor" opacity="0.18" />
        <rect
          x="3"
          y="9"
          width="16"
          height="37"
          rx="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <rect x="6.5" y="14" width="9" height="2.5" rx="1.25" fill="currentColor" opacity="0.35" />
      </svg>
    </span>
  );
}
