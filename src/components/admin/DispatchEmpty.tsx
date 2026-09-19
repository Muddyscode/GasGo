import { DISPATCH_FILTER_LABELS, type DispatchFilter } from "@/lib/admin/filters";

type DispatchEmptyProps = {
  filter: DispatchFilter;
  query: string;
};

export function DispatchEmpty({ filter, query }: DispatchEmptyProps) {
  const label = DISPATCH_FILTER_LABELS[filter].toLowerCase();

  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface-muted px-4 py-10 text-center">
      <p className="text-[17px] font-semibold tracking-tight text-ink">
        {query ? "No matching orders" : `No ${label} orders`}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
        {query
          ? "Try another order number or phone."
          : "New tickets will land here as customers pay."}
      </p>
    </div>
  );
}
