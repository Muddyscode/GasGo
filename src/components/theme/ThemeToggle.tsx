"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  className,
  island = false,
}: {
  className?: string;
  island?: boolean;
}) {
  const { resolved, ready, toggle } = useTheme();
  const toDark = resolved === "light";

  if (!ready) {
    return <div className={cn("size-11 shrink-0", className)} aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={toDark ? "Switch to dark theme" : "Switch to light theme"}
      title={toDark ? "Dark mode" : "Light mode"}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full text-ink",
        "transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:bg-surface-muted active:scale-[0.96]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40",
        island && "size-10",
        className,
      )}
    >
      {toDark ? (
        <Moon className="size-5" strokeWidth={1.75} />
      ) : (
        <Sun className="size-5" strokeWidth={1.75} />
      )}
    </button>
  );
}
