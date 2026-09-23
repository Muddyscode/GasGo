import Link from "next/link";
import { PH_ZONES, ZONE_FEE_MAX_NGN, ZONE_FEE_MIN_NGN } from "@/config/pricing";
import { brand, ink } from "@/config/tokens";
import { ZONE_PIN_LAYOUT } from "@/lib/ph-zone-pins";
import { formatNaira } from "@/lib/money";
import { buttonClassName } from "@/components/ui/button";

const TONE: Record<"green" | "yellow" | "ink", { fill: string; text: string; label: string }> = {
  green: { fill: brand.green, text: brand.white, label: "West corridors" },
  yellow: { fill: brand.yellow, text: ink, label: "Mid-city" },
  ink: { fill: ink, text: brand.white, label: "East / river" },
};

export function ZoneMap({ flush = false }: { flush?: boolean }) {
  return (
    <section id="zones" className={flush ? "scroll-mt-6" : "mt-16 scroll-mt-6 lg:mt-20"}>
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
        <div className="relative min-h-[18rem] overflow-hidden bg-surface-muted ring-1 ring-border lg:col-span-6">
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

      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-ink-muted" aria-label="Map legend">
        {(Object.keys(TONE) as Array<keyof typeof TONE>).map((key) => (
          <li key={key} className="inline-flex items-center gap-2">
            <span
              className="size-2.5 rounded-sm"
              style={{ backgroundColor: TONE[key].fill }}
              aria-hidden="true"
            />
            {TONE[key].label}
          </li>
        ))}
      </ul>

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
      <defs>
        <pattern id="zone-grid" width="5" height="5" patternUnits="userSpaceOnUse">
          <path
            d="M 5 0 L 0 0 0 5"
            fill="none"
            stroke={ink}
            strokeOpacity="0.06"
            strokeWidth="0.18"
          />
        </pattern>
      </defs>
      <rect width="100" height="76" fill="#FAF8F3" />
      <rect width="100" height="76" fill="url(#zone-grid)" />
      <path
        d="M10 18C18 12 28 14 36 12C48 9 54 16 66 14C78 12 86 18 94 22V68C86 62 74 66 62 64C50 62 42 56 30 60C20 63 12 58 6 62V28C6 24 8 20 10 18Z"
        fill="#E8F5EE"
        stroke={brand.green}
        strokeWidth="0.45"
      />
      <path
        d="M14 22C22 16 32 18 40 16C52 13 58 20 70 18C80 16 88 21 94 24"
        fill="none"
        stroke={brand.green}
        strokeOpacity="0.18"
        strokeWidth="0.35"
      />
      <path
        d="M22 30C30 26 40 34 50 30C60 26 70 32 80 28"
        stroke="#C9D4CC"
        strokeWidth="0.55"
        fill="none"
      />
      <path
        d="M18 48C28 42 38 50 48 46C60 41 70 50 84 44"
        stroke="#C9D4CC"
        strokeWidth="0.5"
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
        const labelWidth = Math.max(17, mapLabel.length * 1.55 + 5.4);
        return (
          <g key={zone.id}>
            <rect
              x={pin.x - 2}
              y={pin.y - 5.5}
              width={labelWidth}
              height="6.1"
              rx="0.9"
              fill={tone.fill}
            />
            <text
              x={pin.x + 1}
              y={pin.y - 1.45}
              fill={tone.text}
              fontSize="2.7"
              fontWeight="500"
              letterSpacing="-0.03"
              fontFamily='var(--font-display), "Inter Tight", Inter, ui-sans-serif, sans-serif'
            >
              {mapLabel}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
