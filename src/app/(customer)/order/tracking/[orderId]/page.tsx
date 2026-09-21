import type { Metadata } from "next";
import { OrderTracking } from "@/components/order/OrderTracking";

export const metadata: Metadata = {
  title: "Track order · GasGo",
  description: "Follow your GasGo cylinder from collect to plant refill to return.",
};

type TrackingPageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function TrackingPage({ params }: TrackingPageProps) {
  const { orderId } = await params;
  const decoded = decodeURIComponent(orderId);

  return <OrderTracking orderId={decoded} />;
}
