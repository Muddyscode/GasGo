const BENEFITS = [
  {
    mark: "01",
    title: "Pay once",
    body: "We handle collect, plant refill, and return. One Paystack payment before the empty leaves.",
  },
  {
    mark: "02",
    title: "Your cylinder stays yours",
    body: "We fill the bottle you already own — offsite at the plant, then back to your door.",
  },
  {
    mark: "03",
    title: "Flexible fill",
    body: "Full, by kg, or by naira. Live Port Harcourt rate, zone fee as its own line.",
  },
  {
    mark: "04",
    title: "Reliable Port Harcourt coverage",
    body: "Old GRA to Trans-Amadi and the corridors we ride every day. Hub self-collect is gas only.",
  },
] as const;

export function KeyBenefits({ flush = false }: { flush?: boolean }) {
  return (
    <section
      id="why-gasgo"
      className={flush ? "scroll-mt-24" : "mt-[var(--mkt-section-space,3.5rem)] scroll-mt-24"}
      aria-labelledby="key-benefits-heading"
    >
      <p className="mkt-kicker">Why GasGo</p>
      <h2
        id="key-benefits-heading"
        className="mkt-display mt-2 font-display text-[1.625rem] font-semibold tracking-tight text-ink md:text-[2rem]"
      >
        Why people refill with GasGo
      </h2>
      <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-ink-muted">
        Plant refill in Port Harcourt — your cylinder, your fill, one clear loop.
      </p>

      <ul className="mt-8 grid gap-x-12 gap-y-7 md:grid-cols-2">
        {BENEFITS.map((benefit) => (
          <li key={benefit.title} className="flex gap-4">
            <span
              aria-hidden="true"
              className="mt-0.5 font-display text-[13px] font-semibold tabular-nums text-brand-red"
            >
              {benefit.mark}
            </span>
            <div>
              <h3 className="font-display text-[1.0625rem] font-semibold tracking-tight text-ink">
                {benefit.title}
              </h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">
                {benefit.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
