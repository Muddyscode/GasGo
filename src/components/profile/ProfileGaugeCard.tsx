import { GasGauge, daysSince } from "@/components/gauge";
import { PressableLink } from "@/components/ui/Pressable";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
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
    <SurfaceCard>
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
          <PressableLink href="/" size="md" className="mt-3 rounded-full text-sm">
            Update my gauge
          </PressableLink>
        </div>
      </div>
    </SurfaceCard>
  );
}
