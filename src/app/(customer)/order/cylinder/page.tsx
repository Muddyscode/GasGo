import type { Metadata } from "next";
import { CylinderSelection } from "@/components/order/CylinderSelection";

export const metadata: Metadata = {
  title: "Select cylinder · GasGo",
  description: "Choose a cooking gas cylinder size for delivery.",
};

export default function CylinderPage() {
  return <CylinderSelection />;
}
