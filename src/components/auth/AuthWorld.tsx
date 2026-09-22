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
        "auth-visual relative overflow-hidden bg-[#E8F3C8]",
        compact ? "h-44 min-h-44 sm:h-52" : "h-full min-h-dvh",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 hero-wash" aria-hidden="true" />
      <HeroRun
        className={cn(
          "absolute inset-0 min-h-full",
          compact ? "scale-[1.15] origin-bottom" : "scale-110 origin-center",
        )}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent px-5 pb-4 pt-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-yellow">
          Port Harcourt only
        </p>
        <p className="mt-1 max-w-[22ch] font-display text-[1.35rem] font-extrabold leading-tight text-white">
          Plant refill. Your cylinder. Your street.
        </p>
      </div>
    </div>
  );
}
