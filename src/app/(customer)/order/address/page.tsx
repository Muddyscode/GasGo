import type { Metadata } from "next";
import { AddressDeliveryForm } from "@/components/order/AddressDeliveryForm";

export const metadata: Metadata = {
  title: "Delivery details — GasGo",
  description: "Choose a Port Harcourt address, handover, and return window.",
};

export default function AddressPage() {
  return <AddressDeliveryForm />;
}
