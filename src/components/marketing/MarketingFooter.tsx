import type { ReactNode } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/brand/BrandMark";
import { ZONE_FEE_MAX_NGN } from "@/config/pricing";
import { GASGO_WHATSAPP_DISPLAY, whatsappHref } from "@/config/whatsapp";
import { COMING_SOON_LINE } from "@/lib/marketing-greetings";
import { formatNaira } from "@/lib/money";

const PRODUCT_LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/zones", label: "Zones" },
  { href: "/why", label: "Why GasGo" },
  { href: "/order/cylinder", label: "Start a refill" },
] as const;

export function MarketingFooter() {
  return (
    <footer className="marketing-footer mt-16 bg-ink text-white">
      <div className="mx-auto w-full max-w-5xl px-5 pb-10 pt-10 md:px-8 lg:max-w-6xl lg:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xs">
            <BrandMark inverted />
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Port Harcourt cooking gas. Collect empty, plant refill, return full.
              Nothing is filled at your door.
            </p>
            <a
              href={whatsappHref("Hi GasGo, I have a question before I order.")}
              className="mt-4 inline-block text-sm font-medium text-brand-yellow transition-colors hover:text-white"
            >
              WhatsApp {GASGO_WHATSAPP_DISPLAY}
            </a>
          </div>
          <nav
            aria-label="Footer"
            className="grid flex-1 grid-cols-2 gap-x-8 gap-y-8 lg:max-w-sm"
          >
            <FooterCol title="Product">
              {PRODUCT_LINKS.map((link) => (
                <FooterLink key={link.label} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </FooterCol>
            <FooterCol title="Account">
              <FooterLink href="/login">Sign in</FooterLink>
              <a
                href={whatsappHref("Hi GasGo, I have a question before I order.")}
                className="transition-colors hover:text-brand-yellow"
              >
                WhatsApp
              </a>
            </FooterCol>
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>{COMING_SOON_LINE}</p>
          <p>
            Garden City only. Zone fees shown before pay, never above{" "}
            {formatNaira(ZONE_FEE_MAX_NGN)}.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="text-[13px] font-medium text-brand-yellow">{title}</p>
      <div className="mt-3 flex flex-col gap-2 text-sm font-medium">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="transition-colors hover:text-brand-yellow">
      {children}
    </Link>
  );
}
