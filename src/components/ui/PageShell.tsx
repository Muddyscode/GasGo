import type { ReactNode } from "react";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { cn } from "@/lib/utils";

type AppCanvasProps = {
  children: ReactNode;
  className?: string;
};

export function AppCanvas({ children, className }: AppCanvasProps) {
  return (
    <div className={cn("min-h-dvh w-full bg-surface text-ink md:bg-surface-muted", className)}>
      {children}
    </div>
  );
}

type FocusShellProps = {
  children: ReactNode;
  width?: "narrow" | "readable";
  className?: string;
};

/** Centered checkout-like column. Tablet gets a soft lift; phone stays edge-to-edge. */
export function FocusShell({ children, width = "narrow", className }: FocusShellProps) {
  return (
    <AppCanvas>
      <div
        className={cn(
          "mx-auto flex min-h-dvh w-full flex-col bg-surface",
          width === "readable" ? "max-w-md md:max-w-3xl" : "max-w-md md:max-w-lg",
          "md:shadow-gasgo-lg",
          className,
        )}
      >
        {children}
      </div>
    </AppCanvas>
  );
}

type OrderFlowShellProps = {
  children: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: string;
};

/** Narrow order column with optional desktop side art. */
export function OrderFlowShell({
  children,
  imageSrc,
  imageAlt = "",
  imagePosition = "50% 50%",
}: OrderFlowShellProps) {
  return (
    <AppCanvas>
      <div
        className={cn(
          "mx-auto flex min-h-dvh w-full max-w-md flex-col bg-surface md:max-w-lg md:shadow-gasgo-lg",
          "lg:grid lg:max-w-6xl lg:grid-cols-[minmax(24rem,32rem)_minmax(0,1fr)] lg:shadow-none",
        )}
      >
        <div className="flex min-h-dvh flex-col bg-surface">{children}</div>
        {imageSrc ? (
          <aside className="relative hidden min-h-dvh overflow-hidden lg:block" aria-hidden={imageAlt === ""}>
            <EditorialImage
              src={imageSrc}
              alt={imageAlt}
              objectPosition={imagePosition}
              overlay="brand"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="absolute inset-0"
            />
          </aside>
        ) : null}
      </div>
    </AppCanvas>
  );
}

type WideShellProps = {
  children: ReactNode;
  className?: string;
};

export function WideShell({ children, className }: WideShellProps) {
  return (
    <div className={cn("mx-auto w-full max-w-md px-5 md:max-w-3xl md:px-8 lg:max-w-6xl", className)}>
      {children}
    </div>
  );
}
