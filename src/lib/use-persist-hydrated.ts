"use client";

import { useEffect, useState } from "react";
import { useOrderDraft } from "@/stores/order-draft";
import { useSession } from "@/stores/session";

/** Avoid SSR/client drift from zustand persist (session + gasgo-order-draft). */
export function usePersistHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const done = () => {
      if (useOrderDraft.persist.hasHydrated() && useSession.persist.hasHydrated()) {
        setHydrated(true);
      }
    };
    done();
    const unsubDraft = useOrderDraft.persist.onFinishHydration(done);
    const unsubSession = useSession.persist.onFinishHydration(done);
    return () => {
      unsubDraft();
      unsubSession();
    };
  }, []);

  return hydrated;
}
