import { Check } from "lucide-react";
import {
  DELIVERY_STAGES,
  getDeliveryStageIndex,
  type DeliveryStageId,
} from "@/config/delivery-stages";
import { cn } from "@/lib/utils";

type TrackingTimelineProps = {
  currentStageId: DeliveryStageId;
};

export function TrackingTimeline({ currentStageId }: TrackingTimelineProps) {
  const currentIndex = getDeliveryStageIndex(currentStageId);

  return (
    <ol className="relative flex flex-col">
      {DELIVERY_STAGES.map((stage, index) => {
        const done = index < currentIndex;
        const current = index === currentIndex;
        const last = index === DELIVERY_STAGES.length - 1;

        return (
          <li key={stage.id} className="relative flex gap-3.5">
            <div className="flex w-6 shrink-0 flex-col items-center">
              <span
                className={cn(
                  "relative z-10 grid size-6 place-items-center rounded-full border-2",
                  done && "border-brand-green bg-brand-green text-white",
                  current &&
                    "border-brand-green bg-white text-brand-green shadow-[0_0_0_4px_rgba(28,163,80,0.16)]",
                  !done && !current && "border-border bg-surface text-transparent",
                )}
              >
                {done ? (
                  <Check className="size-3.5 stroke-[3]" />
                ) : (
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      current ? "bg-brand-green" : "bg-border",
                    )}
                  />
                )}
                {current ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 animate-ping rounded-full bg-brand-green/25"
                  />
                ) : null}
              </span>
              {last ? null : (
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-1 w-0.5 flex-1 min-h-8 rounded-full",
                    done || current ? "bg-brand-green" : "bg-border",
                  )}
                />
              )}
            </div>

            <div className={cn("min-w-0 pb-6", last && "pb-0")}>
              <p
                className={cn(
                  "text-[15px] font-semibold tracking-tight",
                  current ? "text-brand-green" : done ? "text-ink" : "text-ink-muted",
                )}
              >
                {stage.title}
              </p>
              <p
                className={cn(
                  "mt-0.5 text-sm leading-snug",
                  current || done ? "text-ink-muted" : "text-ink-muted/70",
                )}
              >
                {stage.detail}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
