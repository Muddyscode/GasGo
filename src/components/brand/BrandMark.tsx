import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  href?: string;
  compact?: boolean;
  className?: string;
};

export function BrandMark({
  href = "/",
  compact = false,
  className,
}: BrandMarkProps) {
  return (
    <Link
      href={href}
      aria-label="GasGo home"
      className={cn(
        "inline-flex items-center gap-2 rounded-full pr-1.5",
        "transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="relative grid size-8 place-items-center overflow-hidden rounded-xl bg-brand-green text-white shadow-gasgo-soft"
      >
        <FlameMark />
      </span>
      {compact ? null : (
        <span className="text-[17px] font-semibold tracking-tight text-ink">
          GasGo
        </span>
      )}
    </Link>
  );
}

function FlameMark() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden="true">
      <path
        d="M10 2.2c.4 2.4-.7 3.8-1.8 5.1C7 8.6 6 9.8 6 12a4 4 0 0 0 8 0c0-1.7-.6-2.8-1.6-4.2-.8-1.1-1.7-2.3-1.6-4.4 0-.4-.2-.8-.8-1.2Z"
        fill="currentColor"
      />
      <path
        d="M10.1 10.2c.2 1-.3 1.6-.8 2.1-.4.5-.8 1-.8 1.8a2.3 2.3 0 0 0 4.5 0c0-.7-.3-1.2-.8-1.8-.4-.5-.8-1.1-.7-2.1 0-.2-.1-.4-.4-.5-.4.1-.8.7-1.4.5Z"
        fill="#FFDF22"
      />
    </svg>
  );
}
