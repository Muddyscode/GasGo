import { LogOut, MessageCircle } from "lucide-react";
import { ThemePreferenceRow } from "@/components/theme/ThemePreferenceRow";
import { buttonClassName } from "@/components/ui/button";
import { whatsappAccountUrl } from "@/config/whatsapp";

type ProfileSupportProps = {
  onLogout: () => void;
};

export function ProfileSupport({ onLogout }: ProfileSupportProps) {
  return (
    <section className="flex flex-col gap-2.5">
      <ThemePreferenceRow />
      <a
        href={whatsappAccountUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClassName({ variant: "primary", size: "lg" })}
      >
        <MessageCircle className="size-5" strokeWidth={2.25} />
        Chat on WhatsApp
      </a>

      <button
        type="button"
        onClick={onLogout}
        className={buttonClassName({ variant: "secondary", size: "md" }, "w-full")}
      >
        <LogOut className="size-4" strokeWidth={2} />
        Log out
      </button>
    </section>
  );
}
