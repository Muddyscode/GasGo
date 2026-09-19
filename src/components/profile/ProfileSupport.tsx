import { LogOut, MessageCircle } from "lucide-react";
import { tactilePrimary, tactileSecondary } from "@/components/ui/tactile";
import { whatsappAccountUrl } from "@/config/whatsapp";

type ProfileSupportProps = {
  onLogout: () => void;
};

export function ProfileSupport({ onLogout }: ProfileSupportProps) {
  return (
    <section className="flex flex-col gap-2.5">
      <a
        href={whatsappAccountUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={tactilePrimary("gap-2")}
      >
        <MessageCircle className="size-5" strokeWidth={2.25} />
        Chat on WhatsApp
      </a>

      <button
        type="button"
        onClick={onLogout}
        className={tactileSecondary("h-12 gap-2 text-[15px]")}
      >
        <LogOut className="size-4" strokeWidth={2} />
        Log out
      </button>
    </section>
  );
}
