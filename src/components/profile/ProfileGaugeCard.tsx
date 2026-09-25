import Link from "next/link";
import { GasGauge, daysSince } from "@/components/gauge";
import { buttonClassName } from "@/components/ui/button";
import { cardClassName } from "@/components/ui/card";
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
    <section className={`${cardClassName} px-4 py-4`}>
      <div className="flex items-center gap-4">
        <GasGauge
          percent={gauge.percent}
          size="sm"
          className="w-auto max-w-none shrink-0 gap-0"
        />

        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-ink">
            Gas gauge
          </p>
          <p className="text-[12px] text-ink-muted">Secondary — estimate only</p>
          <p className="mt-1 text-[15px] leading-snug text-ink-muted">{updated}</p>
          <Link
            href="/"
            className={buttonClassName({ variant: "primary", size: "sm" }, "mt-3")}
          >
            Update my gauge
          </Link>
        </div>
      </div>
    </section>
  );
}
