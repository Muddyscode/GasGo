import { Lock, MapPin, MessageCircle } from "lucide-react";
import { cardClassName } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TRUST = [
  {
    icon: Lock,
    title: "Pay before pickup",
    body: "Paystack in full. We only collect the empty once payment lands.",
  },
  {
    icon: MapPin,
    title: "Port Harcourt tracking",
    body: "Follow collect, plant refill, and return from one timeline.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp support",
    body: "A real person if the rider is late or the gate is locked.",
  },
] as const;

export function TrustRow() {
  return (
    <section className="mt-12" aria-label="Why GasGo">
      <div className="grid gap-3 md:grid-cols-3">
        {TRUST.map((item) => (
          <article key={item.title} className={cn(cardClassName, "px-4 py-4")}>
            <item.icon className="size-4 text-brand-green" strokeWidth={2} />
            <h3 className="mt-3 text-[15px] font-semibold tracking-tight text-ink">
              {item.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
