import type { Metadata } from "next";
import { AppNavbar } from "@/components/nav/AppNavbar";
import { HomeHero } from "@/components/home/HomeHero";
import { AppCanvas } from "@/components/ui/PageShell";

export const metadata: Metadata = {
  title: "GasGo",
  description: "Know your gas. Refill before you run out.",
};

export default function HomePage() {
  return (
    <AppCanvas>
      <AppNavbar />
      <HomeHero />
    </AppCanvas>
  );
}
