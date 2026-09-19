"use client";

import { useRouter } from "next/navigation";
import { CylinderCard } from "@/components/order/CylinderCard";
import { OrderHeader } from "@/components/order/OrderHeader";
import { OrderFlowShell } from "@/components/ui/PageShell";
import { tactilePrimary } from "@/components/ui/tactile";
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
    <OrderFlowShell
      imageSrc="/images/cooking-gas-cylinders.png"
      imageAlt="Rows of cooking gas cylinders ready to fill"
      imagePosition="50% 70%"
    >
      <OrderHeader title="Select cylinder" backHref="/" backLabel="Back home" />

      <div className="flex flex-1 flex-col px-5 pt-6">
        <section className="mb-6">
          <p className="text-[28px] font-semibold leading-[1.15] tracking-tight text-ink">
            What size do you need?
          </p>
          <p className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-ink-muted">
            We’ll fill it and deliver to your door. Pick the cylinder that matches how you cook.
          </p>
        </section>

        <div
          role="radiogroup"
          aria-label="Cylinder size"
          className="flex flex-col gap-3 pb-4"
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
      </div>

      <div className="sticky bottom-0 z-20 border-t border-border/80 bg-surface/95 px-5 pt-3 backdrop-blur-md pb-[max(1rem,env(safe-area-inset-bottom))]">
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
          className={tactilePrimary()}
        >
          Continue
        </button>
      </div>
    </OrderFlowShell>
  );
}
