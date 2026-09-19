import { tactileSelect } from "@/components/ui/tactile";
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
      className={tactileSelect(
        selected,
        cn("min-h-14 px-3.5 py-3", wide && "col-span-2"),
      )}
    >
      <span className="block text-[15px] font-semibold tracking-tight text-ink">
        {option.title}
      </span>
      <span className="mt-0.5 block text-sm text-ink-muted">{option.detail}</span>
    </button>
  );
}
