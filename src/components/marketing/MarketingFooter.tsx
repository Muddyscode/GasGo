import Link from "next/link";
import { BrandMark } from "@/components/brand/BrandMark";
import { whatsappHref } from "@/config/whatsapp";

const FOOT_LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/zones", label: "Zones" },
  { href: "/why", label: "Why GasGo" },
  { href: "/order/cylinder", label: "Order" },
  { href: "/login", label: "Sign in" },
  { href: "/signup", label: "Sign up" },
] as const;

export function MarketingFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-surface-muted">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 py-10 md:px-8 lg:max-w-6xl lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <BrandMark />
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Port Harcourt cooking gas. Collect empty, plant refill, return full.
              Pay before pickup. Auto-refill is Coming soon.
            </p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-2.5 text-sm font-semibold text-ink">
            {FOOT_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-brand-green"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={whatsappHref("Hi GasGo, I have a question before I order.")}
              className="transition-colors hover:text-brand-green"
            >
              WhatsApp
            </a>
          </nav>
        </div>
        <div className="flex flex-col gap-2 border-t border-border pt-5 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Garden City only · Port Harcourt plant refill</p>
          <p>Zone fees shown before pay · never above ₦1,200</p>
        </div>
      </div>
    </footer>
  );
}
