import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin login · GasGo",
  description: "Demo PIN gate for the GasGo plant dispatch board.",
};

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
