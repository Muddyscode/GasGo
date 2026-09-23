import Image from "next/image";
import { cn } from "@/lib/utils";

export function KitchenHero({ className }: { className?: string }) {
  return (
    <figure className={cn("kitchen-hero relative overflow-hidden bg-surface-muted", className)}>
      <Image
        src="/brand/kitchen-relief.png"
        alt="A Port Harcourt kitchen in late afternoon: a woman at the stove, steam rising, and a sealed cylinder by the door."
        width={1280}
        height={720}
        priority
        className="kitchen-hero-image h-full w-full object-cover object-[82%_58%]"
      />
    </figure>
  );
}
