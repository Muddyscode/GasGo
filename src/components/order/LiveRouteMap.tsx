"use client";

import { brand, ink } from "@/config/tokens";
import {
  ZoneMapCanvas,
  ZONE_ROUTE_D,
  ZONE_ROUTE_END,
  ZONE_ROUTE_START,
} from "@/components/marketing/ZoneMapCanvas";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

type LiveRouteMapProps = {
  /** Accessible summary of where the cylinder is on the loop. */
  label: string;
  /** Late loop: dim the destination so the truck reads as held up, not arriving. */
  late?: boolean;
};

/**
 * Signature live-tracking map. Same Port Harcourt canvas as the coverage
 * section, now with a highlighted plant→customer route and a green line-art
 * truck gliding along it. Used on the tracking screen only.
 */
export function LiveRouteMap({ label, late = false }: LiveRouteMapProps) {
  const reduced = usePrefersReducedMotion();
  const destinationTone = late ? brand.red : brand.green;

  return (
    <div className="gasgo-liveroute relative aspect-[100/76] w-full" role="img" aria-label={label}>
      <ZoneMapCanvas labelled={false}>
        <path
          id="gasgo-live-route"
          d={ZONE_ROUTE_D}
          fill="none"
          stroke={brand.green}
          strokeOpacity="0.28"
          strokeWidth="0.8"
          strokeDasharray="2.4 2.4"
          strokeLinecap="round"
        />

        {/* Plant origin */}
        <circle cx={ZONE_ROUTE_START.x} cy={ZONE_ROUTE_START.y} r="1.5" fill={brand.green} />
        <circle cx={ZONE_ROUTE_START.x} cy={ZONE_ROUTE_START.y} r="0.7" fill={brand.white} />

        {/* Customer destination */}
        <circle
          className="gasgo-liveroute__ping"
          cx={ZONE_ROUTE_END.x}
          cy={ZONE_ROUTE_END.y}
          r="2.4"
          fill={destinationTone}
          opacity="0.28"
        />
        <path
          d={`M${ZONE_ROUTE_END.x} ${ZONE_ROUTE_END.y - 4.4} c 2.4 0 4 1.8 4 4 0 2.6 -4 5.4 -4 5.4 s -4 -2.8 -4 -5.4 c 0 -2.2 1.6 -4 4 -4 z`}
          fill={destinationTone}
        />
        <circle cx={ZONE_ROUTE_END.x} cy={ZONE_ROUTE_END.y - 0.4} r="1.35" fill={brand.white} />

        <RouteTruck reduced={reduced} late={late} />
      </ZoneMapCanvas>
    </div>
  );
}

function RouteTruck({ reduced, late }: { reduced: boolean; late: boolean }) {
  const body = brand.green;
  const load = late ? brand.red : brand.yellow;

  const truck = (
    <>
      <ellipse cx="0" cy="2.9" rx="6.4" ry="0.9" fill={ink} opacity="0.12" />
      <g className="gasgo-liveroute__load">
        <rect x="-5.1" y="-3.5" width="1.7" height="2.4" rx="0.6" fill={load} />
        <rect x="-3.1" y="-3.5" width="1.7" height="2.4" rx="0.6" fill={load} />
      </g>
      <rect x="-6" y="-1.5" width="8.1" height="3.6" rx="0.9" fill={brand.white} stroke={body} strokeWidth="0.5" />
      <rect x="-5.4" y="-1" width="7" height="0.7" rx="0.35" fill={body} opacity="0.16" />
      <path
        d="M2.1 -1.5 h2.5 a0.8 0.8 0 0 1 0.66 0.36 l1.14 1.74 v1.06 h-4.4 z"
        fill={brand.white}
        stroke={body}
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <rect x="2.7" y="-0.9" width="2" height="1.4" rx="0.3" fill={body} opacity="0.22" />
      <circle cx="-3.4" cy="2.3" r="1.1" fill={ink} />
      <circle cx="-3.4" cy="2.3" r="0.44" fill={brand.white} />
      <circle cx="3.2" cy="2.3" r="1.1" fill={ink} />
      <circle cx="3.2" cy="2.3" r="0.44" fill={brand.white} />
    </>
  );

  if (reduced) {
    return (
      <g className="gasgo-liveroute__truck" transform="translate(46 39)">
        {truck}
      </g>
    );
  }

  return (
    <g className="gasgo-liveroute__truck">
      <animateMotion dur="16s" repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
        <mpath href="#gasgo-live-route" />
      </animateMotion>
      <animate
        attributeName="opacity"
        dur="16s"
        repeatCount="indefinite"
        keyTimes="0;0.06;0.9;1"
        values="0;1;1;0"
        calcMode="linear"
      />
      {truck}
    </g>
  );
}
