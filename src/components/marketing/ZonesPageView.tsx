import Link from "next/link";
import { MarketingFaq } from "@/components/marketing/MarketingFaq";
import { MarketingPageFrame } from "@/components/marketing/MarketingPageFrame";
import { MarketingPageHero } from "@/components/marketing/MarketingPageHero";
import { ZoneMap } from "@/components/marketing/ZoneMap";
import { buttonClassName } from "@/components/ui/button";
import { FULFILLMENT_COPY } from "@/config/fulfillment";
import { PH_ZONES, ZONE_FEE_MAX_NGN, ZONE_FEE_MIN_NGN } from "@/config/pricing";
import { formatNaira } from "@/lib/money";

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
          </Link>
        }
      >
        Pickup empty and return full across {PH_ZONES.length} Port Harcourt
        corridors. The zone fee is its own line — {formatNaira(ZONE_FEE_MIN_NGN)} to{" "}
        {formatNaira(ZONE_FEE_MAX_NGN)}, never a surprise flat fee.
      </MarketingPageHero>

      <div className="mt-8 border-y border-border py-4 sm:flex sm:items-center sm:justify-between">
        <p className="text-[15px] font-semibold tracking-tight text-ink">
          Fee ceiling {formatNaira(ZONE_FEE_MAX_NGN)}
        </p>
        <p className="mt-1 text-sm text-ink-muted sm:mt-0">
          Every listed zone stays between {formatNaira(ZONE_FEE_MIN_NGN)} and{" "}
          {formatNaira(ZONE_FEE_MAX_NGN)}. Shown before you pay.
        </p>
      </div>

      <div className="mt-8">
        <ZoneMap flush />
      </div>

      <section className="mt-12 grid gap-8 md:grid-cols-2">
        <article>
          <p className="text-[15px] font-medium text-brand-green">Door-to-door</p>
          <h2 className="mt-2 font-display text-[18px] font-semibold tracking-tight text-ink">
            {FULFILLMENT_COPY.door_to_door.title}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
            {FULFILLMENT_COPY.door_to_door.detail} Zone fee applies for the
            corridor we ride.
          </p>
        </article>
        <article>
          <p className="text-[15px] font-medium text-brand-green">Hub</p>
          <h2 className="mt-2 font-display text-[18px] font-semibold tracking-tight text-ink">
            {FULFILLMENT_COPY.hub.title}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
            {FULFILLMENT_COPY.hub.detail}
          </p>
        </article>
      </section>

      <MarketingFaq />
    </MarketingPageFrame>
  );
}
