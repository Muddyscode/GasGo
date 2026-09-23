"use client";

import Link from "next/link";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { KeyBenefits } from "@/components/marketing/KeyBenefits";
import { KitchenHero } from "@/components/marketing/KitchenHero";
import { LegacyMarketingHashRedirect } from "@/components/marketing/LegacyMarketingHashRedirect";
import { MarketingFaq } from "@/components/marketing/MarketingFaq";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { ZoneMap } from "@/components/marketing/ZoneMap";
import { buttonClassName } from "@/components/ui/button";
import {
  LIVE_RATE_NGN_PER_KG,
  ZONE_FEE_MAX_NGN,
  ZONE_FEE_MIN_NGN,
} from "@/config/pricing";
import {
  MARKETING_GREETING_SR,
  MARKETING_HEADLINE,
  MARKETING_LEDE,
  MARKETING_SAFETY,
} from "@/lib/marketing-greetings";
import { formatNaira } from "@/lib/money";

export function MarketingLanding() {
  return (
    <div className="flex flex-1 flex-col">
      <LegacyMarketingHashRedirect />
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 hero-wash" aria-hidden="true" />
        <div className="relative z-[1] mx-auto grid w-full max-w-5xl items-center gap-10 px-5 pb-10 pt-6 md:px-8 lg:max-w-6xl lg:grid-cols-12 lg:gap-12 lg:px-10 lg:pb-16 lg:pt-10">
          <div className="lg:col-span-6">
            <h1 className="max-w-[16ch] font-display text-[2.15rem] font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.15rem]">
              <span className="sr-only">{MARKETING_GREETING_SR}</span>
              <span aria-hidden="true">{MARKETING_HEADLINE}</span>
            </h1>
            <p className="mt-4 max-w-[42ch] text-[16px] leading-relaxed text-ink-muted md:text-lg">
              {MARKETING_LEDE}
            </p>
            <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-ink">
              Live gas is {formatNaira(LIVE_RATE_NGN_PER_KG)}/kg. Pickup and return is{" "}
              {formatNaira(ZONE_FEE_MIN_NGN)}–{formatNaira(ZONE_FEE_MAX_NGN)} by zone.
              Hub self-collect is gas only.
            </p>
            <p className="mt-2 text-[15px] font-medium text-brand-green">
              {MARKETING_SAFETY}
            </p>
            <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Link
                href="/order/cylinder"
                className={buttonClassName(
                  { variant: "primary", size: "lg" },
                  "sm:w-auto sm:min-w-[11.5rem] sm:px-8",
                )}
              >
                Start a refill
              </Link>
              <Link
                href="/zones"
                className={buttonClassName(
                  { variant: "outline", size: "lg" },
                  "sm:w-auto sm:px-8",
                )}
              >
                See prices
              </Link>
            </div>
            <p className="mt-3 text-sm text-ink-muted">
              Already with us?{" "}
              <Link href="/login" className="font-medium text-brand-green underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
          <div className="lg:col-span-6">
            <KitchenHero className="aspect-[4/3] w-full lg:aspect-[5/4]" />
          </div>
        </div>
      </section>

      <div className="relative z-[1] bg-surface">
        <div className="mx-auto w-full max-w-5xl px-5 pb-8 pt-4 md:px-8 lg:max-w-6xl lg:px-10">
          <HowItWorks />
          <ZoneMap />
          <KeyBenefits />
          <MarketingFaq />
        </div>
        <MarketingFooter />
      </div>
    </div>
  );
}
