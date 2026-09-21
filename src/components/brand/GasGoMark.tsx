import { cn } from "@/lib/utils";

type GasGoMarkProps = {
  className?: string;
  title?: string;
};

/**
 * Original GasGo glyph: green-world truck + LPG cylinder + 3 motion dashes.
 * Designed to read at 16–32px (navbar / favicon) and scale up cleanly.
 */
export function GasGoMark({ className, title }: GasGoMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-full", className)}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M1.6 12.6h7.1M1.2 16h6.2M1.8 19.4h6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M1.2 16h6.2"
        stroke="#FFDF22"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="11.1" y="4.4" width="3.6" height="3.4" rx="0.8" fill="currentColor" />
      <rect x="11.9" y="3.1" width="2" height="1.8" rx="0.45" fill="#0B1F14" />
      <rect x="9.2" y="7.2" width="7.4" height="13.4" rx="3.5" fill="currentColor" />
      <path
        d="M10.8 13.4h4.2"
        stroke="#1CA350"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <rect x="8.4" y="14.2" width="14.2" height="9" rx="1.8" fill="currentColor" />
      <rect x="8.4" y="18.4" width="14.2" height="1.45" fill="#FFDF22" />
      <path
        d="M22.2 11.6h6.2c1 0 1.8.8 1.8 1.8v9.2H21.2v-9.6c0-.8.6-1.4 1.4-1.4Z"
        fill="currentColor"
      />
      <path d="M23.5 13.2h4.6l1 4.6H23.5V13.2Z" fill="#147A3E" />
      <rect x="28.4" y="19.1" width="1.7" height="1.7" rx="0.35" fill="#FFDF22" />
      <circle cx="13.1" cy="25.2" r="2.55" fill="#0B1F14" />
      <circle cx="13.1" cy="25.2" r="1.1" fill="#FFDF22" />
      <circle cx="25.4" cy="25.2" r="2.55" fill="#0B1F14" />
      <circle cx="25.4" cy="25.2" r="1.1" fill="#FFDF22" />
    </svg>
  );
}
