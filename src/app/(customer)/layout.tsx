import type { ReactNode } from "react";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-dvh w-full text-ink">{children}</div>;
}
