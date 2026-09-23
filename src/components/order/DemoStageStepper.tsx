"use client";

import { getDeliveryStage, type DeliveryStageId } from "@/config/delivery-stages";
import { buttonClassName } from "@/components/ui/button";
import { isDemoToolsEnabled } from "@/lib/demo-tools";
import { nextPlantLoopStage, resetPlantLoopStage } from "@/lib/tracking-stage";
import { cn } from "@/lib/utils";

type DemoStageStepperProps = {
  orderId: string;
  stageId: DeliveryStageId;
  onStage: (stage: DeliveryStageId) => void;
};

export function DemoStageStepper({
  orderId,
  stageId,
  onStage,
}: DemoStageStepperProps) {
  if (!isDemoToolsEnabled()) return null;

  const next = nextPlantLoopStage(stageId);
  const nextTitle = next ? getDeliveryStage(next)?.title : null;

  return (
    <section
      className="rounded-2xl border border-dashed border-brand-yellow/70 bg-brand-yellow/10 px-4 py-4"
      data-demo-stepper="plant-loop"
      data-demo-order={orderId}
    >
      <p className="text-[12px] font-medium text-ink">
        Demo pitch — this order only
      </p>
      <p className="mt-1 text-sm leading-relaxed text-ink-muted">
        Walk the plant loop for investors. Reset anytime. Does not change other
        orders or leave the app stuck on the return step.
      </p>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          disabled={!next}
          onClick={() => next && onStage(next)}
          className={buttonClassName(
            { variant: "primary", size: "sm" },
            "h-11 w-full sm:flex-1",
          )}
        >
          {nextTitle ? `Advance to ${nextTitle}` : "Loop complete"}
        </button>
        <button
          type="button"
          onClick={() => onStage(resetPlantLoopStage())}
          className={buttonClassName(
            { variant: "secondary", size: "sm" },
            "h-11 w-full sm:w-auto sm:px-5",
          )}
        >
          Reset
        </button>
      </div>

      <button
        type="button"
        onClick={() => onStage("attempt_failed")}
        className={cn(
          buttonClassName({ variant: "ghost", size: "sm" }, "mt-2 h-10 w-full text-brand-red"),
        )}
      >
        Show late handover
      </button>
    </section>
  );
}
