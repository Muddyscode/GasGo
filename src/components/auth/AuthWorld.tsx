import { HeroRun } from "@/components/marketing/HeroRun";
import { cn } from "@/lib/utils";

/** Illustrated PH gas world for the auth visual panel — cylinders, plant, green truck. */
export function AuthWorld({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "auth-visual relative overflow-hidden bg-surface-muted",
        compact ? "h-44 min-h-44 sm:h-52" : "h-full min-h-dvh",
        className,
      )}
    >
      <HeroRun
        className={cn(
          "absolute inset-0 min-h-full",
          compact ? "scale-[1.15] origin-bottom" : "scale-110 origin-center",
        )}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface via-surface/70 to-transparent px-5 pb-6 pt-16 lg:pb-8">
        <p className="text-[13px] font-medium text-brand-green">Port Harcourt only</p>
        <p className="mt-1 max-w-[22ch] font-display text-[1.35rem] font-semibold leading-tight text-ink">
          Plant refill. Your cylinder. Your street.
        </p>
      </div>
    </div>
  );
}
