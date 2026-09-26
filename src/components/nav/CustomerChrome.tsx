"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { CustomerNavProvider } from "@/components/nav/customer-nav";
import { TopNav } from "@/components/nav/TopNav";
import { cn } from "@/lib/utils";
import { useSession } from "@/stores/session";

export function CustomerChrome({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CustomerNavProvider>
        <ChromeFrame>{children}</ChromeFrame>
      </CustomerNavProvider>
    </AuthProvider>
  );
}

function ChromeFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const user = useSession((state) => state.user);
  const isAuth = pathname === "/login" || pathname === "/signup";
  const isInnerMarketing =
    pathname === "/how-it-works" ||
    pathname === "/zones" ||
    pathname === "/why";
  // Guest home is marketing. Signed-in `/` is AppHome — do not wrap it.
  const marketingSurface =
    !isAuth && (isInnerMarketing || (pathname === "/" && !user));
  const marketingNav = Boolean(!user && marketingSurface);

  if (isAuth) {
    return (
      <div className="relative min-h-dvh w-full max-w-none bg-surface">{children}</div>
    );
  }

  return (
    <div
      className={cn(
        "relative mx-auto flex h-dvh max-h-dvh w-full flex-col overflow-hidden",
        marketingSurface
          ? "gasgo-marketing max-w-none"
          : "gasgo-shell w-full max-w-none bg-surface",
      )}
    >
      <TopNav marketing={marketingNav} />
      <div
        className={cn(
          "page-enter gasgo-chrome-scroll flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain",
          marketingSurface && "overflow-x-hidden",
        )}
      >
        {children}
      </div>
    </div>
  );
}
