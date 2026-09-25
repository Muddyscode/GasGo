import type { Metadata } from "next";
import { AddressesManageView } from "@/components/profile/AddressesManageView";
import { getMockAddresses } from "@/data/profile";

export const metadata: Metadata = {
  title: "Addresses — GasGo",
  description: "Saved GasGo delivery addresses.",
};

export default function ProfileAddressesPage() {
  return <AddressesManageView addresses={getMockAddresses()} />;
}
