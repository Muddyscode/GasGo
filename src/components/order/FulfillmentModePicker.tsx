import { Truck, Warehouse } from "lucide-react";
import { RadioMark } from "@/components/order/RadioMark";
import { interactiveCardClassName, selectedCardClassName } from "@/components/ui/card";
import {
  FULFILLMENT_COPY,
  FULFILLMENT_MODES,
  type FulfillmentMode,
} from "@/config/fulfillment";
import { cn } from "@/lib/utils";

type FulfillmentModePickerProps = {
  selected: FulfillmentMode;
  onSelect: (mode: FulfillmentMode) => void;
};

const ICONS = {
  door_to_door: Truck,
  hub: Warehouse,
} as const;

export function FulfillmentModePicker({
  selected,
  onSelect,
}: FulfillmentModePickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Fulfillment mode"
      className="flex flex-col gap-2.5"
    >
      {FULFILLMENT_MODES.map((mode) => {
        const copy = FULFILLMENT_COPY[mode];
        const Icon = ICONS[mode];
        const isSelected = selected === mode;
        return (
          <button
            key={mode}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`${copy.title}. ${copy.detail}`}
            onClick={() => onSelect(mode)}
            className={cn(
              interactiveCardClassName,
              "flex w-full items-start gap-3.5 px-4 py-4 text-left",
              isSelected && selectedCardClassName,
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "grid size-11 shrink-0 place-items-center rounded-xl transition-colors duration-150",
                isSelected ? "bg-surface text-brand-green" : "bg-surface-muted text-ink-muted",
              )}
            >
              <Icon className="size-5" strokeWidth={1.75} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[17px] font-semibold tracking-tight text-ink">
                {copy.title}
              </span>
              <span className="mt-0.5 block text-sm leading-snug text-ink-muted">
                {copy.detail}
              </span>
              {mode === "hub" ? (
                <span className="mt-1.5 block text-xs font-medium text-brand-green">
                  Gas only. Pre-order. No walk-ins.
                </span>
              ) : (
                <span className="mt-1.5 block text-xs font-medium text-ink-muted">
                  Includes transport
                </span>
              )}
            </span>
            <RadioMark selected={isSelected} />
          </button>
        );
      })}
    </div>
  );
}
