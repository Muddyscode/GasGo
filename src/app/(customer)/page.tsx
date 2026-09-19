import type { Metadata } from "next";
import { HomeHero } from "@/components/home/HomeHero";
import { getMockProfile } from "@/data/profile";

export const metadata: Metadata = {
  title: "GasGo",
  description: "Know your gas. Refill before you run out.",
};

export default function HomePage() {
  const profile = getMockProfile();

  return <HomeHero firstName={profile.firstName} />;
}
