import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  image: string;
  alt: string;
  title: string;
  body: string;
  action?: ReactNode;
  className?: string;
  priority?: boolean;
};

export function EmptyState({
  image,
  alt,
  title,
  body,
  action,
  className,
  priority = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-surface shadow-gasgo-soft",
        className,
      )}
    >
      <div className="relative h-36 w-full overflow-hidden sm:h-44">
        <Image
          src={image}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 640px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
      </div>
      <div className="px-5 pb-6 pt-2 text-center">
        <p className="text-[17px] font-semibold tracking-tight text-ink">{title}</p>
        <p className="mx-auto mt-1.5 max-w-[32ch] text-sm leading-relaxed text-ink-muted">
          {body}
        </p>
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </div>
  );
}
