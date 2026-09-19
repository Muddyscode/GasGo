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
  variant = "loading",
  label,
  showLabel = Boolean(label),
  className,
}: DeliveryTruckProps) {
  const px = resolveTruckSize(size);
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
                "pointer-events-none absolute inset-y-0 left-0 z-[2] w-12 bg-gradient-to-r to-transparent",
                fadeFrom,
              )}
              aria-hidden="true"
            />
            <div
              className={cn(
                "pointer-events-none absolute inset-y-0 right-0 z-[2] w-12 bg-gradient-to-l to-transparent",
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
  const glass = ink;
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
          d="M54 90.5h250c2.4 0 4.2 1.8 4.2 4v2.2c0 1.6-1.2 3-2.8 3.2l-8.4 1H62l-9.6-1c-1.6-.2-2.8-1.6-2.8-3.2v-2.2c0-2.2 1.8-4 4.4-4Z"
          fill={ink}
          opacity="0.14"
        />

        <rect
          x="42"
          y="36"
          width="198"
          height="58"
          rx="11"
          fill={brand.green}
        />
        <path
          d="M53 36h176c6 0 11 5 11 11v8H42v-8c0-6 5-11 11-11Z"
          fill="#2BB862"
        />
        <rect x="42" y="63" width="198" height="4.5" fill={brand.yellow} />
        <path
          d="M58 44v42"
          stroke={brand.white}
          strokeOpacity="0.22"
          strokeWidth="1.6"
        />
        <rect
          x="184"
          y="44"
          width="36"
          height="16"
          rx="4"
          fill={brand.white}
          fillOpacity="0.18"
        />

        <g transform="translate(86 46)">
          <rect
            x="6"
            y="6"
            width="16"
            height="24"
            rx="5"
            fill={brand.white}
            fillOpacity="0.92"
          />
          <rect x="10" y="2" width="8" height="6" rx="2" fill={cab} />
          <rect x="12.5" y="0" width="3" height="3" rx="1" fill={ink} />
        </g>

        <rect x="44" y="70" width="5" height="9" rx="1.5" fill={brand.red} />

        <path
          d="M230 90.5V42c0-4 3.2-7.2 7.2-7.2h34c22 0 42 16.2 46 35.4l1.2 6.2c.8 4-2.2 7.6-6.4 7.6H230Z"
          fill={cab}
        />
        <path
          d="M248 40.5h20c16.5 0 29.5 11 33 24.5H248V40.5Z"
          fill={glass}
          fillOpacity="0.42"
        />
        <path
          d="M252 43.5h12c8 0 14 4.4 18 11H252v-11Z"
          fill={brand.white}
          fillOpacity="0.16"
        />
        <path d="M230 40.5v50" stroke={cabDeep} strokeWidth="2" />

        <ellipse cx="310" cy="74" rx="5.2" ry="4.2" fill={brand.yellow} />
        <ellipse
          cx="308.6"
          cy="73"
          rx="1.6"
          ry="1.3"
          fill={brand.white}
          fillOpacity="0.7"
        />

        <path
          d="M300 38.5c0-4.6 2.4-7.5 6.2-7.5 1.8 0 3.2 1 3.2 2.6v10.2h-4.6c-2.8 0-4.8-2.2-4.8-5.3Z"
          fill={cabDeep}
        />

        <Wheel cx={96} cy={108} tire={ink} rim={rim} hub={brand.green} />
        <Wheel cx={276} cy={108} tire={ink} rim={rim} hub={brand.green} />
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
