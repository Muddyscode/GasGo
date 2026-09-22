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

          <FadeLift delayMs={80} className="mx-auto mt-5 flex w-full max-w-md flex-col items-center md:mt-8">
            <Link
              href="/order/cylinder"
              className={buttonClassName(
                { variant: "primary", size: "lg" },
                "h-14 w-full max-w-sm rounded-full px-10 text-lg shadow-gasgo-lg sm:h-16 sm:w-auto sm:min-w-[18rem] sm:px-12",
              )}
            >
              Order a refill
              <ArrowRight className="size-5" strokeWidth={2.25} />
            </Link>
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
