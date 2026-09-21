import type { Metadata } from "next";
import { FillComposer } from "@/components/order/FillComposer";

export const metadata: Metadata = {
  title: "Your fill · GasGo",
  description:
    "Choose cylinder capacity and fill mode for a Port Harcourt plant refill.",
};

export default function CylinderPage() {
  return <FillComposer />;
}
