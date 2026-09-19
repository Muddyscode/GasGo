import { MapPin } from "lucide-react";
import { RadioMark } from "@/components/order/RadioMark";
import type { DeliveryAddress } from "@/config/delivery";
import { cn } from "@/lib/utils";

type AddressCardProps = {
  address: DeliveryAddress;
  selected: boolean;
  onSelect: (id: string) => void;
};

export function AddressCard({ address, selected, onSelect }: AddressCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`${address.label}, ${address.line}, ${address.area}`}
      onClick={() => onSelect(address.id)}
      className={cn(
        "flex w-full items-start gap-3.5 rounded-2xl border px-4 py-4 text-left",
        "min-h-14 outline-none transition-[border-color,background-color,box-shadow,transform] duration-150",
        "ease-[cubic-bezier(0.16,1,0.3,1)]",
        "active:scale-[0.985] focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2",
        selected
          ? "border-brand-green bg-surface-soft shadow-gasgo-md"
          : "border-border bg-surface shadow-gasgo-soft hover:border-ink-muted/25 hover:shadow-gasgo-md",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-xl transition-colors duration-150",
          selected ? "bg-white text-brand-green" : "bg-surface-muted text-ink-muted",
        )}
      >
        <MapPin className="size-5" strokeWidth={1.75} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-semibold tracking-tight text-ink">
          {address.label}
        </span>
        <span className="mt-0.5 block text-sm leading-snug text-ink">
          {address.line}
        </span>
        <span className="mt-1 block text-sm text-ink-muted">{address.area}</span>
      </span>

      <RadioMark selected={selected} />
    </button>
  );
}
