import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  href?: string;
  compact?: boolean;
  className?: string;
};

export function BrandMark({ href = "/", compact = false, className }: BrandMarkProps) {
  const mark = (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden="true"
        className="grid size-8 place-items-center rounded-[10px] bg-brand-green text-white shadow-gasgo-soft"
      >
        <FlameIcon />
      </span>
      {compact ? (
        <span className="sr-only">GasGo</span>
      ) : (
        <span className="text-[17px] font-semibold tracking-tight text-ink">GasGo</span>
      )}
    </span>
  );

  if (!href) return mark;

  return (
    <Link
      href={href}
      className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2"
    >
      {mark}
    </Link>
  );
}

function FlameIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.4s3.4 3.2 3.4 6.4A3.4 3.4 0 0 1 8 11.2 3.4 3.4 0 0 1 4.6 7.8C4.6 5.4 8 1.4 8 1.4Z"
        fill="currentColor"
        opacity="0.35"
      />
      <path
        d="M8 2.2c0 3.2-2.2 3.8-2.2 6.1a2.2 2.2 0 1 0 4.4 0c0-1.6-1.1-2.7-1.1-4.4.9 1 1.8 2.5 1.8 4.4A3.1 3.1 0 1 1 4.8 8.3C4.8 5.8 8 2.2 8 2.2Z"
        fill="currentColor"
      />
    </svg>
  );
}
