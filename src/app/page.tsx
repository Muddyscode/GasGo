import type { Metadata } from "next";
import { HomeHero } from "@/components/home/HomeHero";

export const metadata: Metadata = {
  title: "GasGo",
  description: "Know your gas. Refill before you run out.",
};

export default function HomePage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-surface text-ink">
      <header className="sticky top-0 z-20 bg-surface/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="flex h-14 items-center justify-center px-5">
          <h1 className="text-[15px] font-semibold tracking-tight text-ink">
            GasGo
          </h1>
        </div>
      </header>
      <HomeHero />
    </div>
  );
}
