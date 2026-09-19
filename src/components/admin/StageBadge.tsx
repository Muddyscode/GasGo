import { getDeliveryStage, type DeliveryStageId } from "@/config/delivery-stages";
import { cn } from "@/lib/utils";

const TONE: Record<DeliveryStageId, string> = {
  queued: "bg-surface-muted text-ink-muted",
  rider_assigned: "bg-surface-muted text-ink",
  picked_up: "bg-surface-soft text-brand-green",
  en_route: "bg-surface-soft text-brand-green",
  nearby: "bg-brand-green text-white",
  delivered: "bg-brand-green text-white",
  attempt_failed: "bg-brand-red/10 text-brand-red",
};

export function StageBadge({ stage }: { stage: DeliveryStageId }) {
  const meta = getDeliveryStage(stage);
  return (
    <span
      className={cn(
        "inline-flex h-6 max-w-full items-center truncate rounded-full px-2 text-[11px] font-semibold tracking-wide",
        TONE[stage],
      )}
    >
      {meta?.title ?? stage}
    </span>
  );
}
