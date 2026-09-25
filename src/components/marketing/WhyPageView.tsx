import Link from "next/link";
import { Ban, Check } from "lucide-react";
import { KeyBenefits } from "@/components/marketing/KeyBenefits";
import { MarketingFaq } from "@/components/marketing/MarketingFaq";
import { MarketingPageFrame } from "@/components/marketing/MarketingPageFrame";
import { MarketingPageHero } from "@/components/marketing/MarketingPageHero";
import { MarketingReveal } from "@/components/marketing/MarketingReveal";
import { TrustRow } from "@/components/marketing/TrustRow";
import { buttonClassName } from "@/components/ui/button";
import { COMING_SOON_LINE } from "@/lib/marketing-greetings";

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
            className={buttonClassName({ variant: "primary", size: "lg" }, "mkt-cta sm:w-auto sm:px-8")}
          >
            Start a refill
          </Link>
        }
      >
        One Paystack payment for collect, plant refill, and return. Port Harcourt
        only. Nothing is filled at your door. {COMING_SOON_LINE}.
      </MarketingPageHero>

      <MarketingReveal className="mt-10">
        <KeyBenefits flush />
      </MarketingReveal>

      <MarketingReveal>
        <section className="mt-12" aria-labelledby="contrast-heading">
        <h2
          id="contrast-heading"
          className="mkt-display font-display text-[1.375rem] font-semibold tracking-tight text-ink md:text-[1.625rem]"
        >
          Plant refill vs street fill
        </h2>
        <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-ink-muted">
          We do not hose gas on Garden City streets. The empty leaves, the plant
          fills, the full bottle comes home.
        </p>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <article>
            <p className="mkt-kicker">GasGo plant</p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {PLANT.map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm leading-relaxed text-ink">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand-green" strokeWidth={2.4} />
                  {line}
                </li>
              ))}
            </ul>
          </article>
          <article>
            <p className="mkt-kicker text-ink-muted">Street fill</p>
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
      </MarketingReveal>

      <MarketingReveal className="mt-12">
        <TrustRow />
      </MarketingReveal>

      <MarketingReveal>
        <MarketingFaq />
      </MarketingReveal>
    </MarketingPageFrame>
  );
}
