import { brand } from "@/config/tokens";
import { cn } from "@/lib/utils";

type GasGoMarkProps = {
  className?: string;
  title?: string;
};

/**
 * Valve / gas-ring symbol. No fire motif in the logotype.
 * Reads at 16–32px (navbar / favicon) and scales cleanly.
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
      <circle cx="16" cy="17.2" r="9.4" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="16" cy="17.2" r="4.4" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13.4" y="4.2" width="5.2" height="5.6" rx="1.2" fill="currentColor" />
      <rect x="14.55" y="3.1" width="2.9" height="1.7" rx="0.5" fill={brand.yellow} />
      <path
        d="M12.4 17.2h7.2"
        stroke={brand.yellow}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
