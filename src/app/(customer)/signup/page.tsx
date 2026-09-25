import type { Metadata } from "next";
import { AuthEntryView } from "@/components/auth/AuthEntryView";
import { firstParam } from "@/lib/order-query";
import { safeAppPath } from "@/lib/safe-app-path";

export const metadata: Metadata = {
  title: "Sign up — GasGo",
  description: "Create a GasGo account. Your Port Harcourt fill draft stays on this device.",
};

type SignupPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  return (
    <AuthEntryView
      mode="signup"
      otherHref="/login"
      nextHref={safeAppPath(firstParam(params.next))}
    />
  );
}
