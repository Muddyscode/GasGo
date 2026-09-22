import Link from "next/link";
import { ArrowRight, Clock3, Landmark, Wallet } from "lucide-react";
import { ComingSoonTeaser } from "@/components/marketing/ComingSoonTeaser";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { MarketingFaq } from "@/components/marketing/MarketingFaq";
import { MarketingPageFrame } from "@/components/marketing/MarketingPageFrame";
import { MarketingPageHero } from "@/components/marketing/MarketingPageHero";
import { FadeLift, fadeLiftDelayMs } from "@/components/motion/FadeLift";
import { buttonClassName } from "@/components/ui/button";
import { cardClassName } from "@/components/ui/card";
import { CUTOFF_EXPLANATION, FULFILLMENT_COPY } from "@/config/fulfillment";
import { cn } from "@/lib/utils";

const DETAILS = [
  {
    icon: Wallet,
    title: "Pay before pickup",
    body: "Paystack in full. We only collect the empty once payment lands — no street fill on credit.",
  },
  {
    icon: Clock3,
    title: "Same-day closes 8:00pm WAT",
    body: CUTOFF_EXPLANATION,
  },
  {
    icon: Landmark,
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
            className={buttonClassName({ variant: "primary", size: "lg" }, "sm:w-auto sm:px-8")}
          >
            Order a refill
            <ArrowRight className="size-4" strokeWidth={2.25} />
          </Link>
        }
      >
        Three honest beats in Port Harcourt. A rider picks up your cylinder, we
        fill it offsite at the plant, and we bring it back sealed. We never fill
        cooking gas on your street.
      </MarketingPageHero>

      <div className="mt-10">
        <HowItWorks flush />
      </div>

      <section className="mt-14" aria-labelledby="loop-details-heading">
        <FadeLift>
          <h2
            id="loop-details-heading"
            className="font-display text-[24px] font-extrabold tracking-tight text-ink md:text-[28px]"
          >
            The loop, without the fine print fog
          </h2>
        </FadeLift>
        <ul className="mt-5 grid gap-3 md:grid-cols-3">
          {DETAILS.map((item, index) => (
            <li key={item.title}>
              <FadeLift delayMs={fadeLiftDelayMs(index)} className="h-full">
                <article className={cn(cardClassName, "h-full px-4 py-5")}>
                  <item.icon className="size-4 text-brand-green" strokeWidth={2} />
                  <h3 className="mt-3 text-[15px] font-semibold tracking-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{item.body}</p>
                </article>
              </FadeLift>
            </li>
          ))}
        </ul>
      </section>

      <FadeLift className="mt-12">
        <ComingSoonTeaser />
      </FadeLift>

      <MarketingFaq />
    </MarketingPageFrame>
  );
}
