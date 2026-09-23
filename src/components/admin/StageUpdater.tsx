"use client";

import { DELIVERY_STAGES, type DeliveryStageId } from "@/config/delivery-stages";
import { nextDispatchStage } from "@/lib/admin/filters";
import { cn } from "@/lib/utils";

type StageUpdaterProps = {
  orderId: string;
  stage: DeliveryStageId;
  pending?: boolean;
  onChange: (stage: DeliveryStageId) => void;
};

export function StageUpdater({
  orderId,
  stage,
  pending = false,
  onChange,
}: StageUpdaterProps) {
  const next = nextDispatchStage(stage);
  const selectId = `stage-${orderId}`;

  return (
    <div className="flex items-center gap-2">
      {next ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => onChange(next)}
          className={cn(
            "inline-flex h-11 min-w-0 flex-1 items-center justify-center rounded-xl bg-brand-green px-3 text-sm font-semibold text-white",
            "transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2",
            pending && "cursor-wait opacity-70",
          )}
        >
          <span className="truncate">
            {pending ? "Updating…" : `Next: ${stageTitle(next)}`}
          </span>
        </button>
      ) : null}

      <label className="sr-only" htmlFor={selectId}>
        Set stage
      </label>
      <select
        id={selectId}
        disabled={pending}
        value={stage}
        onChange={(event) => onChange(event.target.value as DeliveryStageId)}
        className={cn(
          "h-11 min-w-[7.5rem] rounded-xl border border-border bg-surface px-2.5 text-sm font-medium text-ink",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40",
          next ? "shrink-0" : "flex-1",
          pending && "cursor-wait opacity-70",
        )}
      >
        {DELIVERY_STAGES.map((option) => (
          <option key={option.id} value={option.id}>
            {option.title}
          </option>
        ))}
      </select>
    </div>
  );
}

function stageTitle(id: DeliveryStageId): string {
  return DELIVERY_STAGES.find((stage) => stage.id === id)?.title ?? id;
}
