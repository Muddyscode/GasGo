import type { Metadata } from "next";
import { CheckoutView } from "@/components/order/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout — GasGo",
  description: "Review your GasGo order and pay with Paystack.",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
