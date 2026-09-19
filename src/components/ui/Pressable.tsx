import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { tactile, tactilePrimary, tactileSecondary } from "@/components/ui/tactile";

type Variant = "primary" | "secondary" | "ghost" | "chip";
type Size = "md" | "lg";

const variantClass: Record<Variant, string> = {
  primary: tactilePrimary("w-auto"),
  secondary: tactileSecondary("w-auto"),
  ghost: cn(
    "inline-flex min-h-11 items-center justify-center rounded-full px-3 text-[15px] font-semibold text-ink",
    tactile.motion,
    tactile.press,
    tactile.focus,
    "hover:bg-surface-muted",
  ),
  chip: cn(
    "inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-[13px] font-semibold text-ink shadow-gasgo-soft",
    tactile.motion,
    tactile.press,
    tactile.lift,
    tactile.focus,
  ),
};

const sizeClass: Record<Size, string> = {
  md: "h-12 min-h-11 px-4 text-[15px]",
  lg: "h-14 min-h-11 px-5 text-base",
};

type PressableProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

export function Pressable({
  variant = "primary",
  size = "lg",
  className,
  type = "button",
  children,
  ...props
}: PressableProps) {
  return (
    <button
      type={type}
      className={cn(variantClass[variant], sizeClass[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

type PressableLinkProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
};

export function PressableLink({
  href,
  variant = "primary",
  size = "lg",
  className,
  children,
  ariaLabel,
}: PressableLinkProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cn(variantClass[variant], sizeClass[size], className)}
    >
      {children}
    </Link>
  );
}
