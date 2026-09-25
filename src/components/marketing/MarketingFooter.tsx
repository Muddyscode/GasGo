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
    <footer className="marketing-footer mt-16 border-t border-border bg-surface-muted md:mt-20">
      <div className="mx-auto w-full max-w-5xl px-5 pb-14 pt-14 md:px-8 md:pb-16 md:pt-16 lg:max-w-6xl lg:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="max-w-xs md:col-span-5 lg:col-span-6">
            <BrandMark />
            <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">
              Port Harcourt cooking gas. Collect empty, plant refill, return full.
              Nothing is filled at your door.
            </p>
            <a
              href={whatsappHref("Hi GasGo, I have a question before I order.")}
              className="mt-5 inline-block text-[13px] font-medium text-brand-green transition-colors hover:text-ink"
            >
              WhatsApp {GASGO_WHATSAPP_DISPLAY}
            </a>
          </div>
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-10 gap-y-10 md:col-span-7 lg:col-span-6"
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
                className="transition-colors hover:text-brand-green"
              >
                WhatsApp
              </a>
            </FooterCol>
          </nav>
        </div>
        <div className="mt-16 flex flex-col gap-2 text-[12px] leading-relaxed text-ink-muted sm:flex-row sm:items-center sm:justify-between">
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
      <p className="text-[12px] font-medium text-ink-muted">{title}</p>
      <div className="mt-3 flex flex-col gap-2.5 text-[13px] font-medium text-ink">
        {children}
      </div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="transition-colors hover:text-brand-green">
      {children}
    </Link>
  );
}
