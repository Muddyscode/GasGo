import type { ReactNode } from "react";
import { BrandMark } from "@/components/brand/BrandMark";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-lg bg-white/80 text-ink shadow-gasgo-soft md:my-4 md:min-h-[calc(100dvh-2rem)] md:max-w-2xl md:rounded-[1.75rem] md:border md:border-border">
      <div className="flex items-center px-3 pt-[max(0.35rem,env(safe-area-inset-top))] md:px-4">
        <BrandMark href="/admin" />
      </div>
      {children}
    </div>
  );
}
