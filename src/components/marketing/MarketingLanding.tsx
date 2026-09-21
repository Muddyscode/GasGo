"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame, MessageCircle } from "lucide-react";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { KeyBenefits } from "@/components/marketing/KeyBenefits";
import { TrustRow } from "@/components/marketing/TrustRow";
import { FadeLift } from "@/components/motion/FadeLift";
import { buttonClassName } from "@/components/ui/button";
import { cardClassName } from "@/components/ui/card";
import { PageBody, PageFrame } from "@/components/ui/page";
import { LIVE_RATE_NGN_PER_KG } from "@/config/pricing";
import { whatsappHref } from "@/config/whatsapp";
import { formatNaira } from "@/lib/money";
import { cn } from "@/lib/utils";

export function MarketingLanding() {
  return (
    <PageFrame>
      <PageBody className="pb-20">
        <section className="pt-3 lg:grid lg:grid-cols-12 lg:items-center lg:gap-12 lg:pt-8">
          <FadeLift className="lg:col-span-6">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-green">
              Port Harcourt LPG
            </p>
            <h1 className="mt-3 text-[32px] font-semibold leading-[1.12] tracking-tight text-ink md:text-[40px] lg:text-[48px]">
              Cooking gas, refilled at the plant, returned to your door.
            </h1>
            <p className="mt-4 max-w-[42ch] text-[16px] leading-relaxed text-ink-muted md:text-lg">
              We collect your empty cylinder, fill it offsite, and bring it back full.
              Pay in full before pickup — then track every beat on WhatsApp if you need us.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/order/cylinder"
                className={buttonClassName(
                  { variant: "primary", size: "lg" },
                  "shadow-gasgo-lg sm:w-auto sm:min-w-[15.5rem] sm:px-10",
                )}
              >
                <Flame className="size-4" strokeWidth={2.25} />
                Order a refill
                <ArrowRight className="size-4" strokeWidth={2.25} />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex min-h-12 items-center justify-center px-1 text-[15px] font-semibold text-ink-muted transition-colors hover:text-ink"
              >
                How it works
              </a>
            </div>

            <p className="mt-5 text-sm text-ink-muted">
              Live {formatNaira(LIVE_RATE_NGN_PER_KG)}/kg · Full, by kg, or by ₦ ·
              Port Harcourt only
            </p>
          </FadeLift>

          <FadeLift delayMs={80} className="mt-10 lg:col-span-6 lg:mt-0">
            <div className="relative overflow-hidden rounded-[1.5rem] border border-border shadow-gasgo-lg">
              <Image
                src="/images/cooking-gas-station.png"
                alt="Port Harcourt LPG plant where cylinders are refilled offsite"
                width={960}
                height={640}
                priority
                sizes="(min-width: 1024px) 520px, 100vw"
                className="h-64 w-full object-cover sm:h-80 lg:h-[24rem]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-[15px] font-semibold leading-snug text-white sm:bottom-5 sm:left-5 sm:right-5 sm:text-base">
                Never a doorstep fill. The plant does the work.
              </p>
            </div>
          </FadeLift>
        </section>

        <HowItWorks />
        <KeyBenefits />
        <TrustRow />

        <FadeLift className="mt-10">
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
              <span className="shrink-0 rounded-full border border-border bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                Coming soon
              </span>
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
            <Flame className="size-4" strokeWidth={2.25} />
            Start your refill
          </Link>
          <a
            href={whatsappHref("Hi GasGo, I have a question before I order.")}
            className={buttonClassName({ variant: "outline", size: "lg" }, "sm:w-auto sm:px-8")}
          >
            <MessageCircle className="size-4" strokeWidth={2} />
            Chat on WhatsApp
          </a>
        </FadeLift>
      </PageBody>
    </PageFrame>
  );
}
