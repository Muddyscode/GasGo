import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const orderFieldClassName = [
  "h-14 w-full rounded-2xl border border-border bg-surface px-4",
  "text-[17px] tabular-nums text-ink outline-none",
  "transition-[border-color,background-color,box-shadow] duration-150",
  "placeholder:text-ink-muted/55",
  "focus:border-brand-green focus:ring-2 focus:ring-brand-green/20",
].join(" ");

export function OrderSection({
  title,
  hint,
  children,
  className,
}: {
  title: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mb-8", className)}>
      <h3 className="text-[15px] font-semibold tracking-tight text-ink">{title}</h3>
      {hint ? (
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">{hint}</p>
      ) : null}
      <div className={hint ? "mt-3" : "mt-2.5"}>{children}</div>
    </section>
  );
}
