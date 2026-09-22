import { Check } from "lucide-react";
import {
  CUSTOMER_DELIVERY_STAGES,
  type DeliveryStageId,
} from "@/config/delivery-stages";
import { customerTimelineIndex } from "@/lib/tracking-stage";
import { cn } from "@/lib/utils";

type TrackingTimelineProps = {
  currentStageId: DeliveryStageId;
  late?: boolean;
};

export function TrackingTimeline({
  currentStageId,
  late = false,
}: TrackingTimelineProps) {
  const currentIndex = customerTimelineIndex(currentStageId);

  return (
    <ol className="relative flex flex-col">
      {CUSTOMER_DELIVERY_STAGES.map((stage, index) => {
        const done = index < currentIndex;
        const current = index === currentIndex;
        const upcomingNext = index === currentIndex + 1;
        const last = index === CUSTOMER_DELIVERY_STAGES.length - 1;
        const currentTone = late ? "critical" : "safe";

        return (
          <li key={stage.id} className="relative flex gap-3.5">
            <div className="flex w-6 shrink-0 flex-col items-center">
              <span
                className={cn(
                  "relative z-10 grid size-6 place-items-center rounded-full border-2",
                  done && "border-brand-green bg-brand-green text-white",
                  current &&
                    currentTone === "safe" &&
                    "border-brand-green bg-surface text-brand-green shadow-[0_0_0_4px_rgba(28,163,80,0.16)]",
                  current &&
                    currentTone === "critical" &&
                    "border-brand-red bg-surface text-brand-red shadow-[0_0_0_4px_rgba(220,38,38,0.16)]",
                  !done && !current && "border-border bg-surface text-transparent",
                )}
              >
                {done ? (
                  <Check className="size-3.5 stroke-[3]" />
                ) : (
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      current && currentTone === "safe" && "bg-brand-green",
                      current && currentTone === "critical" && "bg-brand-red",
                      !current && "bg-border",
                    )}
                  />
                )}
                {current ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-0 animate-ping rounded-full",
                      late ? "bg-brand-red/25" : "bg-brand-green/25",
                    )}
                  />
                ) : null}
              </span>
              {last ? null : (
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-1 w-0.5 flex-1 min-h-8 rounded-full",
                    done || (current && !late) ? "bg-brand-green" : late && current ? "bg-brand-red/40" : "bg-border",
                  )}
                />
              )}
            </div>

            <div className={cn("min-w-0 pb-6", last && "pb-0")}>
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={cn(
                    "text-[15px] font-semibold tracking-tight",
                    current && late && "text-brand-red",
                    current && !late && "text-brand-green",
                    done && "text-ink",
                    !done && !current && "text-ink-muted",
                  )}
                >
                  {stage.title}
                </p>
                {current ? (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
                      late
                        ? "bg-brand-red/10 text-brand-red"
                        : "bg-brand-green/10 text-brand-green",
                    )}
                  >
                    Now
                  </span>
                ) : null}
                {upcomingNext ? (
                  <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
                    Next
                  </span>
                ) : null}
              </div>
              <p
                className={cn(
                  "mt-0.5 text-sm leading-snug",
                  current || done ? "text-ink-muted" : "text-ink-muted/70",
                )}
              >
                {current ? stage.now : upcomingNext ? stage.now : stage.detail}
              </p>
              {current ? (
                <p className="mt-1 text-sm leading-snug text-ink">
                  <span className="font-semibold">Next: </span>
                  {stage.next}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
