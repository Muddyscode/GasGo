"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthIdentityForm } from "@/components/auth/AuthIdentityForm";
import { AuthWorld } from "@/components/auth/AuthWorld";
import { BrandMark } from "@/components/brand/BrandMark";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";
import { DEMO_SESSION_USER } from "@/data/profile";
import { useOrderDraft } from "@/stores/order-draft";
import { useSession, type SessionUser } from "@/stores/session";

type AuthEntryViewProps = {
  mode: "login" | "signup";
  otherHref: "/login" | "/signup";
  nextHref?: string | null;
};

export function AuthEntryView({ mode, otherHref, nextHref }: AuthEntryViewProps) {
  const router = useRouter();
  const signIn = useSession((state) => state.signIn);
  const otherLabel = otherHref === "/signup" ? "Sign up" : "Sign in";
  const heading = mode === "login" ? "Welcome back" : "Create your account";
  const submitLabel = mode === "login" ? "Sign in" : "Create account";
  const otherWithNext = nextHref
    ? `${otherHref}?next=${encodeURIComponent(nextHref)}`
    : otherHref;

  function enter(user: SessionUser) {
    signIn(user);
    if (nextHref) {
      router.push(nextHref);
      return;
    }
    if (useOrderDraft.getState().isReadyForCheckout()) {
      router.push("/order/checkout");
      return;
    }
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
          <p className="text-[13px] font-semibold text-ink">
            Port Harcourt plant refill
          </p>
          <h1 className="mt-2 font-display text-[2rem] font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-[2.4rem]">
            {heading}
          </h1>
          <p className="mt-2 max-w-[36ch] text-[15px] leading-relaxed text-ink-muted">
            Signing in keeps any fill you already drafted. Your details stay on this device.
          </p>

          <div className="mt-7">
            <AuthIdentityForm submitLabel={submitLabel} onComplete={enter} />

            <div className="my-4 flex items-center gap-3 text-[12px] font-medium text-ink-muted">
              <span className="h-px flex-1 bg-border" />
              or
              <span className="h-px flex-1 bg-border" />
            </div>

            <button
              type="button"
              onClick={() => enter(DEMO_SESSION_USER)}
              className={cn(
                "flex h-12 min-h-12 w-full items-center justify-center rounded-2xl",
                "border border-border bg-surface-muted text-[15px] font-semibold text-ink",
                "transition-[transform,background-color] duration-150",
                "ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.985]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40",
              )}
            >
              Continue with demo account
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-ink-muted">
            {mode === "login" ? "Need an account?" : "Already have an account?"}{" "}
            <Link href={otherWithNext} className="font-semibold text-brand-green underline-offset-4 hover:underline">
              {otherLabel}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
