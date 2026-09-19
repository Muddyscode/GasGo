import type { Metadata } from "next";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { HomeHero } from "@/components/home/HomeHero";

export const metadata: Metadata = {
  title: "GasGo",
  description: "Know your gas. Refill before you run out.",
};

export default function HomePage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-surface text-ink">
      <header className="sticky top-0 z-20 bg-surface/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="relative flex h-14 items-center justify-center px-2">
          <h1 className="text-[15px] font-semibold tracking-tight text-ink">
            GasGo
          </h1>
          <Link
            href="/profile"
            aria-label="Profile"
            className="absolute right-2 inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors duration-150 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
          >
            <UserRound className="size-5" strokeWidth={1.75} />
          </Link>
        </div>
      </header>
      <HomeHero />
    </div>
  );
}
