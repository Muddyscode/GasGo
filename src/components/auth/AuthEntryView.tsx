"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthIdentityForm } from "@/components/auth/AuthIdentityForm";
import { AuthWorld } from "@/components/auth/AuthWorld";
import { DemoPersonaPicker } from "@/components/auth/DemoPersonaPicker";
import { BrandMark } from "@/components/brand/BrandMark";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { DEFAULT_DEMO_PERSONA_ID, type DemoPersonaId } from "@/data/demo-personas";
import { signInDemoPersona } from "@/lib/demo-persona-signin";
import { postAuthHref } from "@/lib/post-auth-href";
import { useSession, type SessionUser } from "@/stores/session";

type AuthEntryViewProps = {
  mode: "login" | "signup";
  otherHref: "/login" | "/signup";
  nextHref?: string | null;
};

export function AuthEntryView({ mode, otherHref, nextHref }: AuthEntryViewProps) {
  const router = useRouter();
  const signIn = useSession((state) => state.signIn);
  const [personaId, setPersonaId] = useState<DemoPersonaId>(DEFAULT_DEMO_PERSONA_ID);
  const otherLabel = otherHref === "/signup" ? "Sign up" : "Sign in";
  const heading = mode === "login" ? "Welcome back" : "Create your account";
  const submitLabel = mode === "login" ? "Sign in" : "Create account";
  const showPersonas = mode === "login";
  const otherWithNext = nextHref
    ? `${otherHref}?next=${encodeURIComponent(nextHref)}`
    : otherHref;

  function enter(user: SessionUser) {
    signIn(user);
    router.push(postAuthHref(nextHref));
  }

  function continuePersona() {
    const result = signInDemoPersona(personaId, nextHref);
    router.push(result.redirectTo);
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

          {showPersonas ? (
            <div className="mt-7">
              <DemoPersonaPicker
                selectedId={personaId}
                onSelect={setPersonaId}
                onContinue={continuePersona}
              />
            </div>
          ) : null}

          <div className={showPersonas ? "mt-8" : "mt-7"}>
            {showPersonas ? (
              <>
                <div className="mb-6 flex items-center gap-3 text-[12px] font-medium text-ink-muted">
                  <span className="h-px flex-1 bg-border" />
                  or
                  <span className="h-px flex-1 bg-border" />
                </div>
                <h2 className="font-display text-[1.15rem] font-semibold tracking-tight text-ink">
                  Sign in the usual way
                </h2>
                <p className="mt-1 mb-4 text-[13px] leading-relaxed text-ink-muted">
                  Use your name and phone if you already have details on this device.
                </p>
              </>
            ) : null}

            <AuthIdentityForm submitLabel={submitLabel} onComplete={enter} />
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
