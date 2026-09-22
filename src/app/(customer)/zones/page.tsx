import type { Metadata } from "next";
import { ZoneMap } from "@/components/marketing";

export const metadata: Metadata = {
  title: "Zones · GasGo",
  description:
    "Port Harcourt pickup-and-return zones. Old GRA to Trans-Amadi — zone fee always shown, never above ₦1,200.",
};

export default function ZonesPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 pb-20 pt-4 md:px-8 lg:max-w-6xl lg:px-10">
      <ZoneMap />
    </div>
  );
}
