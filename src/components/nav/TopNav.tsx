"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { NavActions } from "@/components/nav/NavActions";
import { useCustomerNavState } from "@/components/nav/customer-nav";
import { navForPathname } from "@/lib/customer-routes";
import { cn } from "@/lib/utils";

export function TopNav() {
  const pathname = usePathname();
  const { config } = useCustomerNavState();
  const fallback = navForPathname(pathname);
  const title = config.title ?? fallback?.title;
  const backHref = config.backHref ?? fallback?.backHref;
  const backLabel = config.backLabel ?? fallback?.backLabel;
  const isHome = pathname === "/";
  const showBack = Boolean(backHref) && !isHome;

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-white/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-lg items-center justify-between gap-2 px-2 md:max-w-2xl md:px-4 lg:h-16 lg:max-w-5xl lg:px-6">
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
