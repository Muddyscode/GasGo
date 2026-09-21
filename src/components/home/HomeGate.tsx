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
    if (useSession.persist.hasHydrated()) finish();
    return useSession.persist.onFinishHydration(finish);
  }, []);

  if (!hydrated) {
    return (
      <PageFrame>
        <PageBody className="pt-10">
          <DeliveryTruck compact label="Loading GasGo" />
        </PageBody>
      </PageFrame>
    );
  }

  return user ? <AppHome /> : <MarketingLanding />;
}
