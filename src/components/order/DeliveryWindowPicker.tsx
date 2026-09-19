import type { DeliveryWindow, DeliveryWindowId } from "@/config/delivery";
import { DELIVERY_WINDOWS } from "@/config/delivery";
import { cn } from "@/lib/utils";

type DeliveryWindowPickerProps = {
  selectedId: DeliveryWindowId;
  onSelect: (id: DeliveryWindowId) => void;
};

export function DeliveryWindowPicker({
  selectedId,
  onSelect,
}: DeliveryWindowPickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Preferred delivery window"
      className="grid grid-cols-2 gap-2.5"
    >
      {DELIVERY_WINDOWS.map((option) => (
        <WindowChip
          key={option.id}
          option={option}
          selected={selectedId === option.id}
          wide={option.id === "asap"}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function WindowChip({
  option,
  selected,
  wide,
  onSelect,
}: {
  option: DeliveryWindow;
  selected: boolean;
  wide: boolean;
  onSelect: (id: DeliveryWindowId) => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`${option.title}, ${option.detail}`}
      onClick={() => onSelect(option.id)}
      className={cn(
        "min-h-14 rounded-2xl border px-3.5 py-3 text-left outline-none",
        "transition-[border-color,background-color,box-shadow,transform] duration-150",
        "ease-[cubic-bezier(0.16,1,0.3,1)]",
        "active:scale-[0.985] focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2",
        wide && "col-span-2",
        selected
          ? "border-brand-green bg-surface-soft shadow-gasgo-md"
          : "border-border bg-surface shadow-gasgo-soft hover:border-ink-muted/25",
      )}
    >
      <span className="block text-[15px] font-semibold tracking-tight text-ink">
        {option.title}
      </span>
      <span className="mt-0.5 block text-sm text-ink-muted">{option.detail}</span>
    </button>
  );
}
