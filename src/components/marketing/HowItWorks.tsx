import Image from "next/image";
import { FadeLift, fadeLiftDelayMs } from "@/components/motion/FadeLift";
import { cardClassName } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const BEATS = [
  {
    step: "01",
    title: "Collect",
    body: "A rider picks up your empty cylinder from your Port Harcourt address. Nothing is filled at the door.",
    image: "/images/cooking-gas-cylinders.png",
    alt: "Empty cooking gas cylinders ready for collection",
  },
  {
    step: "02",
    title: "Plant refill",
    body: "Your cylinder is refilled offsite at our plant — sealed, weighed, and checked before it comes back.",
    image: "/images/cooking-gas-filling-point.png",
    alt: "Cylinder being refilled at the plant",
  },
  {
    step: "03",
    title: "Return",
    body: "The filled cylinder is returned to you. Track the loop, and ping WhatsApp if you need a hand.",
    image: "/images/cooking-gas-trolley.jpg",
    alt: "Filled cylinder on a trolley heading back to a customer",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mt-14 scroll-mt-20">
      <FadeLift>
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-green">
          How it works
        </p>
        <h2 className="mt-2 text-[24px] font-semibold tracking-tight text-ink md:text-[28px]">
          Collect → Plant refill → Return
        </h2>
        <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-ink-muted">
          Three honest beats. We never fill cooking gas on your street in Port Harcourt.
        </p>
      </FadeLift>

      <ol className="mt-6 grid gap-4 md:grid-cols-3">
        {BEATS.map((beat, index) => (
          <li key={beat.step}>
            <FadeLift delayMs={fadeLiftDelayMs(index)}>
              <div className={cn(cardClassName, "overflow-hidden p-0 shadow-gasgo-md")}>
                <div className="relative h-36">
                  <Image
                    src={beat.image}
                    alt={beat.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-ink shadow-gasgo-soft">
                    {beat.step}
                  </span>
                </div>
                <div className="px-4 py-4">
                  <h3 className="text-[17px] font-semibold tracking-tight text-ink">
                    {beat.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{beat.body}</p>
                </div>
              </div>
            </FadeLift>
          </li>
        ))}
      </ol>
    </section>
  );
}
