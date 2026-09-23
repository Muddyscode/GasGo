import Link from "next/link";
import { PH_ZONES, ZONE_FEE_MAX_NGN, ZONE_FEE_MIN_NGN } from "@/config/pricing";
import { brand, ink } from "@/config/tokens";
import { ZONE_PIN_LAYOUT } from "@/lib/ph-zone-pins";
import { formatNaira } from "@/lib/money";
import { buttonClassName } from "@/components/ui/button";

const TONE: Record<"green" | "yellow" | "ink", { fill: string; text: string }> = {
  green: { fill: brand.green, text: brand.white },
  yellow: { fill: brand.yellow, text: ink },
  ink: { fill: ink, text: brand.white },
};

export function ZoneMap({ flush = false }: { flush?: boolean }) {
  return (
    <section id="zones" className={flush ? "scroll-mt-24" : "mt-16 scroll-mt-24 lg:mt-20"}>
      <p className="text-[15px] font-medium text-brand-green">Coverage</p>
      <h2 className="mt-2 font-display text-[28px] font-semibold tracking-tight text-ink md:text-[34px]">
        Port Harcourt zones we ride
      </h2>
      <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-ink-muted">
        Pickup empty, plant refill, return full. Zone fees stay between{" "}
        {formatNaira(ZONE_FEE_MIN_NGN)} and {formatNaira(ZONE_FEE_MAX_NGN)}. Hub
        self-collect is gas only.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="relative min-h-[18rem] bg-surface-muted lg:col-span-6">
          <ArtisticMap />
        </div>
        <div className="lg:col-span-6">
          <table className="w-full text-left text-[15px]">
            <caption className="sr-only">Port Harcourt pickup and return fees by zone</caption>
            <thead>
              <tr className="border-b border-border text-ink-muted">
                <th scope="col" className="py-2 pr-4 font-medium">
                  Zone
                </th>
                <th scope="col" className="py-2 text-right font-medium">
                  Pickup and return
                </th>
              </tr>
            </thead>
            <tbody>
              {PH_ZONES.map((zone) => (
                <tr key={zone.id} className="border-b border-border">
                  <th scope="row" className="py-3 pr-4 font-medium text-ink">
                    {zone.name}
                  </th>
                  <td className="py-3 text-right tabular-nums text-ink">
                    {formatNaira(zone.feeNgn)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/order/cylinder" className={buttonClassName({ variant: "primary", size: "md" }, "w-auto px-6")}>
          Start a refill
        </Link>
      </div>
    </section>
  );
}

function ArtisticMap() {
  return (
    <svg viewBox="0 0 100 76" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <rect width="100" height="76" fill="#FAF8F3" />
      <path
        d="M10 18C18 12 28 14 36 12C48 9 54 16 66 14C78 12 86 18 94 22V68C86 62 74 66 62 64C50 62 42 56 30 60C20 63 12 58 6 62V28C6 24 8 20 10 18Z"
        fill="#E6F4EC"
        stroke={brand.green}
        strokeWidth="0.6"
      />
      <path
        d="M22 30C30 26 40 34 50 30C60 26 70 32 80 28"
        stroke="#E7E2D6"
        strokeWidth="1.4"
        fill="none"
      />
      <path
        d="M18 48C28 42 38 50 48 46C60 41 70 50 84 44"
        stroke="#E7E2D6"
        strokeWidth="1.2"
        fill="none"
      />
      {PH_ZONES.map((zone) => {
        const pin = ZONE_PIN_LAYOUT[zone.id] ?? {
          x: 50,
          y: 40,
          tone: "green" as const,
          label: zone.name,
        };
        const tone = TONE[pin.tone];
        const mapLabel = pin.label;
        const labelWidth = Math.max(18, mapLabel.length * 1.7 + 6);
        return (
          <g key={zone.id}>
            <rect
              x={pin.x - 2}
              y={pin.y - 5.8}
              width={labelWidth}
              height="6.6"
              rx="1"
              fill={tone.fill}
            />
            <text
              x={pin.x + 1.2}
              y={pin.y - 1.4}
              fill={tone.text}
              fontSize="3"
              fontWeight="600"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
            >
              {mapLabel}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
