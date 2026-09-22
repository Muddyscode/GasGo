import type { Metadata } from "next";
import { WhyPageView } from "@/components/marketing/WhyPageView";

export const metadata: Metadata = {
  title: "Why GasGo",
  description:
    "Pay once for collect, plant refill, and return. Your cylinder, your fill, Port Harcourt only.",
};

export default function WhyGasGoPage() {
  return <WhyPageView />;
}
