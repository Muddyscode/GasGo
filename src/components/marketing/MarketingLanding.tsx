"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { CyclingGreeting } from "@/components/marketing/CyclingGreeting";
import { HeroWorld } from "@/components/marketing/HeroWorld";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { KeyBenefits } from "@/components/marketing/KeyBenefits";
import { TrustRow } from "@/components/marketing/TrustRow";
import { ZoneMap } from "@/components/marketing/ZoneMap";
import { SealedValveGlyph } from "@/components/illustrations/gas-scenes";
import { FadeLift } from "@/components/motion/FadeLift";
import { buttonClassName } from "@/components/ui/button";
import { cardClassName } from "@/components/ui/card";
import { LIVE_RATE_NGN_PER_KG } from "@/config/pricing";
import { whatsappHref } from "@/config/whatsapp";
import { formatNaira } from "@/lib/money";
import { cn } from "@/lib/utils";

export function MarketingLanding() {
  return (
    <div className="flex flex-1 flex-col">
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
            <div className="flex flex-col gap-2 rounded-[1.75rem] bg-white p-2 shadow-gasgo-lg ring-1 ring-black/5 sm:flex-row sm:items-center sm:rounded-full">
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

        <HeroWorld className="relative z-[1] mt-3 w-full flex-1 sm:mt-4" />
      </section>

      <div className="relative z-[1] bg-white">
        <div className="mx-auto w-full max-w-5xl px-5 pb-20 pt-4 md:px-8 lg:max-w-6xl lg:px-10">
          <HowItWorks />
          <ZoneMap />
          <KeyBenefits />
          <TrustRow />

          <FadeLift className="mt-12">
            <section
              className={cn(
                cardClassName,
                "relative overflow-hidden bg-surface-muted px-5 py-5 shadow-gasgo-soft",
              )}
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-3 left-0 w-1 rounded-full bg-brand-yellow"
              />
              <div className="flex items-start justify-between gap-3 pl-2">
                <div>
                  <h2 className="text-[17px] font-semibold tracking-tight text-ink">
                    Auto-refill
                  </h2>
                  <p className="mt-1 max-w-[40ch] text-sm leading-relaxed text-ink-muted">
                    A gauge that orders for you is on the way. Today, you build the fill
                    yourself — guests included, account only at checkout.
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="rounded-full border border-border bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                    Coming soon
                  </span>
                  <SealedValveGlyph className="size-9" />
                </div>
              </div>
            </section>
          </FadeLift>

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
