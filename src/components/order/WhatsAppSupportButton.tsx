import { MessageCircle } from "lucide-react";
import { buttonClassName } from "@/components/ui/button";
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
      className={cn(buttonClassName({ variant: "primary", size: "lg" }), className)}
    >
      <MessageCircle className="size-5" strokeWidth={2.25} />
      Chat on WhatsApp
    </a>
  );
}
