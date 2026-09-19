import { cn } from "@/lib/utils";

type DeliveryTruckMotionProps = {
  className?: string;
  label?: string;
  compact?: boolean;
};

export function DeliveryTruckMotion({
  className,
  label = "Rider on the way",
  compact = false,
}: DeliveryTruckMotionProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-surface-soft",
        compact ? "h-16" : "h-24",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-4 bottom-[18px] h-px bg-border" />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-3 bottom-[16px] h-2 w-[calc(100%-1.5rem)] text-ink-muted/35"
        viewBox="0 0 200 8"
        preserveAspectRatio="none"
      >
        <line
          className="gasgo-road-dash"
          x1="0"
          y1="4"
          x2="200"
          y2="4"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="8 10"
        />
      </svg>

      <div className="gasgo-truck-track absolute inset-0">
        <TruckSvg className={cn("absolute bottom-3 left-0", compact ? "h-9 w-[4.5rem]" : "h-11 w-24")} />
      </div>
    </div>
  );
}

function TruckSvg({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 96 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="10" width="46" height="22" rx="4" fill="#1CA350" />
      <rect x="8" y="14" width="16" height="8" rx="1.5" fill="#FFDF22" opacity="0.9" />
      <rect x="27" y="14" width="18" height="8" rx="1.5" fill="#0B1F14" opacity="0.18" />
      <path d="M50 16h16.5a4 4 0 0 1 3.6 2.3L76 28H50V16Z" fill="#0B1F14" />
      <path d="M50 16h16.5a4 4 0 0 1 3.6 2.3L76 28H50V16Z" fill="#1CA350" opacity="0.85" />
      <path d="M54 18.5h10.5a2 2 0 0 1 1.8 1.1L70 26H54V18.5Z" fill="#E8F5EE" />
      <circle className="gasgo-truck-wheel" cx="18" cy="34" r="6" fill="#0B1F14" />
      <circle cx="18" cy="34" r="2.4" fill="#E6EEE9" />
      <circle className="gasgo-truck-wheel" cx="62" cy="34" r="6" fill="#0B1F14" />
      <circle cx="62" cy="34" r="2.4" fill="#E6EEE9" />
      <rect x="72" y="24" width="4" height="3" rx="1" fill="#FFDF22" />
    </svg>
  );
}
