import type { ReactNode } from "react";

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
    <div>
      <p className="mkt-kicker">{eyebrow}</p>
      <h1 className="mkt-display mt-2.5 max-w-[18ch] font-display text-[1.875rem] font-semibold leading-[1.05] tracking-tight text-ink md:text-[2.5rem]">
        {title}
      </h1>
      <p className="mt-3 max-w-[44ch] text-[15px] leading-relaxed text-ink-muted md:text-[16px]">
        {children}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
