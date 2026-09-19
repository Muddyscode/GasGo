import Link from "next/link";
import { GasGauge, daysSince } from "@/components/gauge";
import type { GaugeReading } from "@/data/profile";

type ProfileGaugeCardProps = {
  gauge: GaugeReading;
};

export function ProfileGaugeCard({ gauge }: ProfileGaugeCardProps) {
  const ago = daysSince(gauge.lastUpdatedAt);
  const updated =
    ago === 0
      ? "Updated today"
      : ago === 1
        ? "Updated 1 day ago"
        : `Updated ${ago} days ago`;

  return (
    <section className="rounded-2xl border border-border bg-surface px-4 py-4 shadow-gasgo-soft">
      <div className="flex items-center gap-4">
        <GasGauge
          percent={gauge.percent}
          size="sm"
          className="w-auto max-w-none shrink-0 gap-0"
        />

        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-green">
            Gas gauge
          </p>
          <p className="mt-1 text-[15px] leading-snug text-ink-muted">{updated}</p>
          <Link
            href="/"
            className="mt-3 inline-flex min-h-11 items-center justify-center rounded-full bg-brand-green px-4 text-sm font-semibold text-white shadow-gasgo-soft transition-[transform,filter] duration-150 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            Update my gauge
          </Link>
        </div>
      </div>
    </section>
  );
}
