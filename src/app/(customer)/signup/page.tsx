import type { Metadata } from "next";
import { AuthEntryView } from "@/components/auth/AuthEntryView";

export const metadata: Metadata = {
  title: "Sign up · GasGo",
  description: "Create a GasGo account. Your Port Harcourt fill draft stays on this device.",
};

export default function SignupPage() {
  return <AuthEntryView mode="signup" otherHref="/login" />;
}
