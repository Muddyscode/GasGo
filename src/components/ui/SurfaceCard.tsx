import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { tactile } from "@/components/ui/tactile";

type SurfaceCardProps = HTMLAttributes<HTMLElement> & {
  as?: "section" | "div" | "article" | "li";
  interactive?: boolean;
  selected?: boolean;
  padded?: boolean;
  children: ReactNode;
};

export function SurfaceCard({
  as: Comp = "section",
  interactive = false,
  selected = false,
  padded = true,
  className,
  children,
  ...props
}: SurfaceCardProps) {
  return (
    <Comp
      className={cn(
        tactile.card,
        padded && "px-4 py-4",
        interactive && cn(tactile.motion, tactile.press, tactile.lift),
        selected && "border-brand-green bg-surface-soft shadow-gasgo-md",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
