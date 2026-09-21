import type { Metadata } from "next";
import { HomeGate } from "@/components/home/HomeGate";

export const metadata: Metadata = {
  title: "Your refill · GasGo",
  description: "Order-first GasGo home for Port Harcourt plant refills.",
};

export default function AppPage() {
  return <HomeGate />;
}
