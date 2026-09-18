import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getCylinderById, formatCylinderSize } from "@/config/cylinders";
import { formatNaira } from "@/lib/money";

export const metadata: Metadata = {
  title: "Delivery address · GasGo",
  description: "Add the address for your GasGo cylinder delivery.",
};

type AddressPageProps = {
  searchParams: Promise<{ cylinder?: string | string[] }>;
};

export default async function AddressPage({ searchParams }: AddressPageProps) {
  const params = await searchParams;
  const raw = params.cylinder;
  const cylinderId = Array.isArray(raw) ? raw[0] : raw;
  const selected = getCylinderById(cylinderId);

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <header className="sticky top-0 z-20 border-b border-border/80 bg-surface/90 backdrop-blur-md">
        <div className="relative flex h-14 items-center justify-center px-2">
          <Link
            href={
              selected
                ? `/order/cylinder?cylinder=${encodeURIComponent(selected.id)}`
                : "/order/cylinder"
            }
            aria-label="Back to cylinder selection"
            className="absolute left-2 inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors duration-150 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
          >
            <ChevronLeft className="size-6" strokeWidth={2} />
          </Link>
          <h1 className="text-[15px] font-semibold tracking-tight text-ink">
            Delivery address
          </h1>
        </div>
      </header>

      <main className="flex flex-1 flex-col px-5 pt-8">
        <p className="text-[28px] font-semibold leading-[1.15] tracking-tight text-ink">
          Address is next
        </p>
        <p className="mt-2 max-w-[36ch] text-[15px] leading-relaxed text-ink-muted">
          {selected
            ? `You chose a ${formatCylinderSize(selected.sizeKg)} cylinder for ${formatNaira(selected.priceNgn)}. Delivery details will live here.`
            : "Choose a cylinder first, then we’ll take your delivery address."}
        </p>

        {selected ? (
          <div className="mt-6 rounded-2xl border border-border bg-surface-muted px-4 py-4 shadow-gasgo-soft">
            <p className="text-sm font-medium text-ink-muted">Selected cylinder</p>
            <p className="mt-1 text-lg font-semibold tracking-tight text-ink">
              {formatCylinderSize(selected.sizeKg)}
            </p>
            <p className="mt-0.5 text-[15px] font-semibold tabular-nums text-ink">
              {formatNaira(selected.priceNgn)}
            </p>
          </div>
        ) : (
          <Link
            href="/order/cylinder"
            className="mt-8 flex h-14 items-center justify-center rounded-2xl bg-brand-green text-base font-semibold text-white shadow-gasgo-md"
          >
            Select a cylinder
          </Link>
        )}
      </main>
    </div>
  );
}
