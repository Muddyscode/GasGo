"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthWorld } from "@/components/auth/AuthWorld";
import { BrandMark } from "@/components/brand/BrandMark";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { buttonClassName } from "@/components/ui/button";
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
  const heading = mode === "login" ? "Welcome back" : "Create your account";

  function continueDemo() {
    signIn(DEMO_SESSION_USER);
    router.push("/");
  }

  return (
    <div className="grid min-h-dvh w-full grid-cols-1 lg:grid-cols-2">
      <AuthWorld compact className="lg:hidden" />
      <AuthWorld className="hidden lg:block" />

      <section className="relative flex flex-col bg-surface px-5 py-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-3">
          <BrandMark />
          <ThemeToggle />
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
          <p className="text-[13px] font-medium text-brand-green">
            Port Harcourt plant refill
          </p>
          <h1 className="mt-2 font-display text-[2rem] font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-[2.4rem]">
            {heading}
          </h1>
          <p className="mt-2 max-w-[36ch] text-[15px] leading-relaxed text-ink-muted">
            Mock auth for now — signing in never clears a fill you already drafted.
          </p>

          <button
            type="button"
            onClick={continueDemo}
            className={buttonClassName({ variant: "primary", size: "lg" }, "mt-8")}
          >
            Continue with demo account
          </button>

          <p className="mt-5 text-center text-sm text-ink-muted">
            {mode === "login" ? "Need an account?" : "Already have an account?"}{" "}
            <Link href={otherHref} className="font-semibold text-brand-green">
              {otherLabel}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
