import Link from "next/link";
import { PH_ZONES } from "@/config/pricing";
import { ZONE_PIN_LAYOUT } from "@/lib/ph-zone-pins";
import { formatNaira } from "@/lib/money";
import { cn } from "@/lib/utils";
import { buttonClassName } from "@/components/ui/button";
import { cardClassName } from "@/components/ui/card";
import { FadeLift } from "@/components/motion/FadeLift";

const TONE: Record<"green" | "yellow" | "ink", { fill: string; text: string }> = {
  green: { fill: "#1CA350", text: "#FFFFFF" },
  yellow: { fill: "#FFDF22", text: "#0B1F14" },
  ink: { fill: "#0B1F14", text: "#FFFFFF" },
};

export function ZoneMap({ flush = false }: { flush?: boolean }) {
  return (
    <section id="zones" className={flush ? "scroll-mt-24" : "mt-16 scroll-mt-24 lg:mt-20"}>
      <FadeLift>
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-green">
          Garden City coverage
        </p>
        <h2 className="mt-2 font-display text-[28px] font-extrabold tracking-tight text-ink md:text-[34px]">
          We ride Port Harcourt. Not the whole map of Nigeria.
        </h2>
        <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-ink-muted">
          Pickup empty, plant refill, return full — Old GRA to Trans-Amadi and the
          corridors in between.
        </p>
      </FadeLift>

      <div
        className={cn(
          cardClassName,
          "mt-6 overflow-hidden p-0 shadow-gasgo-lg lg:grid lg:grid-cols-12",
        )}
      >
        <div className="relative min-h-[22rem] bg-[#F4EFC4] lg:col-span-7">
          <ArtisticMap />
        </div>
        <div className="border-t border-border bg-surface lg:col-span-5 lg:border-l lg:border-t-0">
          <div className="flex items-center justify-between border-b border-border bg-[#E3F5EA] px-4 py-3">
            <p className="text-[15px] font-semibold tracking-tight text-ink">Zones we refill</p>
            <span className="text-xs font-semibold text-ink-muted">{PH_ZONES.length} areas</span>
          </div>
          <ul className="max-h-[22rem] divide-y divide-border overflow-y-auto">
            {PH_ZONES.map((zone) => (
              <li key={zone.id}>
                <Link
                  href="/order/cylinder"
                  className="flex items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-surface-soft"
                >
                  <span>
                    <span className="block text-[15px] font-semibold text-ink">{zone.name}</span>
                    <span className="text-sm text-ink-muted">
                      Pickup & return · {formatNaira(zone.feeNgn)}
                    </span>
                  </span>
                  <span className="grid size-9 place-items-center rounded-full border border-brand-green/20 text-brand-green">
                    <CylIcon />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Link href="/order/cylinder" className={buttonClassName({ variant: "primary", size: "md" }, "w-auto px-6")}>
          Order a refill
        </Link>
      </div>
    </section>
  );
}

function ArtisticMap() {
  return (
    <svg viewBox="0 0 100 76" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <rect width="100" height="76" fill="#F4EFC4" />
      <path d="M0 18C12 16 18 24 28 22C40 19 46 8 58 10C70 12 78 20 100 16V0H0V18Z" fill="#E4F0C8" />
      <path d="M0 76C20 60 32 70 48 62C64 54 72 66 88 58C94 55 98 60 100 56V76H0Z" fill="#D7E8B8" />
      <path
        d="M8 40C22 28 30 46 44 38C58 30 62 50 78 44C86 41 92 48 98 42"
        stroke="#E2D48A"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M12 58C24 48 36 64 50 52C64 40 70 60 86 50"
        stroke="#E8DCA0"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M4 28C18 36 26 20 40 26C54 32 66 18 84 24"
        stroke="#EDD978"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="72" cy="58" r="10" fill="#7DB8A4" opacity="0.35" />
      {PH_ZONES.map((zone) => {
        const pin = ZONE_PIN_LAYOUT[zone.id] ?? { x: 50, y: 40, tone: "green" as const };
        const tone = TONE[pin.tone];
        const labelWidth = Math.max(22, zone.name.length * 1.7 + 8);
        return (
          <g key={zone.id} className="zone-pin">
            <ellipse cx={pin.x} cy={pin.y + 3.2} rx="2.2" ry="0.8" fill="#0B1F14" opacity="0.18" />
            <rect
              x={pin.x - 2.2}
              y={pin.y - 6.4}
              width={labelWidth}
              height="7.2"
              rx="3.6"
              fill={tone.fill}
            />
            <circle cx={pin.x} cy={pin.y - 2.8} r="1.15" fill={tone.text} />
            <text
              x={pin.x + 2.2}
              y={pin.y - 2.3}
              fill={tone.text}
              fontSize="3.1"
              fontWeight="700"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {zone.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function CylIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden="true">
      <rect x="8" y="2.2" width="4" height="3" rx="0.8" fill="currentColor" />
      <rect x="5.5" y="5" width="9" height="12.5" rx="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
