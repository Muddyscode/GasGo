import type { Metadata } from "next";
import { DispatchBoard } from "@/components/admin/DispatchBoard";

export const metadata: Metadata = {
  title: "Dispatch — GasGo",
  description: "Plant dispatch board for GasGo orders.",
};

export default function AdminPage() {
  return <DispatchBoard />;
}
