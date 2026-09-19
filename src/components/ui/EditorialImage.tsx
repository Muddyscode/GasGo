import Image from "next/image";
import { cn } from "@/lib/utils";

type Overlay = "none" | "ink" | "soft" | "brand";

type EditorialImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  objectPosition?: string;
  overlay?: Overlay;
  fill?: boolean;
};

const overlayClass: Record<Overlay, string> = {
  none: "",
  ink: "bg-gradient-to-t from-ink/55 via-ink/10 to-transparent",
  soft: "bg-gradient-to-t from-ink/25 via-transparent to-white/10",
  brand: "bg-gradient-to-tr from-ink/50 via-brand-green/15 to-transparent",
};

export function EditorialImage({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 40vw, 100vw",
  priority = false,
  objectPosition = "50% 50%",
  overlay = "ink",
  fill = true,
}: EditorialImageProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill={fill}
        priority={priority}
        sizes={sizes}
        className="object-cover"
        style={{ objectPosition }}
      />
      {overlay !== "none" ? (
        <span
          aria-hidden="true"
          className={cn("pointer-events-none absolute inset-0", overlayClass[overlay])}
        />
      ) : null}
    </div>
  );
}
