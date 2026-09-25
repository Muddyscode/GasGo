import type { Metadata } from "next";
import { AuthEntryView } from "@/components/auth/AuthEntryView";
import { firstParam } from "@/lib/order-query";
import { safeAppPath } from "@/lib/safe-app-path";

export const metadata: Metadata = {
  title: "Sign in — GasGo",
  description: "Sign in to GasGo. Your Port Harcourt fill draft stays on this device.",
};

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  return (
    <AuthEntryView
      mode="login"
      otherHref="/signup"
      nextHref={safeAppPath(firstParam(params.next))}
    />
  );
}
