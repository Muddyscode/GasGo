import type { Metadata } from "next";
import { OrderDetailView } from "@/components/admin/OrderDetailView";

export const metadata: Metadata = {
  title: "Order — GasGo Dispatch",
  description: "Update a GasGo delivery stage.",
};

type OrderDetailPageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderId } = await params;
  return <OrderDetailView orderId={decodeURIComponent(orderId)} />;
}
