import Image from "next/image";

type Scene = {
  src: string;
  alt: string;
  title: string;
  body: string;
};

const SCENES: readonly Scene[] = [
  {
    src: "/images/scene-family.jpg",
    alt: "A Port Harcourt family sharing an evening pot of jollof, a filled gas cylinder by the kitchen door.",
    title: "Households",
    body: "One Sunday-jollof pot that never runs dry. We collect the empty, refill at the plant, and bring it back full — Diobu to Eliozu.",
  },
  {
    src: "/images/scene-chef.jpg",
    alt: "A chef tending large pots over a gas flame in a Port Harcourt food-business kitchen.",
    title: "Food businesses & chefs",
    body: "Buka, restaurant, or culinary school — keep every burner lit. Fill by the kg and get a same-day return so service never stops.",
  },
  {
    src: "/images/scene-estate.jpg",
    alt: "An estate security officer receiving a sealed gas cylinder at a Port Harcourt estate gate at dusk.",
    title: "Estates & offices",
    body: "Leave the empty with security at the gate. Estate and corporate accounts get the same sealed, weighed, plant-refilled cylinder back.",
  },
];

export function AudienceScenes() {
  return (
    <section className="mt-[var(--mkt-section-space,3.5rem)] scroll-mt-6" aria-labelledby="audiences-heading">
      <p className="mkt-kicker">Who we serve</p>
      <h2
        id="audiences-heading"
        className="mkt-display mt-2 font-display text-[1.625rem] font-semibold tracking-tight text-ink md:text-[2rem]"
      >
        One service, every kitchen in Port Harcourt
      </h2>
      <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-ink-muted">
        Households, food businesses, estates — the same sealed loop and the same live rate.
        We just meet you where you cook.
      </p>

      <ul className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {SCENES.map((scene) => (
          <li key={scene.title}>
            <div className="mkt-scene-frame relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface-muted ring-1 ring-border">
              <Image
                src={scene.src}
                alt={scene.alt}
                fill
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, calc(100vw - 2.5rem)"
                className="mkt-scene-image object-cover"
              />
            </div>
            <h3 className="mt-3.5 font-display text-[1.0625rem] font-semibold tracking-tight text-ink">
              {scene.title}
            </h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">{scene.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
