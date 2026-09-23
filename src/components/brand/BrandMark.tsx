import Link from "next/link";
import { GasGoMark } from "@/components/brand/GasGoMark";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  href?: string;
  compact?: boolean;
  /** Green chip + white wordmark — dark bands only. */
  inverted?: boolean;
  className?: string;
};

export function BrandMark({
  href = "/",
  compact = false,
  inverted = false,
  className,
}: BrandMarkProps) {
  return (
    <Link
      href={href}
      aria-label="GasGo home"
      className={cn(
        "inline-flex items-center gap-2",
        inverted ? "rounded-full py-1 pl-1 pr-2.5 text-white" : "pr-1",
        "transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative grid place-items-center",
          inverted
            ? "size-8 rounded-lg bg-white/12 text-white"
            : "size-8 rounded-lg bg-brand-green text-white",
        )}
      >
        <GasGoMark className="size-[18px]" />
      </span>
      {compact ? null : (
        <span
          className={cn(
            "font-display text-[18px] font-semibold tracking-tight",
            inverted ? "text-white" : "text-ink",
          )}
        >
          GasGo
        </span>
      )}
    </Link>
  );
}
