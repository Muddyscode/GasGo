import type { Metadata } from "next";
import { HowItWorksPageView } from "@/components/marketing/HowItWorksPageView";

export const metadata: Metadata = {
  title: "How it works · GasGo",
  description:
    "Collect empty, plant refill, return full. Port Harcourt cooking gas — pay before pickup.",
};

export default function HowItWorksPage() {
  return <HowItWorksPageView />;
}
