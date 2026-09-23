import Image from "next/image";
import { brand } from "@/config/tokens";
import { cn } from "@/lib/utils";

export function KitchenHero({ className }: { className?: string }) {
  return (
    <figure
      className={cn(
        "relative overflow-hidden bg-surface-muted",
        className,
      )}
    >
      <Image
        src="/brand/kitchen-relief.png"
        alt="A Port Harcourt kitchen: Sunday jollof on the stove and a filled cylinder just back at the door."
        width={1600}
        height={1200}
        priority
        className="h-full w-full object-cover object-[50%_42%]"
      />
      <svg
        viewBox="0 0 160 120"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <g className="hero-steam" style={{ transformOrigin: "58px 78px" }}>
          <path
            d="M54 82c2-6 1-10-1-14"
            fill="none"
            stroke={brand.white}
            strokeOpacity="0.55"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M60 84c3-7 2-12 0-16"
            fill="none"
            stroke={brand.white}
            strokeOpacity="0.4"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </g>
        <g className="hero-flame" transform="translate(56 86)">
          <path
            d="M8 16c0-6-3.4-9.2-7.4-12 1.2 5.4 3.6 7.8 5.2 9.4 1.6-2.4 4.2-6.6 3.4-11.4 5 3.4 6.8 9.2 4.2 14Z"
            fill={brand.red}
          />
          <path
            d="M7.2 15c.6-3.4-.4-5.6-2.4-7.4.8 2.6 1.6 3.8 1.2 5.6"
            fill="none"
            stroke={brand.yellow}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </figure>
  );
}
