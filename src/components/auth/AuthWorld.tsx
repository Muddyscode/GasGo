import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Calm light-first auth panel. Plant tank photo is the full background.
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
      <Image
        src="/images/cooking-gas-filling-point.png"
        alt=""
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        priority
        className="object-cover object-[center_30%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 px-5 pb-6 pt-16 lg:px-8 lg:pb-10">
        <p className="text-[13px] font-medium text-brand-yellow">Port Harcourt only</p>
        <p className="mt-1 max-w-[22ch] font-display text-[1.35rem] font-semibold leading-tight text-white">
          Plant refill. Your cylinder. Your street.
        </p>
      </div>
    </div>
  );
}
