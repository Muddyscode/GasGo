import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type OrderHeaderProps = {
  title: string;
  backHref: string;
  backLabel: string;
};

export function OrderHeader({ title, backHref, backLabel }: OrderHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-surface/90 backdrop-blur-md">
      <div className="relative flex h-14 items-center justify-center px-2">
        <Link
          href={backHref}
          aria-label={backLabel}
          className="absolute left-2 inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors duration-150 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
        >
          <ChevronLeft className="size-6" strokeWidth={2} />
        </Link>
        <h1 className="text-[15px] font-semibold tracking-tight text-ink">
          {title}
        </h1>
      </div>
    </header>
  );
}
