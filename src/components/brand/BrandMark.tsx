import Link from "next/link";
import { GasGoMark } from "@/components/brand/GasGoMark";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  href?: string;
  compact?: boolean;
  /** Green capsule + white wordmark — marketing island nav. */
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
        inverted
          ? "rounded-full bg-brand-green py-1.5 pl-1.5 pr-3.5 text-white shadow-gasgo-md"
          : "rounded-full pr-1.5",
        "transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative grid place-items-center overflow-hidden shadow-gasgo-soft",
          inverted
            ? "size-8 rounded-xl bg-white/15 text-white"
            : "size-8 rounded-xl bg-brand-green text-white",
        )}
      >
        <GasGoMark className="size-[18px]" />
      </span>
      {compact ? null : (
        <span
          className={cn(
            "text-[17px] font-semibold tracking-tight",
            inverted ? "text-white" : "text-ink",
          )}
        >
          GasGo
        </span>
      )}
    </Link>
  );
}
