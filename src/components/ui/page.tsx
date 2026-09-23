import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("flex min-h-0 flex-1 flex-col bg-transparent", className)}
    >
      {children}
    </div>
  );
}

export function PageBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-lg min-h-0 flex-1 flex-col overflow-y-auto px-5 pt-5",
        "md:max-w-2xl md:px-8 md:pt-7",
        "lg:max-w-5xl lg:px-10 lg:pt-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PageTitle({
  eyebrow,
  children,
  subtitle,
  className,
}: {
  eyebrow?: string;
  children: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mb-6 md:mb-7 lg:mb-8", className)}>
      {eyebrow ? (
        <p className="text-[13px] font-medium text-brand-green">{eyebrow}</p>
      ) : null}
      <h2
        className={cn(
          "font-display font-semibold leading-[1.12] tracking-tight text-ink",
          "text-[28px] md:text-[32px] lg:text-[36px]",
          eyebrow && "mt-1.5",
        )}
      >
        {children}
      </h2>
      {subtitle ? (
        <p className="mt-2 max-w-[38ch] text-[15px] leading-relaxed text-ink-muted md:text-base">
          {subtitle}
        </p>
      ) : null}
    </section>
  );
}

export function StickyAction({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-20 shrink-0 border-t border-border/80 bg-surface/95 px-5 pt-3 backdrop-blur-md",
        "pb-[max(1rem,env(safe-area-inset-bottom))]",
        "md:px-8 lg:px-10",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-lg md:max-w-2xl lg:max-w-5xl">{children}</div>
    </div>
  );
}
