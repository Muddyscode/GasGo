import type { Metadata } from "next";
import { OrderDetailView } from "@/components/profile/OrderDetailView";

export const metadata: Metadata = {
  title: "Order · GasGo",
  description: "Details for a past GasGo refill.",
};

type OrderDetailPageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function ProfileOrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { orderId } = await params;
  return <OrderDetailView orderId={decodeURIComponent(orderId)} />;
}
