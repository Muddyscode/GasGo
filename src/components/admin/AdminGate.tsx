"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminSession } from "@/stores/admin-session";

export function AdminGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const unlocked = useAdminSession((state) => state.unlocked);
  const [hydrated, setHydrated] = useState(false);
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    const done = () => {
      if (useAdminSession.persist.hasHydrated()) setHydrated(true);
    };
    done();
    return useAdminSession.persist.onFinishHydration(done);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isLogin && !unlocked) router.replace("/admin/login");
    if (isLogin && unlocked) router.replace("/admin");
  }, [hydrated, isLogin, unlocked, router]);

  if (!hydrated) {
    return (
      <div className="px-4 py-10 text-sm text-ink-muted">Checking admin session…</div>
    );
  }

  if (!isLogin && !unlocked) {
    return (
      <div className="px-4 py-10 text-sm text-ink-muted">Redirecting to admin login…</div>
    );
  }

  return <>{children}</>;
}
