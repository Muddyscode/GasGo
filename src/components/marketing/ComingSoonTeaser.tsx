import { SealedValveGlyph } from "@/components/illustrations/gas-scenes";
import { cardClassName } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ComingSoonTeaser({
  title = "Auto-refill",
  body = "A gauge that orders for you is on the way. Today, you build the fill yourself — guests included, account only at checkout.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section
      className={cn(
        cardClassName,
        "relative overflow-hidden bg-surface-muted px-5 py-5 shadow-gasgo-soft",
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-3 left-0 w-1 rounded-full bg-brand-yellow"
      />
      <div className="flex items-start justify-between gap-3 pl-2">
        <div>
          <h2 className="text-[17px] font-semibold tracking-tight text-ink">{title}</h2>
          <p className="mt-1 max-w-[40ch] text-sm leading-relaxed text-ink-muted">{body}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
            Coming soon
          </span>
          <SealedValveGlyph className="size-9" />
        </div>
      </div>
    </section>
  );
}
