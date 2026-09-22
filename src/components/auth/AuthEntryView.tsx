"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { buttonClassName } from "@/components/ui/button";
import { PageBody, PageFrame, PageTitle } from "@/components/ui/page";
import { DEMO_SESSION_USER } from "@/data/profile";
import { useSession } from "@/stores/session";

type AuthEntryViewProps = {
  mode: "login" | "signup";
  otherHref: "/login" | "/signup";
};

export function AuthEntryView({ mode, otherHref }: AuthEntryViewProps) {
  const router = useRouter();
  const signIn = useSession((state) => state.signIn);
  const otherLabel = otherHref === "/signup" ? "Sign up" : "Sign in";

  function continueDemo() {
    signIn(DEMO_SESSION_USER);
    router.push("/");
  }

  return (
    <PageFrame>
      <PageBody className="pt-10">
        <PageTitle
          eyebrow="GasGo account"
          subtitle="Mock auth for now — signing in never clears a fill you already drafted. Leonardo is building this page."
        >
          {mode === "login" ? "Sign in" : "Create an account"}
        </PageTitle>
        <button
          type="button"
          onClick={continueDemo}
          className={buttonClassName({ variant: "primary", size: "lg" })}
        >
          Continue with demo account
        </button>
        <p className="mt-4 text-sm text-ink-muted">
          {mode === "login" ? "Need an account?" : "Already have an account?"}{" "}
          <Link href={otherHref} className="font-semibold text-brand-green">
            {otherLabel}
          </Link>
        </p>
      </PageBody>
    </PageFrame>
  );
}
