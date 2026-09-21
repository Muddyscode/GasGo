import type { Metadata } from "next";
import { HomeGate } from "@/components/home/HomeGate";

export const metadata: Metadata = {
  title: "GasGo",
  description:
    "Port Harcourt cooking gas: we collect your empty cylinder, refill it at the plant, and return it filled. Pay before pickup.",
};

export default function HomePage() {
  return <HomeGate />;
}
