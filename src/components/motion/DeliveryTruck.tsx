import { cn } from "@/lib/utils";

type DeliveryTruckProps = {
  label?: string;
  compact?: boolean;
  className?: string;
};

export function DeliveryTruck({
  label = "Rider on the way",
  compact = false,
  className,
}: DeliveryTruckProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-surface-soft shadow-gasgo-soft",
        compact ? "h-16" : "h-[7.5rem] sm:h-36",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 truck-sky" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 truck-road sm:h-10" />
      <div className="truck-vehicle absolute bottom-5 left-0 sm:bottom-6">
        <TruckSvg />
      </div>
      {compact ? null : (
        <p className="absolute left-3 top-2.5 text-[12px] font-semibold tracking-wide text-ink/80">
          {label}
        </p>
      )}
    </div>
  );
}

function TruckSvg() {
  return (
    <svg
      viewBox="0 0 112 48"
      className="h-10 w-[5.5rem] drop-shadow-sm sm:h-12 sm:w-28"
      aria-hidden="true"
    >
      <rect x="4" y="14" width="58" height="22" rx="4" fill="#1CA350" />
      <rect x="10" y="18" width="18" height="10" rx="2" fill="#E8F5EE" />
      <rect x="32" y="18" width="24" height="10" rx="2" fill="#0B1F14" opacity="0.18" />
      <rect x="62" y="20" width="32" height="16" rx="3" fill="#0B1F14" />
      <rect x="68" y="23" width="14" height="8" rx="1.5" fill="#FFDF22" />
      <circle cx="24" cy="38" r="6" fill="#0B1F14" />
      <circle cx="24" cy="38" r="2.4" fill="#E6EEE9" />
      <circle cx="78" cy="38" r="6" fill="#0B1F14" />
      <circle cx="78" cy="38" r="2.4" fill="#E6EEE9" />
      <path d="M8 14h20l6-8H20c-2 0-4 2-5 4L8 14Z" fill="#148A42" />
    </svg>
  );
}
