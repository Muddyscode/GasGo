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
    <header className="z-30 shrink-0 border-b border-border/70 bg-surface/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
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
    <header className="z-40 shrink-0 border-b border-border/70 bg-surface/92 pt-[max(0.55rem,env(safe-area-inset-top))] backdrop-blur-xl">
      <div className="mx-auto flex w-full min-w-0 max-w-6xl items-center justify-between gap-1.5 px-2 py-2 min-[320px]:gap-2 min-[320px]:px-3 min-[360px]:gap-3 min-[360px]:px-4 md:px-6 lg:px-8">
        <BrandMark className="min-w-0 max-[319px]:gap-0 [&>span:last-child]:max-[319px]:hidden" />

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
                pathname === link.href ? "bg-surface-soft text-ink" : "text-ink",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/order/cylinder"
            className="mkt-cta-fill whitespace-nowrap rounded-full bg-brand-green px-3.5 py-1.5 text-white transition-colors hover:brightness-105"
          >
            Order
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <NavActions island />
          <Link
            href="/order/cylinder"
            className="mkt-cta-fill inline-flex min-h-10 shrink-0 items-center whitespace-nowrap rounded-full bg-brand-green px-2.5 py-1.5 text-white shadow-gasgo-md min-[320px]:px-3.5 min-[360px]:px-4 md:hidden"
          >
            Order
          </Link>
        </div>
      </div>
      <nav
        aria-label="Marketing sections"
        className="mkt-mobile-nav mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-3 pb-2 min-[360px]:px-4 md:hidden"
      >
        {MARKETING_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={pathname === link.href ? "page" : undefined}
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-[13px] font-semibold",
              pathname === link.href
                ? "bg-surface-soft text-ink"
                : "text-ink-muted hover:bg-surface-soft hover:text-ink",
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
