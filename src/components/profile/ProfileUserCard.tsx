import { Pencil } from "lucide-react";
import {
  CylinderGlyph,
  PlantTankGlyph,
} from "@/components/illustrations/gas-scenes";
import { cardClassName } from "@/components/ui/card";
import { formatNgPhone } from "@/data/profile";

type ProfileUserCardProps = {
  name: string;
  phone: string;
  onEdit: () => void;
};

export function ProfileUserCard({ name, phone, onEdit }: ProfileUserCardProps) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <section className={`${cardClassName} relative overflow-hidden px-4 py-4`}>
      <PlantTankGlyph className="pointer-events-none absolute -right-1 -top-1 size-14 opacity-[0.12]" />
      <div className="relative flex items-center gap-3.5">
        <span
          aria-hidden="true"
          className="grid size-14 shrink-0 place-items-center rounded-2xl bg-surface-soft text-brand-green"
        >
          {initials ? (
            <span className="text-lg font-semibold tracking-tight">{initials}</span>
          ) : (
            <CylinderGlyph className="size-6" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[17px] font-semibold tracking-tight text-ink">
            {name || "Your name"}
          </p>
          <p className="mt-0.5 truncate text-sm tabular-nums text-ink-muted">
            {formatNgPhone(phone) || "Add a phone number"}
          </p>
        </div>

        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit profile"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink transition-colors duration-150 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
        >
          <Pencil className="size-4" strokeWidth={2} />
        </button>
      </div>
    </section>
  );
}
