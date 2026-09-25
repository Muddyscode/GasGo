const TRUST = [
  {
    title: "Pay before pickup",
    body: "Paystack in full. We only collect the empty once payment lands.",
  },
  {
    title: "Port Harcourt tracking",
    body: "Follow collect, plant refill, and return from one timeline.",
  },
  {
    title: "WhatsApp support",
    body: "A real person if the rider is late or the gate is locked.",
  },
] as const;

export function TrustRow() {
  return (
    <section id="trust" className="mt-12" aria-label="Why GasGo">
      <ul className="grid gap-8 md:grid-cols-3">
        {TRUST.map((item) => (
          <li key={item.title}>
            <h3 className="font-display text-[1.0625rem] font-semibold tracking-tight text-ink">
              {item.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
