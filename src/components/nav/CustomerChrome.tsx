"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { CustomerNavProvider } from "@/components/nav/customer-nav";
import { TopNav } from "@/components/nav/TopNav";

export function CustomerChrome({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CustomerNavProvider>
        <div className="gasgo-shell relative mx-auto flex h-dvh max-h-dvh w-full max-w-lg flex-col overflow-hidden md:max-w-2xl lg:max-w-5xl">
          <TopNav />
          <div className="page-enter flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
        </div>
      </CustomerNavProvider>
    </AuthProvider>
  );
}
