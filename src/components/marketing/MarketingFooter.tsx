import type { ReactNode } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/brand/BrandMark";
import { ZONE_FEE_MAX_NGN } from "@/config/pricing";
import { whatsappHref } from "@/config/whatsapp";
import { formatNaira } from "@/lib/money";

const PRODUCT_LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/zones", label: "Zones" },
  { href: "/why", label: "Why GasGo" },
  { href: "/order/cylinder", label: "Order a refill" },
] as const;

export function MarketingFooter() {
  return (
    <footer className="marketing-footer mt-16">
      <FooterBand />
      <div className="bg-[#0B1F14] text-white">
        <div className="mx-auto w-full max-w-5xl px-5 pb-10 pt-8 md:px-8 lg:max-w-6xl lg:px-10">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xs">
              <BrandMark inverted />
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                Port Harcourt cooking gas. Collect empty, plant refill, return
                full. Pay before pickup. Auto-refill · Coming soon.
              </p>
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
                  className="transition-colors hover:text-[#FFDF22]"
                >
                  WhatsApp
                </a>
              </FooterCol>
            </nav>
          </div>
          <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
            <p>Garden City only · Port Harcourt plant refill</p>
            <p>Zone fees shown before pay · never above {formatNaira(ZONE_FEE_MAX_NGN)}</p>
          </div>
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
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#FFDF22]">{title}</p>
      <div className="mt-3 flex flex-col gap-2 text-sm font-semibold">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="transition-colors hover:text-[#FFDF22]">
      {children}
    </Link>
  );
}

function FooterBand() {
  return (
    <div className="marketing-footer__band relative h-[7.5rem] overflow-hidden bg-[#1CA350] sm:h-36 md:h-40" aria-hidden="true">
      <svg
        viewBox="0 0 1440 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMax slice"
      >
        <path d="M0 72C180 40 320 88 520 58C740 24 900 86 1120 52C1280 28 1360 44 1440 36V160H0V72Z" fill="#147A3E" />
        <path d="M0 104C200 82 380 118 620 96C860 74 1040 120 1440 90V160H0V104Z" fill="#0F5C30" />
        <g transform="translate(70 38)">
          <rect x="0" y="28" width="86" height="36" rx="4" fill="#0B1F14" />
          <rect x="8" y="36" width="16" height="12" rx="2" fill="#FFFFFF" fillOpacity="0.28" />
          <rect x="30" y="36" width="16" height="12" rx="2" fill="#FFFFFF" fillOpacity="0.18" />
          <rect x="10" y="0" width="18" height="28" rx="9" fill="#F7FAF8" stroke="#0B1F14" strokeWidth="1.6" />
          <rect x="34" y="0" width="18" height="28" rx="9" fill="#F7FAF8" stroke="#0B1F14" strokeWidth="1.6" />
          <rect x="58" y="0" width="18" height="28" rx="9" fill="#F7FAF8" stroke="#0B1F14" strokeWidth="1.6" />
        </g>
        <g transform="translate(1180 8)">
          <path d="M18 28 L32 4 L40 14 L48 4 L62 28 V98 H18 Z" fill="#0B1F14" />
          <path d="M32 4 L40 14 L48 4" fill="none" stroke="#FFDF22" strokeWidth="2.4" />
          <rect x="8" y="98" width="64" height="12" rx="2" fill="#F7FAF8" />
        </g>
        <g transform="translate(430 46)">
          <rect x="10" y="22" width="36" height="28" rx="3" fill="#8B5A2B" />
          <path d="M4 24 L28 4 L52 24H4Z" fill="#F4EFE3" />
          <rect x="22" y="30" width="10" height="20" fill="#147A3E" />
        </g>
        <g transform="translate(980 52)">
          <rect x="18" y="16" width="6" height="36" rx="2" fill="#6B4226" />
          <path d="M21 18C8 8 6 -4 14 -6C18 6 21 10 21 18Z" fill="#FFDF22" />
          <path d="M21 18C34 6 42 -4 36 -8C28 4 24 12 21 18Z" fill="#FFFFFF" fillOpacity="0.85" />
        </g>
        <path d="M0 132h1440v28H0Z" fill="#2A332E" />
        <path d="M-20 146h1480" stroke="#FFDF22" strokeWidth="5" strokeDasharray="28 18" strokeLinecap="round" />
        <g transform="translate(620 88)">
          <ellipse cx="90" cy="52" rx="78" ry="7" fill="#0B1F14" opacity="0.28" />
          <rect x="16" y="10" width="118" height="32" rx="7" fill="#FFDF22" />
          <rect x="16" y="22" width="118" height="4" fill="#1CA350" />
          <rect x="130" y="14" width="40" height="28" rx="5" fill="#0B1F14" />
          <rect x="138" y="18" width="20" height="12" rx="2" fill="#FFFFFF" fillOpacity="0.35" />
          <rect x="36" y="14" width="14" height="18" rx="5" fill="#FFFFFF" />
          <circle cx="48" cy="48" r="10" fill="#0B1F14" />
          <circle cx="48" cy="48" r="4" fill="#FFDF22" />
          <circle cx="148" cy="48" r="10" fill="#0B1F14" />
          <circle cx="148" cy="48" r="4" fill="#FFDF22" />
        </g>
        <g transform="translate(280 108)">
          <rect x="4" y="0" width="5" height="5" rx="1" fill="#0B1F14" />
          <rect x="0" y="5" width="13" height="22" rx="6" fill="#FFFFFF" />
          <rect x="22" y="0" width="5" height="5" rx="1" fill="#0B1F14" />
          <rect x="18" y="5" width="13" height="22" rx="6" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
}
