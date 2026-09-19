"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { CylinderCard } from "@/components/order/CylinderCard";
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
    <div className="flex min-h-dvh flex-col bg-surface">
      <header className="sticky top-0 z-20 border-b border-border/80 bg-surface/90 backdrop-blur-md">
        <div className="relative flex h-14 items-center justify-center px-2">
          <Link
            href="/"
            aria-label="Go back"
            className="absolute left-2 inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors duration-150 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
          >
            <ChevronLeft className="size-6" strokeWidth={2} />
          </Link>
          <h1 className="text-[15px] font-semibold tracking-tight text-ink">
            Select cylinder
          </h1>
        </div>
      </header>

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
          className={cn(
            "flex h-14 w-full items-center justify-center rounded-2xl text-base font-semibold tracking-tight",
            "transition-[background-color,color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2",
            selected
              ? "bg-brand-green text-white shadow-gasgo-md active:scale-[0.985]"
              : "cursor-not-allowed bg-surface-muted text-ink-muted",
          )}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
