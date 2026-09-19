import type { Metadata } from "next";
import { AddressDeliveryForm } from "@/components/order/AddressDeliveryForm";

export const metadata: Metadata = {
  title: "Delivery details · GasGo",
  description: "Choose a Lagos address, handover, and delivery window.",
};

export default function AddressPage() {
  return <AddressDeliveryForm />;
}
