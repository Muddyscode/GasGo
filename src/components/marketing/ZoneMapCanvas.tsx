import type { ReactNode } from "react";
import { PH_ZONES } from "@/config/pricing";
import { brand, ink } from "@/config/tokens";
import { ZONE_PIN_LAYOUT } from "@/lib/ph-zone-pins";

export const ZONE_TONE: Record<
  "green" | "yellow" | "ink",
  { fill: string; text: string; label: string }
> = {
  green: { fill: brand.green, text: brand.white, label: "West corridors" },
  yellow: { fill: brand.yellow, text: ink, label: "Mid-city" },
  ink: { fill: ink, text: brand.white, label: "East / river" },
};

/**
 * The delivery route the live tracking truck follows: GasGo plant in the
 * south-west, curving north-east to the customer. Shared so coverage and
 * tracking draw the same road, not two different ones.
 */
export const ZONE_ROUTE_D =
  "M12 65 C 26 60 30 47 42 41 S 66 33 81 21";
export const ZONE_ROUTE_START = { x: 12, y: 65 } as const;
export const ZONE_ROUTE_END = { x: 81, y: 21 } as const;

type ZoneMapCanvasProps = {
  /** Full zone name plates (coverage) vs. quiet dots (live tracking). */
  labelled?: boolean;
  children?: ReactNode;
};

/**
 * Simplified Port Harcourt map: landmass, corridor lines, and the eight zones.
 * The coverage section and the live-tracking screen both build on this one
 * canvas — overlays (a highlighted route, a moving truck) come in via children.
 */
export function ZoneMapCanvas({ labelled = true, children }: ZoneMapCanvasProps) {
  return (
    <svg viewBox="0 0 100 76" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <pattern id="zone-grid" width="5" height="5" patternUnits="userSpaceOnUse">
          <path d="M 5 0 L 0 0 0 5" fill="none" stroke={ink} strokeOpacity="0.06" strokeWidth="0.18" />
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
      <path d="M22 30C30 26 40 34 50 30C60 26 70 32 80 28" stroke="#C9D4CC" strokeWidth="0.55" fill="none" />
      <path d="M18 48C28 42 38 50 48 46C60 41 70 50 84 44" stroke="#C9D4CC" strokeWidth="0.5" fill="none" />

      {PH_ZONES.map((zone) => {
        const pin = ZONE_PIN_LAYOUT[zone.id] ?? {
          x: 50,
          y: 40,
          tone: "green" as const,
          label: zone.name,
        };
        const tone = ZONE_TONE[pin.tone];

        if (!labelled) {
          return (
            <circle
              key={zone.id}
              cx={pin.x + 1}
              cy={pin.y - 3}
              r="0.9"
              fill={tone.fill}
              opacity="0.5"
            />
          );
        }

        const labelWidth = Math.max(17, pin.label.length * 1.55 + 5.4);
        return (
          <g key={zone.id}>
            <rect x={pin.x - 2} y={pin.y - 5.5} width={labelWidth} height="6.1" rx="0.9" fill={tone.fill} />
            <text
              x={pin.x + 1}
              y={pin.y - 1.45}
              fill={tone.text}
              fontSize="2.7"
              fontWeight="500"
              letterSpacing="-0.03"
              fontFamily='var(--font-display), "Inter Tight", Inter, ui-sans-serif, sans-serif'
            >
              {pin.label}
            </text>
          </g>
        );
      })}

      {children}
    </svg>
  );
}
