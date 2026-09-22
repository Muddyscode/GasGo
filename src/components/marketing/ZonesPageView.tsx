import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ComingSoonTeaser } from "@/components/marketing/ComingSoonTeaser";
import { MarketingFaq } from "@/components/marketing/MarketingFaq";
import { MarketingPageFrame } from "@/components/marketing/MarketingPageFrame";
import { MarketingPageHero } from "@/components/marketing/MarketingPageHero";
import { ZoneMap } from "@/components/marketing/ZoneMap";
import { FadeLift } from "@/components/motion/FadeLift";
import { buttonClassName } from "@/components/ui/button";
import { cardClassName } from "@/components/ui/card";
import { FULFILLMENT_COPY } from "@/config/fulfillment";
import { PH_ZONES, ZONE_FEE_MAX_NGN, ZONE_FEE_MIN_NGN } from "@/config/pricing";
import { formatNaira } from "@/lib/money";
import { cn } from "@/lib/utils";

export function ZonesPageView() {
  return (
    <MarketingPageFrame>
      <MarketingPageHero
        eyebrow="Zones"
        title="Garden City coverage. Not the whole map of Nigeria."
        action={
          <Link
            href="/order/cylinder"
            className={buttonClassName({ variant: "primary", size: "lg" }, "sm:w-auto sm:px-8")}
          >
            Order in your zone
            <ArrowRight className="size-4" strokeWidth={2.25} />
          </Link>
        }
      >
        Pickup empty and return full across {PH_ZONES.length} Port Harcourt
        corridors. The zone fee is its own line — {formatNaira(ZONE_FEE_MIN_NGN)} to{" "}
        {formatNaira(ZONE_FEE_MAX_NGN)}, never a surprise flat fee.
      </MarketingPageHero>

      <div
        className={cn(
          cardClassName,
          "mt-8 flex flex-col gap-1 bg-surface-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between",
        )}
      >
        <p className="text-[15px] font-semibold tracking-tight text-ink">
          Fee ceiling {formatNaira(ZONE_FEE_MAX_NGN)}
        </p>
        <p className="text-sm text-ink-muted">
          Every listed zone stays between {formatNaira(ZONE_FEE_MIN_NGN)} and{" "}
          {formatNaira(ZONE_FEE_MAX_NGN)}. Shown before you pay.
        </p>
      </div>

      <div className="mt-8">
        <ZoneMap flush />
      </div>

      <section className="mt-12 grid gap-3 md:grid-cols-2">
        <FadeLift>
          <article className={cn(cardClassName, "h-full px-5 py-5")}>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-green">
              Door-to-door
            </p>
            <h2 className="mt-2 text-[17px] font-semibold tracking-tight text-ink">
              {FULFILLMENT_COPY.door_to_door.title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              {FULFILLMENT_COPY.door_to_door.detail} Zone fee applies for the
              corridor we ride.
            </p>
          </article>
        </FadeLift>
        <FadeLift delayMs={70}>
          <article className={cn(cardClassName, "h-full px-5 py-5")}>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-green">
              Hub
            </p>
            <h2 className="mt-2 text-[17px] font-semibold tracking-tight text-ink">
              {FULFILLMENT_COPY.hub.title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              {FULFILLMENT_COPY.hub.detail}
            </p>
          </article>
        </FadeLift>
      </section>

      <FadeLift className="mt-12">
        <ComingSoonTeaser />
      </FadeLift>

      <MarketingFaq />
    </MarketingPageFrame>
  );
}
