import type { Metadata } from "next";
import { ZonesPageView } from "@/components/marketing/ZonesPageView";

export const metadata: Metadata = {
  title: "Zones · GasGo",
  description:
    "Port Harcourt pickup-and-return zones. Old GRA to Trans-Amadi — zone fee always shown, never above ₦1,200.",
};

export default function ZonesPage() {
  return <ZonesPageView />;
}
