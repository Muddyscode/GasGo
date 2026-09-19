import type { Metadata } from "next";
import { ProfileView } from "@/components/profile/ProfileView";

export const metadata: Metadata = {
  title: "Profile · GasGo",
  description: "Your GasGo account, gauge, orders, and saved addresses.",
};

export default function ProfilePage() {
  return <ProfileView />;
}
