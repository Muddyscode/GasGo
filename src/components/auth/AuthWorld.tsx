import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Calm light-first auth panel. Still plant photo and PH Tower landmark.
 */
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
      <div className="hero-wash absolute inset-0" aria-hidden="true" />
      <Image
        src="/images/cooking-gas-filling-point.png"
        alt=""
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        priority={!compact}
        className={cn(
          "object-cover object-[center_30%]",
          compact ? "opacity-45" : "opacity-55",
        )}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-surface/25"
      />
      {compact ? null : (
        <div className="absolute right-6 top-8 hidden overflow-hidden rounded-2xl border border-border bg-surface shadow-gasgo-md lg:block">
          <Image
            src="/brand/ph-tower.webp"
            alt=""
            width={132}
            height={176}
            className="h-44 w-[8.25rem] object-cover"
          />
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 px-5 pb-6 pt-16 lg:px-8 lg:pb-10">
        <p className="text-[13px] font-medium text-brand-green">Port Harcourt only</p>
        <p className="mt-1 max-w-[22ch] font-display text-[1.35rem] font-semibold leading-tight text-ink">
          Plant refill. Your cylinder. Your street.
        </p>
      </div>
    </div>
  );
}
