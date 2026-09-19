import Image from "next/image";
import { Check } from "lucide-react";
import type { CylinderOption } from "@/config/cylinders";
import { formatCylinderSize } from "@/config/cylinders";
import { interactiveCardClassName, selectedCardClassName } from "@/components/ui/card";
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
        interactiveCardClassName,
        "group flex w-full items-center gap-3.5 px-4 py-4 text-left",
        "min-h-[76px] md:min-h-[96px]",
        selected && selectedCardClassName,
      )}
    >
      <CylinderThumb sizeKg={option.sizeKg} selected={selected} />

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

function CylinderThumb({ sizeKg, selected }: { sizeKg: number; selected: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative h-14 w-14 shrink-0 overflow-hidden rounded-xl",
        selected ? "ring-2 ring-brand-green/40" : "bg-surface-muted",
      )}
    >
      <Image
        src="/images/cooking-gas-cylinders.png"
        alt=""
        fill
        sizes="56px"
        className={cn(
          "object-cover transition-transform duration-300",
          sizeKg <= 6 && "scale-125 object-[20%_60%]",
          sizeKg > 6 && sizeKg < 20 && "object-[55%_70%]",
          sizeKg >= 20 && "scale-110 object-[80%_40%]",
        )}
      />
    </span>
  );
}
