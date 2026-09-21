import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { motion } from "@/config/tokens";
import { cn } from "@/lib/utils";

type FadeLiftProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Extra delay before the enter animation, in milliseconds. */
  delayMs?: number;
};

export function fadeLiftDelayMs(index: number): number {
  return Math.max(0, index) * motion.lift.staggerMs;
}

/**
 * Reusable enter: opacity 0→1 + translateY(12→0).
 * Duration and easing live in `tokens.motion`. Honors prefers-reduced-motion.
 */
export function FadeLift({
  children,
  className,
  delayMs = 0,
  style,
  ...props
}: FadeLiftProps) {
  const delayStyle: CSSProperties | undefined =
    delayMs > 0 ? { animationDelay: `${delayMs}ms` } : undefined;

  return (
    <div
      className={cn("fade-lift", className)}
      style={delayStyle || style ? { ...delayStyle, ...style } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
