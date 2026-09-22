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
  const marketing =
    !user &&
    !isAuth &&
    (pathname === "/" ||
      pathname === "/how-it-works" ||
      pathname === "/zones" ||
      pathname === "/why");

  if (isAuth) {
    return (
      <div className="relative min-h-dvh w-full max-w-none bg-surface">{children}</div>
    );
  }

  return (
    <div
      className={cn(
        "relative mx-auto flex w-full flex-col",
        marketing
          ? "gasgo-marketing min-h-dvh max-w-none"
          : "gasgo-shell h-dvh max-h-dvh max-w-lg overflow-hidden md:max-w-2xl lg:max-w-5xl",
      )}
    >
      <TopNav marketing={marketing} />
      <div
        className={cn(
          "page-enter flex min-h-0 flex-1 flex-col",
          marketing ? "overflow-x-hidden" : "overflow-hidden",
        )}
      >
        {children}
      </div>
    </div>
  );
}
