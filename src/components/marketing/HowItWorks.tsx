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

export function HowItWorks({
  flush = false,
  hideIntro = false,
}: {
  flush?: boolean;
  hideIntro?: boolean;
}) {
  return (
    <section
      id="how-it-works"
      className={flush ? "scroll-mt-6" : "mt-[var(--mkt-section-space,3.5rem)] scroll-mt-6"}
      aria-label={hideIntro ? "Collect, plant refill, return" : undefined}
    >
      {hideIntro ? null : (
        <>
          <p className="mkt-kicker">How it works</p>
          <h2 className="mkt-display mt-2 font-display text-[1.625rem] font-semibold tracking-tight text-ink md:text-[2rem]">
            We collect, refill at the plant, and return
          </h2>
          <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-ink-muted">
            Three honest beats. We never fill cooking gas on your street in Port Harcourt.
          </p>
        </>
      )}

      <ol className={`${hideIntro ? "mt-0" : "mt-8"} divide-y divide-border border-y border-border`}>
        {BEATS.map((beat) => (
          <li
            key={beat.step}
            className="grid gap-2 py-5 sm:grid-cols-[4rem_minmax(0,11rem)_1fr] sm:items-baseline sm:gap-3 sm:py-6"
          >
            <span className="font-display text-[1.625rem] font-semibold tabular-nums text-brand-green">
              {beat.step}
            </span>
            <h3 className="font-display text-[1.125rem] font-semibold tracking-tight text-ink md:text-[1.25rem]">
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
