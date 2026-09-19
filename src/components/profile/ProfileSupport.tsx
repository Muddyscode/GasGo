import { LogOut, MessageCircle } from "lucide-react";
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
        className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-brand-green text-base font-semibold tracking-tight text-white shadow-gasgo-md transition-[background-color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2"
      >
        <MessageCircle className="size-5" strokeWidth={2.25} />
        Chat on WhatsApp
      </a>

      <button
        type="button"
        onClick={onLogout}
        className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-surface-muted text-[15px] font-semibold text-ink transition-transform duration-150 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
      >
        <LogOut className="size-4" strokeWidth={2} />
        Log out
      </button>
    </section>
  );
}
