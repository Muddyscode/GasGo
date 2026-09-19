"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { CylinderCard } from "@/components/order/CylinderCard";
import { OrderHeader } from "@/components/order/OrderHeader";
import { buttonClassName } from "@/components/ui/button";
import { PageBody, PageFrame, PageTitle, StickyAction } from "@/components/ui/page";
import {
  CYLINDER_OPTIONS,
  formatCylinderSize,
  getCylinderById,
} from "@/config/cylinders";
import { formatNaira } from "@/lib/money";
import { cn } from "@/lib/utils";
import { useOrderDraft } from "@/stores/order-draft";

export function CylinderSelection() {
  const router = useRouter();
  const selectedId = useOrderDraft((state) => state.cylinderId);
  const setCylinder = useOrderDraft((state) => state.setCylinder);
  const selected = getCylinderById(selectedId);

  function handleContinue() {
    if (!selected) return;
    setCylinder(selected.id);
    router.push("/order/address");
  }

  return (
    <PageFrame>
      <OrderHeader title="Select cylinder" backHref="/" backLabel="Go back" />

      <PageBody>
        <PageTitle
          eyebrow="Order gas"
          subtitle="We’ll fill it and deliver to your door. Pick the cylinder that matches how you cook."
        >
          What size do you need?
        </PageTitle>

        <div className="relative mb-5 overflow-hidden rounded-[1.25rem] border border-border shadow-gasgo-md">
          <Image
            src="/images/cooking-gas-cylinders.png"
            alt="Cooking gas cylinders ready to be filled"
            width={736}
            height={375}
            sizes="(max-width: 1024px) 100vw, 720px"
            className="h-32 w-full object-cover sm:h-40 lg:h-48"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
          <p className="absolute bottom-3 left-4 text-sm font-semibold text-white">
            Sealed fills, Lagos-wide
          </p>
        </div>

        <div
          role="radiogroup"
          aria-label="Cylinder size"
          className="grid grid-cols-1 gap-3 pb-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {CYLINDER_OPTIONS.map((option) => (
            <CylinderCard
              key={option.id}
              option={option}
              selected={selectedId === option.id}
              onSelect={setCylinder}
            />
          ))}
        </div>
      </PageBody>

      <StickyAction>
        <p
          className={cn(
            "mb-2.5 min-h-5 text-center text-sm tabular-nums text-ink-muted transition-opacity duration-150",
            selected ? "opacity-100" : "opacity-0",
          )}
          aria-live="polite"
        >
          {selected
            ? `${formatCylinderSize(selected.sizeKg)} · ${formatNaira(selected.priceNgn)}`
            : "Select a size to continue"}
        </p>
        <button
          type="button"
          disabled={!selected}
          onClick={handleContinue}
          className={buttonClassName(
            { variant: "primary", size: "lg" },
            !selected && "cursor-not-allowed bg-surface-muted text-ink-muted shadow-none hover:shadow-none",
          )}
        >
          Continue
        </button>
      </StickyAction>
    </PageFrame>
  );
}
