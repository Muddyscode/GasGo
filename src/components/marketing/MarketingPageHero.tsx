import type { ReactNode } from "react";
import { FadeLift } from "@/components/motion/FadeLift";

export function MarketingPageHero({
  eyebrow,
  title,
  children,
  action,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <FadeLift>
      <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-green">
        {eyebrow}
      </p>
      <h1 className="mt-2 max-w-[18ch] font-display text-[2rem] font-extrabold leading-[1.08] tracking-tight text-ink md:text-[2.65rem]">
        {title}
      </h1>
      <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-ink-muted md:text-base">
        {children}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </FadeLift>
  );
}
