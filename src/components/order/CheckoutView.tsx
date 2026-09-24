"use client";

import { useEffect, useRef, useState } from "react";
import { useAuthModal } from "@/components/auth/AuthProvider";
import { CheckoutEmpty } from "@/components/order/CheckoutEmpty";
import { CheckoutSummary } from "@/components/order/CheckoutSummary";
import { OrderHeader } from "@/components/order/OrderHeader";
import { PaystackPayButton } from "@/components/order/PaystackPayButton";
import { PriceBreakdown } from "@/components/order/PriceBreakdown";
import { DeliveryLoading } from "@/components/motion";
import { PageBody, PageFrame, PageTitle } from "@/components/ui/page";
import { getPresenceById, getWindowById } from "@/config/delivery";
import { toOrderQuote } from "@/config/pricing";
import { useOrderDraft } from "@/stores/order-draft";
import { useSession } from "@/stores/session";

export function CheckoutView() {
  const [hydrated, setHydrated] = useState(false);
  const address = useOrderDraft((state) => state.address);
  const presenceId = useOrderDraft((state) => state.presenceId);
  const windowId = useOrderDraft((state) => state.windowId);
  const notes = useOrderDraft((state) => state.notes);
  const fulfillmentMode = useOrderDraft((state) => state.fulfillmentMode);
  const pickupDate = useOrderDraft((state) => state.pickupDate);
  const returnDate = useOrderDraft((state) => state.returnDate);
  const isReadyForCheckout = useOrderDraft((state) => state.isReadyForCheckout);
  const quote = useOrderDraft((state) => state.quote);
  const user = useSession((state) => state.user);
  const { requestAuth } = useAuthModal();
  const askedForAuth = useRef(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const started = Date.now();
    const reveal = () => {
      const hold = Math.max(0, 480 - (Date.now() - started));
      timeout = globalThis.setTimeout(() => setHydrated(true), hold);
    };

    if (useOrderDraft.persist.hasHydrated()) reveal();
    const unsub = useOrderDraft.persist.onFinishHydration(reveal);
    return () => {
      unsub();
      globalThis.clearTimeout(timeout);
    };
  }, []);

  const ready = hydrated && isReadyForCheckout();

  useEffect(() => {
    if (!hydrated || !ready || user || askedForAuth.current) return;
    askedForAuth.current = true;
    requestAuth("/order/checkout");
  }, [hydrated, ready, user, requestAuth]);

  if (!hydrated) {
    return (
      <PageFrame>
        <OrderHeader
          title="Checkout"
          backHref="/order/address"
          backLabel="Back to delivery details"
        />
        <DeliveryLoading label="Preparing checkout…" />
      </PageFrame>
    );
  }

  const live = quote();
  const presence = getPresenceById(presenceId);
  const window = getWindowById(windowId);

  if (
    !ready ||
    !address ||
    !window ||
    live.fillKg <= 0 ||
    (fulfillmentMode !== "hub" && !presence)
  ) {
    return <CheckoutEmpty />;
  }

  return (
    <PageFrame>
      <OrderHeader
        title="Checkout"
        backHref="/order/address"
        backLabel="Back to delivery details"
      />

      <PageBody className="pb-4">
        <PageTitle
          eyebrow={fulfillmentMode === "hub" ? "Hub self-collect" : "Door-to-door"}
          subtitle={
            fulfillmentMode === "hub"
              ? "Confirm the plant fill and collection dates, then pay in full. This pre-order holds your yard slot — no walk-ins."
              : "Confirm the plant fill, address, and zone transport, then pay in full before we collect the empty. Nothing is filled at your door."
          }
        >
          Review and pay
        </PageTitle>

        <div className="lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="text-[13px] font-medium text-ink-muted">Your order</p>
            <CheckoutSummary
              quote={live}
              address={address}
              presence={presence}
              window={window}
              notes={notes}
              fulfillmentMode={fulfillmentMode}
              pickupDate={pickupDate}
              returnDate={returnDate}
            />
          </div>
          <aside className="hidden lg:col-span-5 lg:block">
            <div className="lg:sticky lg:top-8">
              <PriceBreakdown quote={toOrderQuote(live)} fulfillmentMode={fulfillmentMode} />
            </div>
          </aside>
        </div>
      </PageBody>

      <PaystackPayButton quote={toOrderQuote(live)} />
    </PageFrame>
  );
}
