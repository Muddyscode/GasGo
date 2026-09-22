import type { Metadata } from "next";
import { KeyBenefits } from "@/components/marketing";

export const metadata: Metadata = {
  title: "Why GasGo",
  description:
    "Pay once for collect, plant refill, and return. Your cylinder, your fill, Port Harcourt only.",
};

export default function WhyGasGoPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 pb-20 pt-4 md:px-8 lg:max-w-6xl lg:px-10">
      <KeyBenefits />
    </div>
  );
}
