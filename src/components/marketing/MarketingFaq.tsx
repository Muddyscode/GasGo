"use client";

import { MARKETING_FAQ_SR, MARKETING_FAQS } from "@/lib/marketing-faq";
import { cn } from "@/lib/utils";

export function MarketingFaq({ className }: { className?: string }) {
  return (
    <section
      id="faq"
      className={cn("mt-[var(--mkt-section-space,3.5rem)] scroll-mt-6", className)}
      aria-labelledby="faq-heading"
    >
      <p className="mkt-kicker">Questions</p>
      <h2
        id="faq-heading"
        className="mkt-display mt-2 font-display text-[1.625rem] font-semibold tracking-tight text-ink md:text-[2rem]"
      >
        Before you order in Port Harcourt
      </h2>
      <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-ink-muted">
        {MARKETING_FAQ_SR}
      </p>

      <div className="mt-6 divide-y divide-border border-y border-border">
        {MARKETING_FAQS.map((item) => (
          <details key={item.id} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-[15px] font-semibold tracking-tight text-ink marker:content-none [&::-webkit-details-marker]:hidden">
              {item.question}
              <span
                aria-hidden="true"
                className="grid size-8 shrink-0 place-items-center text-brand-green transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="max-w-[52ch] pb-4 text-sm leading-relaxed text-ink-muted">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
