import type { Metadata } from "next";
import { CylinderSelection } from "@/components/order/CylinderSelection";
import { getCylinderById } from "@/config/cylinders";

export const metadata: Metadata = {
  title: "Select cylinder · GasGo",
  description: "Choose a cooking gas cylinder size for delivery.",
};

type CylinderPageProps = {
  searchParams: Promise<{ cylinder?: string | string[] }>;
};

export default async function CylinderPage({ searchParams }: CylinderPageProps) {
  const params = await searchParams;
  const raw = params.cylinder;
  const cylinderId = Array.isArray(raw) ? raw[0] : raw;

  return (
    <CylinderSelection
      initialSelectedId={getCylinderById(cylinderId)?.id ?? null}
    />
  );
}
