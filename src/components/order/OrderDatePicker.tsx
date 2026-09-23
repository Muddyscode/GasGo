import {
  CUTOFF_EXPLANATION,
  dateChipLabel,
  isAfterSameDayCutoff,
  listSelectableDates,
} from "@/config/fulfillment";
import { interactiveCardClassName, selectedCardClassName } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type OrderDatePickerProps = {
  pickupDate: string;
  returnDate: string;
  onPickupDate: (isoDate: string) => void;
  onReturnDate: (isoDate: string) => void;
  cutoffRolled?: boolean;
};

export function OrderDatePicker({
  pickupDate,
  returnDate,
  onPickupDate,
  onReturnDate,
  cutoffRolled = false,
}: OrderDatePickerProps) {
  const dates = listSelectableDates();
  const afterCutoff = isAfterSameDayCutoff();

  return (
    <div className="flex flex-col gap-5">
      {afterCutoff || cutoffRolled ? (
        <p
          className="rounded-2xl border border-brand-yellow/40 bg-brand-yellow/15 px-3.5 py-3 text-sm leading-relaxed text-ink"
          role="status"
        >
          {CUTOFF_EXPLANATION}
        </p>
      ) : (
        <p className="text-sm leading-relaxed text-ink-muted">{CUTOFF_EXPLANATION}</p>
      )}

      <DateChipGroup
        legend="Pickup date"
        value={pickupDate}
        dates={dates}
        onSelect={onPickupDate}
      />
      <DateChipGroup
        legend="Return date"
        value={returnDate}
        dates={dates}
        onSelect={onReturnDate}
      />
    </div>
  );
}

function DateChipGroup({
  legend,
  value,
  dates,
  onSelect,
}: {
  legend: string;
  value: string;
  dates: string[];
  onSelect: (isoDate: string) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-[15px] font-semibold tracking-tight text-ink">
        {legend}
      </legend>
      <div
        role="radiogroup"
        aria-label={legend}
        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
      >
        {dates.map((isoDate) => {
          const selected = value === isoDate;
          return (
            <button
              key={`${legend}-${isoDate}`}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${legend} ${dateChipLabel(isoDate)}`}
              onClick={() => onSelect(isoDate)}
              className={cn(
                interactiveCardClassName,
                "min-h-14 px-3 py-2.5 text-left",
                selected && selectedCardClassName,
              )}
            >
              <span className="block text-[15px] font-semibold tracking-tight text-ink">
                {dateChipLabel(isoDate)}
              </span>
              <span className="mt-0.5 block text-xs tabular-nums text-ink-muted">
                {isoDate}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
