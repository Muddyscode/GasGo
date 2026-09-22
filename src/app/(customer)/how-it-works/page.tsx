import type { Metadata } from "next";
import { HowItWorks } from "@/components/marketing";

export const metadata: Metadata = {
  title: "How it works · GasGo",
  description:
    "Collect empty, plant refill, return full. Port Harcourt cooking gas — pay before pickup.",
};

export default function HowItWorksPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 pb-20 pt-4 md:px-8 lg:max-w-6xl lg:px-10">
      <HowItWorks />
    </div>
  );
}
