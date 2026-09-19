import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-md bg-surface text-ink md:max-w-3xl lg:max-w-5xl">
      {children}
    </div>
  );
}
