import type { Metadata } from "next";
import { AddressDeliveryForm } from "@/components/order/AddressDeliveryForm";
import { parseOrderQuery } from "@/lib/order-query";

export const metadata: Metadata = {
  title: "Delivery details · GasGo",
  description: "Choose a Lagos address, handover, and delivery window.",
};

type AddressPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AddressPage({ searchParams }: AddressPageProps) {
  const query = parseOrderQuery(await searchParams);

  return (
    <AddressDeliveryForm
      cylinderId={query.cylinderId}
      initialAddress={query.address}
      initialPresenceId={query.presenceId}
      initialWindowId={query.windowId}
      initialNotes={query.notes}
    />
  );
}
