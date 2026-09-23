import type { ReactNode } from "react";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { cn } from "@/lib/utils";

export function MarketingPageFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex flex-1 flex-col bg-surface">
      <div
        className={cn(
          "mx-auto w-full max-w-5xl flex-1 px-5 pb-8 pt-8 md:px-8 md:pt-12 lg:max-w-6xl lg:px-10",
          className,
        )}
      >
        {children}
      </div>
      <MarketingFooter />
    </div>
  );
}
