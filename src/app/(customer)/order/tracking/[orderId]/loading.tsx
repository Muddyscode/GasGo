import { DeliveryLoading } from "@/components/motion";

export default function TrackingRouteLoading() {
  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <DeliveryLoading label="Loading your refill loop…" />
    </div>
  );
}
