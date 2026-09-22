"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { CyclingGreeting } from "@/components/marketing/CyclingGreeting";
import { HeroRun } from "@/components/marketing/HeroRun";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { KeyBenefits } from "@/components/marketing/KeyBenefits";
import { LegacyMarketingHashRedirect } from "@/components/marketing/LegacyMarketingHashRedirect";
import { TrustRow } from "@/components/marketing/TrustRow";
import { ZoneMap } from "@/components/marketing/ZoneMap";
import { ComingSoonTeaser } from "@/components/marketing/ComingSoonTeaser";
import { MarketingFaq } from "@/components/marketing/MarketingFaq";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { FadeLift } from "@/components/motion/FadeLift";
import { buttonClassName } from "@/components/ui/button";
import { LIVE_RATE_NGN_PER_KG } from "@/config/pricing";
import { whatsappHref } from "@/config/whatsapp";
import { formatNaira } from "@/lib/money";

export function MarketingLanding() {
  return (
    <div className="flex flex-1 flex-col">
      <LegacyMarketingHashRedirect />
      <section className="relative flex min-h-[calc(100dvh-4.25rem)] flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 hero-wash" aria-hidden="true" />
        <div className="relative z-[1] mx-auto flex w-full max-w-5xl shrink-0 flex-col px-5 pt-3 md:px-8 md:pt-6 lg:max-w-6xl lg:px-10 lg:pt-10">
          <FadeLift>
            <CyclingGreeting />
            <p className="mx-auto mt-3 max-w-[36ch] text-center text-[15px] leading-snug text-ink-muted md:mt-5 md:max-w-[38ch] md:text-lg md:leading-relaxed">
              We collect your empty cylinder, fill it offsite at the plant, and bring it
              back full. Port Harcourt only. Pay in full before pickup.
            </p>
          </FadeLift>

          <FadeLift delayMs={80} className="mx-auto mt-5 w-full max-w-xl md:mt-8">
            <div className="flex flex-col gap-2 rounded-[1.75rem] bg-surface p-2 shadow-gasgo-lg ring-1 ring-black/5 sm:flex-row sm:items-center sm:rounded-full">
              <div className="flex min-h-12 flex-1 items-center gap-2.5 px-4 text-ink">
                <PinIcon />
                <span className="truncate text-[15px] font-medium text-ink-muted">
                  Port Harcourt · plant refill
                </span>
              </div>
              <Link
                href="/order/cylinder"
                className={buttonClassName(
                  { variant: "primary", size: "lg" },
                  "h-12 w-full shrink-0 rounded-full sm:w-auto sm:min-w-[11.5rem] sm:px-8",
                )}
              >
                Order a refill
                <ArrowRight className="size-4" strokeWidth={2.25} />
              </Link>
            </div>
            <p className="mt-2.5 text-center text-sm text-ink-muted">
              Live {formatNaira(LIVE_RATE_NGN_PER_KG)}/kg · Full, by kg, or by ₦
            </p>
          </FadeLift>
        </div>

        <HeroRun className="relative z-[1] mt-2 h-[16.5rem] w-full sm:mt-3 sm:h-[18rem] md:h-[22rem] lg:h-[26rem]" />
      </section>

      <div className="relative z-[1] bg-surface">
        <div className="mx-auto w-full max-w-5xl px-5 pb-8 pt-4 md:px-8 lg:max-w-6xl lg:px-10">
          <HowItWorks />
          <ZoneMap />
          <KeyBenefits />
          <TrustRow />

          <FadeLift className="mt-12">
            <ComingSoonTeaser />
          </FadeLift>

          <MarketingFaq />

          <FadeLift className="mt-12 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Link
              href="/order/cylinder"
              className={buttonClassName(
                { variant: "primary", size: "lg" },
                "shadow-gasgo-lg sm:w-auto sm:min-w-[15.5rem] sm:px-10",
              )}
            >
              Start your refill
              <ArrowRight className="size-4" strokeWidth={2.25} />
            </Link>
            <a
              href={whatsappHref("Hi GasGo, I have a question before I order.")}
              className={buttonClassName({ variant: "outline", size: "lg" }, "sm:w-auto sm:px-8")}
            >
              <MessageCircle className="size-4" strokeWidth={2} />
              Chat on WhatsApp
            </a>
          </FadeLift>
        </div>
        <MarketingFooter />
      </div>
    </div>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-5 shrink-0 text-brand-green" fill="none" aria-hidden="true">
      <path
        d="M10 17.5s5.5-5.1 5.5-9.2A5.5 5.5 0 0 0 4.5 8.3C4.5 12.4 10 17.5 10 17.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="8.2" r="1.8" fill="currentColor" />
    </svg>
  );
}
