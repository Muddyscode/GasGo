import Link from "next/link";
import { PH_ZONES, ZONE_FEE_MAX_NGN, ZONE_FEE_MIN_NGN } from "@/config/pricing";
import { formatNaira } from "@/lib/money";
import { buttonClassName } from "@/components/ui/button";
import { ZoneMapCanvas, ZONE_TONE } from "@/components/marketing/ZoneMapCanvas";

export function ZoneMap({ flush = false }: { flush?: boolean }) {
  return (
    <section id="zones" className={flush ? "scroll-mt-6" : "mt-[var(--mkt-section-space,3.5rem)] scroll-mt-6"}>
      <p className="mkt-kicker">Coverage</p>
      <h2 className="mkt-display mt-2 font-display text-[1.625rem] font-semibold tracking-tight text-ink md:text-[2rem]">
        Port Harcourt zones we ride
      </h2>
      <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-ink-muted">
        Pickup empty, plant refill, return full. Zone fees stay between{" "}
        {formatNaira(ZONE_FEE_MIN_NGN)} and {formatNaira(ZONE_FEE_MAX_NGN)}. Hub
        self-collect is gas only.
      </p>

      <div className="mt-7 grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
        <div className="relative min-h-[22rem] overflow-hidden rounded-2xl bg-surface-muted ring-1 ring-border sm:min-h-[24rem] lg:col-span-6 lg:min-h-[26rem]">
          <ZoneMapCanvas />
        </div>
        <div className="lg:col-span-6">
          <table className="w-full text-left text-[14px] sm:text-[15px]">
            <caption className="sr-only">Port Harcourt pickup and return fees by zone</caption>
            <thead>
              <tr className="border-b border-border text-ink-muted">
                <th scope="col" className="py-2.5 pr-4 font-medium">
                  Zone
                </th>
                <th scope="col" className="py-2.5 text-right font-medium">
                  Pickup and return
                </th>
              </tr>
            </thead>
            <tbody>
              {PH_ZONES.map((zone) => (
                <tr key={zone.id} className="mkt-zone-row border-b border-border">
                  <th scope="row" className="py-3 pr-4 font-medium text-ink">
                    {zone.name}
                  </th>
                  <td className="py-3 text-right tabular-nums text-ink">
                    {formatNaira(zone.feeNgn)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-ink-muted" aria-label="Map legend">
        {(Object.keys(ZONE_TONE) as Array<keyof typeof ZONE_TONE>).map((key) => (
          <li key={key} className="inline-flex items-center gap-2">
            <span
              className="size-2.5 rounded-sm"
              style={{ backgroundColor: ZONE_TONE[key].fill }}
              aria-hidden="true"
            />
            {ZONE_TONE[key].label}
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <Link href="/order/cylinder" className={buttonClassName({ variant: "primary", size: "md" }, "mkt-cta w-auto px-6")}>
          Start a refill
        </Link>
      </div>
    </section>
  );
}
