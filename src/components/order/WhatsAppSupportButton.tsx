import { MessageCircle } from "lucide-react";
import { buttonClassName } from "@/components/ui/button";
import { whatsappLateUrl, whatsappSupportUrl } from "@/config/whatsapp";
import { cn } from "@/lib/utils";

type WhatsAppSupportButtonProps = {
  orderId: string;
  className?: string;
  late?: boolean;
};

export function WhatsAppSupportButton({
  orderId,
  className,
  late = false,
}: WhatsAppSupportButtonProps) {
  return (
    <a
      href={late ? whatsappLateUrl(orderId) : whatsappSupportUrl(orderId)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        buttonClassName({ variant: late ? "yellow" : "primary", size: "lg" }),
        className,
      )}
    >
      <MessageCircle className="size-5" strokeWidth={2.25} />
      {late ? "WhatsApp us about this delay" : "Chat on WhatsApp"}
    </a>
  );
}
