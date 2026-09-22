import type { Metadata } from "next";
import { AuthEntryView } from "@/components/auth/AuthEntryView";

export const metadata: Metadata = {
  title: "Sign in · GasGo",
  description: "Sign in to GasGo. Your Port Harcourt fill draft stays on this device.",
};

export default function LoginPage() {
  return <AuthEntryView mode="login" otherHref="/signup" />;
}
