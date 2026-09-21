import { brand, ink } from "@/config/tokens";
import { cn } from "@/lib/utils";

export const truckSizes = {
  sm: 132,
  md: 200,
  lg: 268,
} as const;

export type TruckSizeToken = keyof typeof truckSizes;
export type DeliveryTruckVariant = "loading" | "tracking";

export type DeliveryTruckProps = {
  size?: number | TruckSizeToken;
  /** Compact alias for `size="sm"` — keep as a motion hook for loading rows. */
  compact?: boolean;
  variant?: DeliveryTruckVariant;
  label?: string;
  showLabel?: boolean;
  className?: string;
};

export function resolveTruckSize(
  size: number | TruckSizeToken | undefined,
): number {
  if (typeof size === "number" && size > 0) return size;
  if (typeof size === "string" && size in truckSizes) {
    return truckSizes[size];
  }
  return truckSizes.md;
}

const VIEW_W = 360;
const VIEW_H = 150;

export function DeliveryTruck({
  size = "md",
  compact = false,
  variant = "loading",
  label,
  showLabel = Boolean(label),
  className,
}: DeliveryTruckProps) {
  const px = resolveTruckSize(compact ? "sm" : size);
  const height = Math.round((px * VIEW_H) / VIEW_W);
  const fadeFrom =
    variant === "tracking" ? "from-surface-soft" : "from-surface";

  return (
    <div
      className={cn(
        "gasgo-truck flex w-full flex-col items-center",
        `gasgo-truck--${variant}`,
        className,
      )}
      role={label ? "status" : undefined}
      aria-label={label && !showLabel ? label : undefined}
      aria-live={label ? "polite" : undefined}
      aria-hidden={label ? undefined : true}
    >
      <div
        className="gasgo-truck__viewport relative w-full overflow-hidden"
        style={{ height: height + 18 }}
      >
        <div className="gasgo-truck__ground" aria-hidden="true" />
        <div className="gasgo-truck__dashes" aria-hidden="true" />

        {variant === "loading" ? (
          <div className="gasgo-truck__lane">
            <TruckSegment width={px} height={height} />
            <TruckSegment width={px} height={height} />
          </div>
        ) : (
          <div className="gasgo-truck__idle">
            <TruckGraphic width={px} height={height} />
          </div>
        )}

        {variant === "loading" ? (
          <>
            <div
              className={cn(
                "pointer-events-none absolute inset-y-0 left-0 z-[2] w-16 bg-gradient-to-r to-transparent",
                fadeFrom,
              )}
              aria-hidden="true"
            />
            <div
              className={cn(
                "pointer-events-none absolute inset-y-0 right-0 z-[2] w-16 bg-gradient-to-l to-transparent",
                fadeFrom,
              )}
              aria-hidden="true"
            />
          </>
        ) : null}
      </div>

      {label && showLabel ? (
        <p className="mt-3 max-w-[28ch] text-center text-[15px] font-medium leading-snug tracking-tight text-ink-muted">
          {label}
        </p>
      ) : null}
    </div>
  );
}

function TruckSegment({ width, height }: { width: number; height: number }) {
  return (
    <div className="gasgo-truck__seg">
      <TruckGraphic width={width} height={height} />
    </div>
  );
}

function TruckGraphic({ width, height }: { width: number; height: number }) {
  const cab = "#178A46";
  const cabDeep = "#147A3E";
  const rim = "#F7FAF8";

  return (
    <svg
      className="gasgo-truck__svg"
      width={width}
      height={height}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse
        className="gasgo-truck__shadow"
        cx="188"
        cy="128"
        rx="108"
        ry="7"
        fill={ink}
        opacity="0.1"
      />

      <g className="gasgo-truck__body">
        <path
          d="M62 91h228c3 0 5 2 5 4.4v2c0 1.6-1.2 3-2.8 3.2H60c-1.6-.2-2.8-1.6-2.8-3.2v-2c0-2.4 2-4.4 4.8-4.4Z"
          fill={ink}
          opacity="0.12"
        />

        <rect x="46" y="38" width="186" height="54" rx="8" fill={brand.green} />
        <path d="M54 38h170c4.4 0 8 3.6 8 8v7H46v-7c0-4.4 3.6-8 8-8Z" fill="#2BB862" />
        <rect x="46" y="64" width="186" height="4" fill={brand.yellow} />
        <path
          d="M62 46v38"
          stroke={brand.white}
          strokeOpacity="0.28"
          strokeWidth="1.5"
        />
        <rect
          x="176"
          y="46"
          width="38"
          height="15"
          rx="3.5"
          fill={brand.white}
          fillOpacity="0.22"
        />

        <g transform="translate(88 47)">
          <rect x="5" y="8" width="18" height="26" rx="6" fill={brand.white} />
          <rect x="9" y="3" width="10" height="7" rx="2" fill={cab} />
          <rect x="12" y="0.5" width="4" height="3.5" rx="1" fill={ink} />
          <path d="M8 20h12" stroke={cab} strokeWidth="1.4" strokeLinecap="round" />
        </g>

        <rect x="48" y="72" width="6" height="10" rx="1.5" fill={brand.red} />

        <rect x="224" y="38" width="72" height="54" rx="6" fill={cab} />
        <path d="M288 38h10l16 22v32h-10c-4 0-7-3-8-7L288 38Z" fill={cabDeep} />
        <path d="M224 38v54" stroke={cabDeep} strokeWidth="2" />
        <rect
          x="242"
          y="44"
          width="38"
          height="22"
          rx="3"
          fill={brand.white}
          fillOpacity="0.34"
        />
        <path
          d="M246 47h18l8 14H246V47Z"
          fill={brand.white}
          fillOpacity="0.22"
        />

        <rect x="306" y="70" width="8" height="7" rx="1.5" fill={brand.yellow} />
        <path
          d="M286 36c0-4.6 2.4-7.4 6.4-7.4 1.8 0 3.2 1.1 3.2 2.6V46h-5c-2.6 0-4.6-2.2-4.6-5V36Z"
          fill={cabDeep}
        />

        <Wheel cx={98} cy={108} tire={ink} rim={rim} hub={brand.green} />
        <Wheel cx={268} cy={108} tire={ink} rim={rim} hub={brand.green} />
      </g>
    </svg>
  );
}

function Wheel({
  cx,
  cy,
  tire,
  rim,
  hub,
}: {
  cx: number;
  cy: number;
  tire: string;
  rim: string;
  hub: string;
}) {
  return (
    <g className="gasgo-truck__wheel">
      <circle cx={cx} cy={cy} r="17" fill={tire} />
      <circle cx={cx} cy={cy} r="9" fill={rim} />
      <circle cx={cx} cy={cy} r="3.4" fill={hub} />
      <path
        d={`M${cx} ${cy - 13.2}v5.2M${cx} ${cy + 8}v5.2M${cx - 13.2} ${cy}h5.2M${cx + 8} ${cy}h5.2`}
        stroke={tire}
        strokeWidth="1.4"
        strokeOpacity="0.28"
        strokeLinecap="round"
      />
    </g>
  );
}
