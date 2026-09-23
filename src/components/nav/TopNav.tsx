"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { NavActions } from "@/components/nav/NavActions";
import { useCustomerNavState } from "@/components/nav/customer-nav";
import { navForPathname } from "@/lib/customer-routes";
import { cn } from "@/lib/utils";

const MARKETING_LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/zones", label: "Zones" },
  { href: "/why", label: "Why GasGo" },
] as const;

export function TopNav({ marketing = false }: { marketing?: boolean }) {
  const pathname = usePathname();
  const { config } = useCustomerNavState();
  const fallback = navForPathname(pathname);
  const title = config.title ?? fallback?.title;
  const backHref = config.backHref ?? fallback?.backHref;
  const backLabel = config.backLabel ?? fallback?.backLabel;
  const isHome = pathname === "/";
  const showBack = Boolean(backHref) && !isHome;

  if (marketing) {
    return <MarketingIslandNav />;
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-surface/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-2 px-4 md:h-16 md:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-0.5">
          {showBack ? (
            <Link
              href={backHref ?? "/"}
              aria-label={backLabel ?? "Go back"}
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-full text-ink",
                "transition-[background-color,transform] duration-200",
                "hover:bg-surface-muted active:scale-[0.96]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40",
              )}
            >
              <ChevronLeft className="size-6" strokeWidth={2} />
            </Link>
          ) : (
            <BrandMark className="pl-2" />
          )}

          {showBack ? (
            <div className="min-w-0 pl-0.5">
              <p className="truncate text-[15px] font-semibold tracking-tight text-ink lg:text-base">
                {title ?? "GasGo"}
              </p>
            </div>
          ) : null}
        </div>

        <NavActions />
      </div>
    </header>
  );
}

function MarketingIslandNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-transparent pt-[max(0.55rem,env(safe-area-inset-top))]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-2 md:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <BrandMark />
          <span
            className="hidden items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 text-[12px] font-semibold text-ink shadow-gasgo-soft ring-1 ring-black/5 sm:inline-flex"
            title="Port Harcourt only"
          >
            <span className="size-2 rounded-full bg-brand-yellow ring-1 ring-ink/10" />
            PH
          </span>
        </div>

        <nav
          aria-label="Marketing"
          className="island-nav hidden items-center gap-1 rounded-full bg-surface px-2 py-1.5 shadow-gasgo-md ring-1 ring-black/5 md:flex"
        >
          {MARKETING_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[14px] font-semibold transition-colors hover:bg-surface-soft",
                pathname === link.href ? "bg-surface-soft text-brand-green" : "text-ink",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/order/cylinder"
            className="rounded-full px-3.5 py-1.5 text-[14px] font-semibold text-brand-green transition-colors hover:bg-surface-soft"
          >
            Order
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <NavActions island />
          <Link
            href="/order/cylinder"
            className="inline-flex h-10 items-center rounded-full bg-brand-green px-4 text-[13px] font-semibold text-white shadow-gasgo-md md:hidden"
          >
            Order
          </Link>
        </div>
      </div>
    </header>
  );
}
