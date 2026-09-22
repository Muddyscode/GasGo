import { cva, type VariantProps } from "class-variance-authority";
import { cn, type ClassValue } from "@/lib/utils";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 font-semibold tracking-tight",
    "outline-none select-none",
    "transition-[transform,box-shadow,background-color,color,filter,border-color] duration-200",
    "ease-[cubic-bezier(0.16,1,0.3,1)]",
    "focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55",
    "active:scale-[0.975]",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-brand-green text-white shadow-gasgo-md hover:brightness-105 hover:shadow-gasgo-lg",
        secondary:
          "bg-surface-muted text-ink shadow-gasgo-soft hover:bg-surface-soft hover:shadow-gasgo-md",
        outline:
          "border border-border bg-surface text-ink shadow-gasgo-soft hover:border-brand-green/40 hover:bg-surface-soft",
        ghost: "bg-transparent text-ink hover:bg-surface-muted",
        yellow:
          "bg-brand-yellow text-ink shadow-gasgo-soft hover:brightness-105 hover:shadow-gasgo-md",
      },
      size: {
        sm: "h-11 min-h-11 rounded-full px-4 text-sm",
        md: "h-12 min-h-11 rounded-2xl px-5 text-[15px]",
        lg: "h-14 min-h-11 w-full rounded-2xl px-5 text-base",
        icon: "size-11 min-h-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export function buttonClassName(
  variants?: ButtonVariantProps,
  className?: ClassValue,
) {
  return cn(buttonVariants(variants), className);
}
