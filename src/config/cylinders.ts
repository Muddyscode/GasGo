export const CYLINDER_IDS = ["6", "12.5", "25", "50"] as const;

export type CylinderId = (typeof CYLINDER_IDS)[number];

export type CylinderBadge = "Most Popular" | "Corporate";

export type CylinderOption = {
  id: CylinderId;
  sizeKg: number;
  priceNgn: number;
  bestFor: string;
  badge?: CylinderBadge;
};

export const CYLINDER_OPTIONS: readonly CylinderOption[] = [
  {
    id: "6",
    sizeKg: 6,
    priceNgn: 8500,
    bestFor: "Small household / cooking light",
  },
  {
    id: "12.5",
    sizeKg: 12.5,
    priceNgn: 16500,
    bestFor: "Typical family",
    badge: "Most Popular",
  },
  {
    id: "25",
    sizeKg: 25,
    priceNgn: 32000,
    bestFor: "Larger home / heavy use",
  },
  {
    id: "50",
    sizeKg: 50,
    priceNgn: 62000,
    bestFor: "Business / high volume",
    badge: "Corporate",
  },
] as const;

export function isCylinderId(value: string | null | undefined): value is CylinderId {
  return CYLINDER_IDS.includes(value as CylinderId);
}

export function getCylinderById(id: string | null | undefined): CylinderOption | undefined {
  if (!isCylinderId(id)) return undefined;
  return CYLINDER_OPTIONS.find((option) => option.id === id);
}

export function formatCylinderSize(sizeKg: number): string {
  return `${sizeKg} kg`;
}
