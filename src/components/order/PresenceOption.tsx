import { RadioMark } from "@/components/order/RadioMark";
import { tactileSelect } from "@/components/ui/tactile";
import type { PresenceOption as PresenceOptionType } from "@/config/delivery";

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
      className={tactileSelect(selected, "flex w-full items-center gap-3.5 py-3.5")}
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
