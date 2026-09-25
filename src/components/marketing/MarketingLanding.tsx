"use client";

import Link from "next/link";
import { AudienceScenes } from "@/components/marketing/AudienceScenes";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { KeyBenefits } from "@/components/marketing/KeyBenefits";
import { KitchenHero } from "@/components/marketing/KitchenHero";
import { LegacyMarketingHashRedirect } from "@/components/marketing/LegacyMarketingHashRedirect";
import { MarketingFaq } from "@/components/marketing/MarketingFaq";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import {
  MarketingReveal,
  marketingRevealDelayMs,
} from "@/components/marketing/MarketingReveal";
import { ZoneMap } from "@/components/marketing/ZoneMap";
import { buttonClassName } from "@/components/ui/button";
import { LIVE_RATE_NGN_PER_KG } from "@/config/pricing";
import {
  MARKETING_GREETING_SR,
  MARKETING_HEADLINE,
  MARKETING_LEDE,
  MARKETING_SAFETY,
} from "@/lib/marketing-greetings";
import { formatNaira } from "@/lib/money";
import { cn } from "@/lib/utils";

export function MarketingLanding() {
  return (
    <div className="flex flex-1 flex-col">
      <LegacyMarketingHashRedirect />
      <section className="relative isolate flex flex-col overflow-hidden bg-surface">
        <div className="hero-copy-wash pointer-events-none absolute inset-0 z-[1] hidden md:block" aria-hidden="true" />

        <div className="relative z-[1] mx-auto flex min-h-[min(86dvh,46rem)] w-full max-w-6xl flex-col justify-center px-5 py-12 md:px-8 lg:px-10">
          <div className="md:max-w-[42%]">
            <p className="mkt-kicker">Port Harcourt cooking gas</p>
            <h1 className="mkt-display mt-3 max-w-[16ch] font-display text-[2rem] font-semibold leading-[1.05] tracking-tight text-ink sm:text-[2.75rem] lg:text-[3.25rem]">
              <span className="sr-only">{MARKETING_GREETING_SR}</span>
              <span aria-hidden="true">{MARKETING_HEADLINE}</span>
            </h1>
            <p className="mt-4 max-w-[40ch] text-[15px] leading-relaxed text-ink-muted md:text-[17px]">
              {MARKETING_LEDE}
            </p>
            <p className="sr-only">{MARKETING_SAFETY}</p>
            <p className="mt-3 text-[13px] font-medium text-ink">
              Live {formatNaira(LIVE_RATE_NGN_PER_KG)}/kg
              <span className="font-normal text-ink-muted">
                {" "}
                plus a zone pickup and return fee
              </span>
            </p>
            <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Link
                href="/order/cylinder"
                className={buttonClassName(
                  { variant: "primary", size: "lg" },
                  "mkt-cta sm:w-auto sm:min-w-[11.5rem] sm:px-8",
                )}
              >
                Start a refill
              </Link>
              <Link
                href="/zones"
                className={buttonClassName(
                  { variant: "outline", size: "lg" },
                  "mkt-cta sm:w-auto sm:px-8",
                )}
              >
                See prices
              </Link>
            </div>
            <p className="mt-4 text-sm text-ink-muted">
              Already with us?{" "}
              <Link href="/login" className="font-medium text-brand-green underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
            <LiveStatusCard className="mt-8 md:hidden" />
          </div>
        </div>

        <KitchenHero className="relative aspect-[16/10] w-full md:absolute md:inset-y-0 md:right-0 md:z-0 md:aspect-auto md:h-full md:min-h-[36rem] md:w-[58%]" />

        <LiveStatusCard className="absolute bottom-6 right-5 z-[2] hidden max-w-[17rem] md:block lg:right-10" />
      </section>

      <div className="relative z-[1] bg-surface">
        <div className="mx-auto w-full max-w-5xl px-5 pb-8 pt-2 md:px-8 lg:max-w-6xl lg:px-10">
          <MarketingReveal delayMs={marketingRevealDelayMs(0)}>
            <HowItWorks />
          </MarketingReveal>
          <MarketingReveal delayMs={marketingRevealDelayMs(1)}>
            <AudienceScenes />
          </MarketingReveal>
          <MarketingReveal delayMs={marketingRevealDelayMs(2)}>
            <ZoneMap />
          </MarketingReveal>
          <MarketingReveal delayMs={marketingRevealDelayMs(3)}>
            <KeyBenefits />
          </MarketingReveal>
          <MarketingReveal delayMs={marketingRevealDelayMs(4)}>
            <MarketingFaq />
          </MarketingReveal>
        </div>
        <MarketingFooter />
      </div>
    </div>
  );
}

function LiveStatusCard({ className }: { className?: string }) {
  return (
    <Link
      href="/order/cylinder"
      className={cn(
        "hero-status-card group/status block rounded-2xl bg-surface/95 p-4 shadow-gasgo-md ring-1 ring-black/5",
        className,
      )}
    >
      <p className="flex items-center gap-2 text-[13px] font-semibold text-ink">
        <span className="hero-status-dot size-1.5 rounded-full bg-brand-green" aria-hidden="true" />
        Live {formatNaira(LIVE_RATE_NGN_PER_KG)}/kg
      </p>
      <p className="mt-1 text-[13px] leading-snug text-ink-muted">
        Example Diobu pickup ~12 min
      </p>
      <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-brand-green">
        Start a refill
        <svg
          viewBox="0 0 16 16"
          className="size-3.5"
          aria-hidden="true"
          fill="none"
        >
          <path
            d="M3 8h9M8.5 4.5 12.5 8 8.5 11.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}
