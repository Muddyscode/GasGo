import { MessageCircle } from "lucide-react";
import { tactilePrimary } from "@/components/ui/tactile";
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
      className={cn(tactilePrimary("gap-2"), className)}
    >
      <MessageCircle className="size-5" strokeWidth={2.25} />
      Chat on WhatsApp
    </a>
  );
}
