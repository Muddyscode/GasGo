import { RadioMark } from "@/components/order/RadioMark";
import type { PresenceOption as PresenceOptionType } from "@/config/delivery";
import { cn } from "@/lib/utils";

type PresenceOptionProps = {
  option: PresenceOptionType;
  selected: boolean;
  onSelect: (id: PresenceOptionType["id"]) => void;
};

export function PresenceOption({ option, selected, onSelect }: PresenceOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`${option.title}. ${option.detail}`}
      onClick={() => onSelect(option.id)}
      className={cn(
        "flex w-full items-center gap-3.5 rounded-2xl border px-4 py-3.5 text-left",
        "min-h-14 outline-none transition-[border-color,background-color,box-shadow,transform] duration-150",
        "ease-[cubic-bezier(0.16,1,0.3,1)]",
        "active:scale-[0.985] focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2",
        selected
          ? "border-brand-green bg-surface-soft shadow-gasgo-md"
          : "border-border bg-surface shadow-gasgo-soft hover:border-ink-muted/25 hover:shadow-gasgo-md",
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold tracking-tight text-ink">
          {option.title}
        </span>
        <span className="mt-0.5 block text-sm leading-snug text-ink-muted">
          {option.detail}
        </span>
      </span>
      <RadioMark selected={selected} />
    </button>
  );
}
