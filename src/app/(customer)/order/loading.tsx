import { DeliveryLoading } from "@/components/motion";

export default function OrderRouteLoading() {
  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <DeliveryLoading label="Getting your delivery ready…" />
    </div>
  );
}
