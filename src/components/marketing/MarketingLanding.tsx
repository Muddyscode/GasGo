"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Flame, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { TrustRow } from "@/components/marketing/TrustRow";
import { buttonClassName } from "@/components/ui/button";
import { cardClassName } from "@/components/ui/card";
import { PageBody, PageFrame } from "@/components/ui/page";
import { LIVE_RATE_NGN_PER_KG } from "@/config/pricing";
import { whatsappHref } from "@/config/whatsapp";
import { formatNaira } from "@/lib/money";
import { cn } from "@/lib/utils";

export function MarketingLanding() {
  return (
    <PageFrame>
      <PageBody className="pb-16">
        <section className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-6">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-green">
              Port Harcourt LPG
            </p>
            <h1 className="mt-2 text-[32px] font-semibold leading-[1.12] tracking-tight text-ink md:text-[40px] lg:text-[48px]">
              Cooking gas, refilled at the plant, returned to your door.
            </h1>
            <p className="mt-3 max-w-[42ch] text-[16px] leading-relaxed text-ink-muted md:text-lg">
              We collect your empty cylinder, fill it offsite, and bring it back full.
              Pay in full before pickup — then track every beat on WhatsApp if you need us.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/order/cylinder"
                className={buttonClassName({ variant: "primary", size: "lg" }, "sm:w-auto sm:px-8")}
              >
                <Flame className="size-4" strokeWidth={2.25} />
                Order a refill
                <ArrowRight className="size-4" strokeWidth={2.25} />
              </Link>
              <a
                href="#how-it-works"
                className={buttonClassName({ variant: "secondary", size: "lg" }, "sm:w-auto sm:px-8")}
              >
                How it works
              </a>
            </div>

            <p className="mt-4 text-sm text-ink-muted">
              Live {formatNaira(LIVE_RATE_NGN_PER_KG)}/kg · Full, by kg, or by ₦ ·
              Port Harcourt only
            </p>
          </div>

          <div className="relative mt-8 overflow-hidden rounded-[1.5rem] border border-border shadow-gasgo-lg lg:col-span-6 lg:mt-0">
            <Image
              src="/images/lit-stove.png"
              alt="Blue flame on a cooking hob in a Port Harcourt kitchen"
              width={960}
              height={640}
              priority
              sizes="(min-width: 1024px) 520px, 100vw"
              className="h-56 w-full object-cover sm:h-72 lg:h-[22rem]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <p className="absolute bottom-4 left-4 right-4 text-[15px] font-semibold text-white">
              Never a doorstep fill. The plant does the work.
            </p>
          </div>
        </section>

        <HowItWorks />
        <TrustRow />

        <section className="mt-10 grid gap-3 sm:grid-cols-3">
          <Teaser
            icon={<Truck className="size-4" strokeWidth={2} />}
            title="Pay before pickup"
            body="The rider only collects your empty after Paystack confirms. No cash on the street."
          />
          <Teaser
            icon={<ShieldCheck className="size-4" strokeWidth={2} />}
            title="Track the return"
            body="Queued, collected, plant refill, then your filled cylinder on the way back."
          />
          <Teaser
            icon={<MessageCircle className="size-4" strokeWidth={2} />}
            title="WhatsApp us"
            body="A real person on the line if the return runs late."
          />
        </section>

        <section
          className={cn(
            cardClassName,
            "relative mt-10 overflow-hidden bg-surface-muted px-5 py-5",
          )}
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-3 left-0 w-1 rounded-full bg-brand-yellow"
          />
          <div className="flex items-start justify-between gap-3 pl-2">
            <div>
              <h2 className="text-[17px] font-semibold tracking-tight text-ink">
                Auto-refill
              </h2>
              <p className="mt-1 max-w-[40ch] text-sm leading-relaxed text-ink-muted">
                A gauge that orders for you is on the way. Today, you build the fill
                yourself — guests included, account only at checkout.
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-border bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
              Coming soon
            </span>
          </div>
        </section>

        <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <Link
            href="/order/cylinder"
            className={buttonClassName({ variant: "primary", size: "lg" }, "sm:w-auto sm:px-8")}
          >
            Start your refill
          </Link>
          <a
            href={whatsappHref("Hi GasGo, I have a question before I order.")}
            className={buttonClassName({ variant: "outline", size: "lg" }, "sm:w-auto sm:px-8")}
          >
            <MessageCircle className="size-4" strokeWidth={2} />
            Chat on WhatsApp
          </a>
        </div>
      </PageBody>
    </PageFrame>
  );
}

function Teaser({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <section className={cn(cardClassName, "px-4 py-4")}>
      <span className="inline-flex size-8 items-center justify-center rounded-full bg-surface-soft text-brand-green">
        {icon}
      </span>
      <h3 className="mt-3 text-[15px] font-semibold tracking-tight text-ink">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-ink-muted">{body}</p>
    </section>
  );
}
