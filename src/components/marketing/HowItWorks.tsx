const BEATS = [
  {
    step: "1",
    title: "Collect",
    body: "A rider picks up your empty cylinder from your Port Harcourt address. Nothing is filled at the door.",
  },
  {
    step: "2",
    title: "Plant refill",
    body: "Your cylinder is refilled offsite at our plant — sealed, weighed, and checked before it comes back.",
  },
  {
    step: "3",
    title: "Return",
    body: "The filled cylinder is returned to you. Track the loop, and ping WhatsApp if you need a hand.",
  },
] as const;

export function HowItWorks({ flush = false }: { flush?: boolean }) {
  return (
    <section
      id="how-it-works"
      className={flush ? "scroll-mt-24" : "mt-16 scroll-mt-24 lg:mt-20"}
    >
      <p className="text-[15px] font-medium text-brand-green">How it works</p>
      <h2 className="mt-2 font-display text-[28px] font-semibold tracking-tight text-ink md:text-[34px]">
        Collect → Plant refill → Return
      </h2>
      <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-ink-muted">
        Three honest beats. We never fill cooking gas on your street in Port Harcourt.
      </p>

      <ol className="mt-8 divide-y divide-border border-y border-border">
        {BEATS.map((beat) => (
          <li
            key={beat.step}
            className="grid gap-3 py-6 sm:grid-cols-[4.5rem_minmax(0,12rem)_1fr] sm:items-baseline"
          >
            <span className="font-display text-[28px] font-semibold tabular-nums text-brand-green">
              {beat.step}
            </span>
            <h3 className="font-display text-[20px] font-semibold tracking-tight text-ink">
              {beat.title}
            </h3>
            <p className="max-w-[46ch] text-[15px] leading-relaxed text-ink-muted">
              {beat.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
