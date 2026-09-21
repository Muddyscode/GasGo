"use client";

import { useEffect, useState } from "react";
import { AppHome } from "@/components/home/AppHome";
import { MarketingLanding } from "@/components/marketing";
import { DeliveryTruck } from "@/components/motion/DeliveryTruck";
import { PageBody, PageFrame } from "@/components/ui/page";
import { useSession } from "@/stores/session";

export function HomeGate() {
  const user = useSession((state) => state.user);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const finish = () => setHydrated(true);
    // Subscribe first — otherwise persist can finish between the hasHydrated()
    // check and onFinishHydration(), leaving the marketing landing stuck.
    const unsub = useSession.persist.onFinishHydration(finish);
    if (useSession.persist.hasHydrated()) finish();
    const fallback = window.setTimeout(finish, 80);
    return () => {
      unsub();
      window.clearTimeout(fallback);
    };
  }, []);

  if (!hydrated) {
    return (
      <PageFrame>
        <PageBody className="pt-10">
          <DeliveryTruck size="sm" label="Loading GasGo" />
        </PageBody>
      </PageFrame>
    );
  }

  return user ? <AppHome /> : <MarketingLanding />;
}
