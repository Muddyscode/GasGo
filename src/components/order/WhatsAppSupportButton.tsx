import { MessageCircle } from "lucide-react";
import { whatsappSupportUrl } from "@/config/whatsapp";
import { cn } from "@/lib/utils";

type WhatsAppSupportButtonProps = {
  orderId: string;
  className?: string;
};

export function WhatsAppSupportButton({
  orderId,
  className,
}: WhatsAppSupportButtonProps) {
  return (
    <a
      href={whatsappSupportUrl(orderId)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-brand-green text-base font-semibold tracking-tight text-white shadow-gasgo-md",
        "transition-[background-color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2",
        className,
      )}
    >
      <MessageCircle className="size-5" strokeWidth={2.25} />
      Chat on WhatsApp
    </a>
  );
}
