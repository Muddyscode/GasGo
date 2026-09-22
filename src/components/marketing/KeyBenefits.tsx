import { MapPin, Package, Scale, Wallet } from "lucide-react";
import { FadeLift, fadeLiftDelayMs } from "@/components/motion/FadeLift";
import { cardClassName } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const BENEFITS = [
  {
    icon: Wallet,
    title: "Pay once",
    body: "We handle collect, plant refill, and return. One Paystack payment before the empty leaves.",
  },
  {
    icon: Package,
    title: "Your cylinder stays yours",
    body: "We fill the bottle you already own — offsite at the plant, then back to your door.",
  },
  {
    icon: Scale,
    title: "Flexible fill",
    body: "Full, by kg, or by ₦. Live Port Harcourt rate, zone fee as its own line.",
  },
  {
    icon: MapPin,
    title: "Reliable Port Harcourt coverage",
    body: "Old GRA to Trans-Amadi and the corridors we ride every day.",
  },
] as const;

export function KeyBenefits({ flush = false }: { flush?: boolean }) {
  return (
    <section
      id="why-gasgo"
      className={flush ? "scroll-mt-24" : "mt-16 scroll-mt-24"}
      aria-labelledby="key-benefits-heading"
    >
      <FadeLift>
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-green">
          Key benefits
        </p>
        <h2
          id="key-benefits-heading"
          className="mt-2 font-display text-[28px] font-extrabold tracking-tight text-ink md:text-[34px]"
        >
          Why people refill with GasGo
        </h2>
        <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-ink-muted">
          Plant refill in Port Harcourt — your cylinder, your fill, one clear loop.
        </p>
      </FadeLift>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map((benefit, index) => (
          <li key={benefit.title}>
            <FadeLift delayMs={fadeLiftDelayMs(index)} className="h-full">
              <article className={cn(cardClassName, "h-full px-4 py-5")}>
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-surface-soft text-brand-green shadow-gasgo-soft">
                  <benefit.icon className="size-4" strokeWidth={2} />
                </span>
                <h3 className="mt-3 text-[15px] font-semibold tracking-tight text-ink">
                  {benefit.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                  {benefit.body}
                </p>
              </article>
            </FadeLift>
          </li>
        ))}
      </ul>
    </section>
  );
}
