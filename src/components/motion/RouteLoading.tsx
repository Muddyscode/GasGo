import { DeliveryTruckMotion } from "@/components/motion/DeliveryTruckMotion";

type RouteLoadingProps = {
  title?: string;
  detail?: string;
};

export function RouteLoading({
  title = "On our way…",
  detail = "Loading your GasGo route.",
}: RouteLoadingProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-5 py-16">
      <DeliveryTruckMotion className="w-full max-w-sm" label={title} />
      <p className="mt-5 text-[15px] font-semibold tracking-tight text-ink">{title}</p>
      <p className="mt-1 text-sm text-ink-muted">{detail}</p>
      <div className="mt-8 w-full max-w-sm space-y-3" aria-hidden="true">
        <div className="h-4 w-2/3 animate-pulse rounded-lg bg-surface-muted" />
        <div className="h-24 animate-pulse rounded-2xl bg-surface-muted" />
        <div className="h-16 animate-pulse rounded-2xl bg-surface-muted" />
      </div>
    </div>
  );
}
