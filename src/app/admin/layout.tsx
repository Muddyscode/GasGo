import type { ReactNode } from "react";
import { AdminGate } from "@/components/admin/AdminGate";
import { BrandMark } from "@/components/brand/BrandMark";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh w-full bg-surface-muted text-ink">
      <div className="border-b border-border bg-surface">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 md:px-6">
          <BrandMark href="/admin" />
          <ThemeToggle />
        </div>
      </div>
      <AdminGate>{children}</AdminGate>
    </div>
  );
}
