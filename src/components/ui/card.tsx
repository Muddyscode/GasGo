import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const cardClassName = [
  "rounded-2xl border border-border bg-surface shadow-gasgo-soft",
  "transition-[border-color,background-color,box-shadow,transform] duration-200",
  "ease-[cubic-bezier(0.16,1,0.3,1)]",
].join(" ");

export const interactiveCardClassName = [
  cardClassName,
  "outline-none active:scale-[0.985]",
  "motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-gasgo-md",
  "focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2",
].join(" ");

export const selectedCardClassName =
  "border-brand-green bg-surface-soft shadow-gasgo-md";

export function Card({
  className,
  interactive = false,
  selected = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
  selected?: boolean;
}) {
  return (
    <div
      className={cn(
        interactive ? interactiveCardClassName : cardClassName,
        selected && selectedCardClassName,
        className,
      )}
      {...props}
    />
  );
}
