import Link from "next/link";
import { ArrowRight, Ban, Check } from "lucide-react";
import { ComingSoonTeaser } from "@/components/marketing/ComingSoonTeaser";
import { KeyBenefits } from "@/components/marketing/KeyBenefits";
import { MarketingFaq } from "@/components/marketing/MarketingFaq";
import { MarketingPageFrame } from "@/components/marketing/MarketingPageFrame";
import { MarketingPageHero } from "@/components/marketing/MarketingPageHero";
import { TrustRow } from "@/components/marketing/TrustRow";
import { FadeLift } from "@/components/motion/FadeLift";
import { buttonClassName } from "@/components/ui/button";
import { cardClassName } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PLANT = [
  "Your cylinder stays yours",
  "Sealed and weighed at the plant",
  "Live ₦/kg + zone fee as its own line",
  "Pay before the empty leaves",
] as const;

const STREET = [
  "Guessed kilos at the gate",
  "Fill on the street, hose in the rain",
  "No plant seal, no return loop",
  "Not how GasGo rides Port Harcourt",
] as const;

export function WhyPageView() {
  return (
    <MarketingPageFrame>
      <MarketingPageHero
        eyebrow="Why GasGo"
        title="Plant refill you can actually follow."
        action={
          <Link
            href="/order/cylinder"
            className={buttonClassName({ variant: "primary", size: "lg" }, "sm:w-auto sm:px-8")}
          >
            Start a refill
            <ArrowRight className="size-4" strokeWidth={2.25} />
          </Link>
        }
      >
        One Paystack payment for collect, plant refill, and return. Port Harcourt
        only. Auto-refill is coming soon — today you build the fill yourself.
      </MarketingPageHero>

      <div className="mt-10">
        <KeyBenefits flush />
      </div>

      <section className="mt-14" aria-labelledby="contrast-heading">
        <FadeLift>
          <h2
            id="contrast-heading"
            className="font-display text-[24px] font-extrabold tracking-tight text-ink md:text-[28px]"
          >
            Plant refill vs street fill
          </h2>
          <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-ink-muted">
            We do not hose gas on Garden City streets. The empty leaves, the plant
            fills, the full bottle comes home.
          </p>
        </FadeLift>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <article className={cn(cardClassName, "px-5 py-5")}>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-green">
              GasGo plant
            </p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {PLANT.map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm leading-relaxed text-ink">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand-green" strokeWidth={2.4} />
                  {line}
                </li>
              ))}
            </ul>
          </article>
          <article className={cn(cardClassName, "px-5 py-5")}>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Street fill
            </p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {STREET.map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm leading-relaxed text-ink-muted">
                  <Ban className="mt-0.5 size-4 shrink-0 text-brand-red" strokeWidth={2.2} />
                  {line}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <div className="mt-12">
        <TrustRow />
      </div>

      <FadeLift className="mt-12">
        <ComingSoonTeaser />
      </FadeLift>

      <MarketingFaq />
    </MarketingPageFrame>
  );
}
