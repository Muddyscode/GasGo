import { FadeLift, fadeLiftDelayMs } from "@/components/motion/FadeLift";
import { cardClassName } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const BEATS = [
  {
    step: "01",
    title: "Collect",
    body: "A rider picks up your empty cylinder from your Port Harcourt address. Nothing is filled at the door.",
    Scene: CollectScene,
  },
  {
    step: "02",
    title: "Plant refill",
    body: "Your cylinder is refilled offsite at our plant — sealed, weighed, and checked before it comes back.",
    Scene: PlantScene,
  },
  {
    step: "03",
    title: "Return",
    body: "The filled cylinder is returned to you. Track the loop, and ping WhatsApp if you need a hand.",
    Scene: ReturnScene,
  },
] as const;

export function HowItWorks({ flush = false }: { flush?: boolean }) {
  return (
    <section
      id="how-it-works"
      className={flush ? "scroll-mt-24" : "mt-16 scroll-mt-24 lg:mt-20"}
    >
      <FadeLift>
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-green">
          How it works
        </p>
        <h2 className="mt-2 font-display text-[28px] font-extrabold tracking-tight text-ink md:text-[34px]">
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
                <div className="relative h-40 bg-[#F1F5D8]">
                  <beat.Scene />
                  <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-ink shadow-gasgo-soft">
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

function CollectScene() {
  return (
    <svg viewBox="0 0 320 160" className="h-full w-full" aria-hidden="true">
      <rect width="320" height="160" fill="#F1F5D8" />
      <path d="M0 118h320v42H0Z" fill="#C8DC9E" />
      <rect x="18" y="48" width="90" height="70" rx="4" fill="#F4EFE3" />
      <path d="M12 52L63 18L114 52H12Z" fill="#8B5A2B" />
      <rect x="70" y="72" width="22" height="46" rx="2" fill="#147A3E" />
      <rect x="28" y="68" width="28" height="20" rx="2" fill="#7DB8A4" />
      <g transform="translate(150 58)">
        <rect x="0" y="18" width="110" height="36" rx="7" fill="#1CA350" />
        <rect x="0" y="32" width="110" height="4" fill="#FFDF22" />
        <rect x="108" y="22" width="38" height="32" rx="5" fill="#147A3E" />
        <circle cx="28" cy="58" r="10" fill="#0B1F14" />
        <circle cx="118" cy="58" r="10" fill="#0B1F14" />
        <rect x="18" y="8" width="16" height="22" rx="6" fill="#FFFFFF" />
      </g>
      <g transform="translate(128 86)">
        <rect x="5" y="0" width="6" height="6" rx="1" fill="#0B1F14" />
        <rect x="0" y="6" width="16" height="26" rx="7" fill="#FFFFFF" stroke="#0B1F14" />
      </g>
    </svg>
  );
}

function PlantScene() {
  return (
    <svg viewBox="0 0 320 160" className="h-full w-full" aria-hidden="true">
      <rect width="320" height="160" fill="#E8F3EE" />
      <rect x="24" y="70" width="180" height="64" rx="6" fill="#1CA350" />
      <rect x="24" y="70" width="180" height="12" fill="#147A3E" />
      <rect x="24" y="118" width="180" height="6" fill="#FFDF22" />
      <g transform="translate(48 28)">
        <rect x="10" y="0" width="10" height="14" rx="2" fill="#0B1F14" />
        <rect x="0" y="12" width="30" height="46" rx="14" fill="#F7FAF8" stroke="#0B1F14" strokeWidth="2" />
      </g>
      <g transform="translate(108 22)">
        <rect x="10" y="0" width="10" height="14" rx="2" fill="#0B1F14" />
        <rect x="0" y="12" width="30" height="52" rx="14" fill="#F7FAF8" stroke="#0B1F14" strokeWidth="2" />
        <path d="M30 40h36" stroke="#0B1F14" strokeWidth="3" strokeLinecap="round" />
        <circle cx="70" cy="40" r="6" fill="#FFDF22" />
      </g>
      <rect x="230" y="54" width="64" height="80" rx="6" fill="#0B1F14" />
      <rect x="242" y="68" width="40" height="22" rx="3" fill="#7DB8A4" />
      <path d="M246 118h32" stroke="#1CA350" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function ReturnScene() {
  return (
    <svg viewBox="0 0 320 160" className="h-full w-full" aria-hidden="true">
      <rect width="320" height="160" fill="#FFF6D2" />
      <rect x="18" y="86" width="70" height="48" rx="4" fill="#F4EFE3" />
      <path d="M14 88L53 58L92 88H14Z" fill="#8B5A2B" />
      <rect x="40" y="102" width="18" height="32" fill="#147A3E" />
      <g transform="translate(122 54)">
        <rect x="0" y="20" width="120" height="40" rx="8" fill="#1CA350" />
        <rect x="0" y="34" width="120" height="4" fill="#FFDF22" />
        <rect x="116" y="24" width="42" height="36" rx="6" fill="#147A3E" />
        <circle cx="32" cy="64" r="11" fill="#0B1F14" />
        <circle cx="128" cy="64" r="11" fill="#0B1F14" />
        <rect x="22" y="8" width="16" height="24" rx="6" fill="#FFFFFF" />
      </g>
      <g transform="translate(248 28)">
        <path d="M18 44c0-14-8-22-18-28 2 12 8 18 12 22 4-6 10-16 8-28 12 8 16 22 10 34Z" fill="#DC2626" />
        <path d="M16 28c2 6 0 10-4 14" stroke="#FFDF22" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}
