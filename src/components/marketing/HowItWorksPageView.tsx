import Link from "next/link";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { MarketingFaq } from "@/components/marketing/MarketingFaq";
import { MarketingPageFrame } from "@/components/marketing/MarketingPageFrame";
import { MarketingPageHero } from "@/components/marketing/MarketingPageHero";
import { MarketingReveal } from "@/components/marketing/MarketingReveal";
import { buttonClassName } from "@/components/ui/button";
import { CUTOFF_EXPLANATION, FULFILLMENT_COPY } from "@/config/fulfillment";

const DETAILS = [
  {
    title: "Pay before pickup",
    body: "Paystack in full. We only collect the empty once payment lands — no street fill on credit.",
  },
  {
    title: "Same-day closes 8:00pm WAT",
    body: CUTOFF_EXPLANATION,
  },
  {
    title: FULFILLMENT_COPY.hub.title,
    body: FULFILLMENT_COPY.hub.detail,
  },
] as const;

export function HowItWorksPageView() {
  return (
    <MarketingPageFrame>
      <MarketingPageHero
        eyebrow="How it works"
        title="Collect empty. Plant refill. Return full."
        action={
          <Link
            href="/order/cylinder"
            className={buttonClassName({ variant: "primary", size: "lg" }, "mkt-cta sm:w-auto sm:px-8")}
          >
            Start a refill
          </Link>
        }
      >
        Three honest beats in Port Harcourt. A rider picks up your cylinder, we
        fill it offsite at the plant, and we bring it back sealed. Nothing is
        filled at your door.
      </MarketingPageHero>

      <MarketingReveal className="mt-10">
        <HowItWorks flush hideIntro />
      </MarketingReveal>

      <MarketingReveal>
        <section className="mt-12" aria-labelledby="loop-details-heading">
          <h2
            id="loop-details-heading"
            className="mkt-display font-display text-[1.375rem] font-semibold tracking-tight text-ink md:text-[1.625rem]"
          >
            The loop, without the fine print fog
          </h2>
          <ul className="mt-6 grid gap-8 md:grid-cols-3">
            {DETAILS.map((item) => (
              <li key={item.title}>
                <h3 className="font-display text-[1.0625rem] font-semibold tracking-tight text-ink">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </MarketingReveal>

      <MarketingReveal>
        <MarketingFaq />
      </MarketingReveal>
    </MarketingPageFrame>
  );
}
