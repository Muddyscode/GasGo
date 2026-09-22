"use client";

import { MARKETING_FAQ_SR, MARKETING_FAQS } from "@/lib/marketing-faq";
import { cn } from "@/lib/utils";
import { FadeLift } from "@/components/motion/FadeLift";

export function MarketingFaq({ className }: { className?: string }) {
  return (
    <section
      id="faq"
      className={cn("mt-16 scroll-mt-24 lg:mt-20", className)}
      aria-labelledby="faq-heading"
    >
      <FadeLift>
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-green">
          FAQ
        </p>
        <h2
          id="faq-heading"
          className="mt-2 font-display text-[28px] font-extrabold tracking-tight text-ink md:text-[34px]"
        >
          Before you order in Port Harcourt
        </h2>
        <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-ink-muted">
          {MARKETING_FAQ_SR}
        </p>
      </FadeLift>

      <div className="mt-6 divide-y divide-border overflow-hidden rounded-[1.5rem] border border-border bg-surface shadow-gasgo-soft">
        {MARKETING_FAQS.map((item) => (
          <details key={item.id} className="group px-5 py-1">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-[15px] font-semibold tracking-tight text-ink marker:content-none [&::-webkit-details-marker]:hidden">
              {item.question}
              <span
                aria-hidden="true"
                className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-muted text-brand-green transition-transform duration-200 group-open:rotate-45"
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
