import { cn } from "@/lib/utils";
import {
  DeliveryTruck,
  type TruckSizeToken,
} from "@/components/motion/DeliveryTruck";

type DeliveryLoadingProps = {
  label?: string;
  size?: number | TruckSizeToken;
  className?: string;
};

export function DeliveryLoading({
  label = "On the way…",
  size = "md",
  className,
}: DeliveryLoadingProps) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center px-5 py-12",
        className,
      )}
    >
      <DeliveryTruck variant="loading" size={size} label={label} />
    </div>
  );
}
