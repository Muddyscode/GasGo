import { Pencil, UserRound } from "lucide-react";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { tactile } from "@/components/ui/tactile";
import { formatNgPhone } from "@/data/profile";
import { cn } from "@/lib/utils";

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
    <SurfaceCard>
      <div className="flex items-center gap-3.5">
        <span
          aria-hidden="true"
          className="grid size-14 shrink-0 place-items-center rounded-2xl bg-surface-soft text-brand-green"
        >
          {initials ? (
            <span className="text-lg font-semibold tracking-tight">{initials}</span>
          ) : (
            <UserRound className="size-6" strokeWidth={1.75} />
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
          className={cn(
            "inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink",
            tactile.motion,
            tactile.press,
            tactile.focus,
            "hover:bg-surface-muted",
          )}
        >
          <Pencil className="size-4" strokeWidth={2} />
        </button>
      </div>
    </SurfaceCard>
  );
}
