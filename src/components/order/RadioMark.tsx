import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function RadioMark({ selected }: { selected: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-6 shrink-0 place-items-center rounded-full border-2 transition-colors duration-150",
        selected
          ? "border-brand-green bg-brand-green text-white"
          : "border-border bg-surface text-transparent",
      )}
    >
      <Check className="size-3.5 stroke-[3]" />
    </span>
  );
}
