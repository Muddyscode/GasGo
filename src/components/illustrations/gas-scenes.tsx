import { brand, ink } from "@/config/tokens";
import { cn } from "@/lib/utils";

/** Tiny LPG cylinder — order rows, CTAs, navbar-adjacent delight. */
export function CylinderGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={cn("size-4", className)}
      fill="none"
      aria-hidden="true"
    >
      <rect x="8" y="1.6" width="4" height="3.2" rx="0.8" fill={ink} />
      <rect
        x="5.2"
        y="4.6"
        width="9.6"
        height="13.4"
        rx="4.6"
        fill={brand.white}
        stroke={ink}
        strokeWidth="1.4"
      />
      <path
        d="M7.6 11h4.8"
        stroke={brand.green}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Sealed plant valve — auto-refill teaser only. */
export function SealedValveGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("size-10", className)}
      fill="none"
      aria-hidden="true"
    >
      <rect x="16" y="4" width="8" height="7" rx="1.5" fill={ink} />
      <rect
        x="10"
        y="10"
        width="20"
        height="26"
        rx="9"
        fill={brand.white}
        stroke={ink}
        strokeWidth="1.6"
      />
      <circle cx="20" cy="22" r="5" stroke={brand.green} strokeWidth="1.8" />
      <path
        d="M20 19.2v5.6"
        stroke={brand.yellow}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Three motion dashes — same beat as the brand mark. */
export function MotionDashesGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 16"
      className={cn("h-3.5 w-6", className)}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 3.2h9.5M1.5 8h12.5M2.4 12.8h8.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M1.5 8h12.5"
        stroke={brand.yellow}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Plant tank — refill happens offsite, never on the street. */
export function PlantTankGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      className={cn("size-7", className)}
      fill="none"
      aria-hidden="true"
    >
      <rect x="4" y="14" width="20" height="11" rx="2" fill={brand.green} />
      <rect x="4" y="14" width="20" height="3" fill={ink} fillOpacity="0.22" />
      <rect x="4" y="22" width="20" height="2" fill={brand.yellow} />
      <rect
        x="8.5"
        y="4"
        width="11"
        height="12"
        rx="5.5"
        fill={brand.white}
        stroke={ink}
        strokeWidth="1.4"
      />
      <rect x="12.2" y="1.6" width="3.6" height="3.6" rx="0.8" fill={ink} />
    </svg>
  );
}

/** Garden City keke — PH streets, never Lagos. */
export function KekeGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 22"
      className={cn("h-5 w-8", className)}
      fill="none"
      aria-hidden="true"
    >
      <rect x="10" y="3" width="18" height="10" rx="3" fill={brand.yellow} />
      <rect x="2" y="7" width="10" height="7" rx="2.5" fill={brand.green} />
      <rect
        x="4.2"
        y="8.6"
        width="5.4"
        height="3.4"
        rx="0.8"
        fill={brand.white}
        fillOpacity="0.45"
      />
      <circle cx="8" cy="17.2" r="3.2" fill={ink} />
      <circle cx="8" cy="17.2" r="1.2" fill={brand.yellow} />
      <circle cx="18.5" cy="17.2" r="3.2" fill={ink} />
      <circle cx="18.5" cy="17.2" r="1.2" fill={brand.yellow} />
      <circle cx="27.5" cy="17.2" r="3.2" fill={ink} />
      <circle cx="27.5" cy="17.2" r="1.2" fill={brand.yellow} />
    </svg>
  );
}

/** Port Harcourt pin — addresses, not a Google Maps pin clone. */
export function PhPinGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-5", className)}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 21s6.2-5.6 6.2-10.2A6.2 6.2 0 0 0 5.8 10.8C5.8 15.4 12 21 12 21Z"
        fill={brand.green}
      />
      <circle cx="12" cy="10.6" r="2.2" fill={brand.yellow} />
    </svg>
  );
}

/** Collect beat: GRA house + empty cylinder + GasGo van. */
export function CollectScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 160"
      className={cn("h-full w-full", className)}
      fill="none"
      aria-hidden="true"
    >
      <rect width="360" height="160" fill="currentColor" />
      <path d="M0 118h360v42H0Z" fill="#C8DC9E" />
      <rect x="18" y="56" width="96" height="62" rx="4" fill="#F4EFE3" />
      <path d="M12 60L66 24L120 60H12Z" fill={ink} />
      <rect x="74" y="78" width="22" height="40" rx="2" fill={brand.green} />
      <rect x="28" y="74" width="30" height="20" rx="2" fill={brand.white} fillOpacity="0.55" />
      <g transform="translate(148 64)">
        <rect x="0" y="18" width="118" height="38" rx="7" fill={brand.green} />
        <rect x="0" y="32" width="118" height="4" fill={brand.yellow} />
        <rect x="114" y="22" width="40" height="34" rx="5" fill={ink} />
        <rect x="122" y="26" width="22" height="14" rx="2" fill={brand.white} fillOpacity="0.35" />
        <circle cx="30" cy="60" r="10" fill={ink} />
        <circle cx="30" cy="60" r="4" fill={brand.yellow} />
        <circle cx="132" cy="60" r="10" fill={ink} />
        <circle cx="132" cy="60" r="4" fill={brand.yellow} />
        <rect x="16" y="8" width="16" height="22" rx="6" fill={brand.white} />
      </g>
      <g transform="translate(128 92)">
        <rect x="5" y="0" width="6" height="6" rx="1" fill={ink} />
        <rect
          x="0"
          y="6"
          width="16"
          height="26"
          rx="7"
          fill={brand.white}
          stroke={ink}
        />
      </g>
    </svg>
  );
}

/** Return beat: plant tanks + van bringing a filled cylinder home. */
export function ReturnScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 160"
      className={cn("h-full w-full", className)}
      fill="none"
      aria-hidden="true"
    >
      <rect width="360" height="160" fill="currentColor" />
      <rect x="16" y="72" width="92" height="52" rx="6" fill={brand.green} />
      <rect x="16" y="72" width="92" height="10" fill={ink} fillOpacity="0.25" />
      <rect x="16" y="112" width="92" height="5" fill={brand.yellow} />
      <g transform="translate(28 36)">
        <rect x="10" y="0" width="10" height="12" rx="2" fill={ink} />
        <rect
          x="0"
          y="10"
          width="30"
          height="40"
          rx="14"
          fill={brand.white}
          stroke={ink}
          strokeWidth="1.6"
        />
      </g>
      <g transform="translate(140 58)">
        <rect x="0" y="20" width="126" height="40" rx="8" fill={brand.green} />
        <rect x="0" y="34" width="126" height="4" fill={brand.yellow} />
        <rect x="122" y="24" width="42" height="36" rx="6" fill={ink} />
        <circle cx="32" cy="64" r="11" fill={ink} />
        <circle cx="32" cy="64" r="4.5" fill={brand.yellow} />
        <circle cx="132" cy="64" r="11" fill={ink} />
        <circle cx="132" cy="64" r="4.5" fill={brand.yellow} />
        <rect x="20" y="8" width="16" height="24" rx="6" fill={brand.white} />
      </g>
      <g transform="translate(300 78)">
        <rect x="6" y="0" width="7" height="7" rx="1.2" fill={ink} />
        <rect
          x="0"
          y="7"
          width="20"
          height="32"
          rx="8"
          fill={brand.white}
          stroke={ink}
        />
        <path
          d="M5 22h10"
          stroke={brand.green}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
