import type { ReactNode } from "react";
import { CustomerChrome } from "@/components/nav/CustomerChrome";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return <CustomerChrome>{children}</CustomerChrome>;
}
