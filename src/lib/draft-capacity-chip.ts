import { formatKg } from "@/config/pricing";

/**
 * Top-right kg chip follows live draft capacity only.
 * Hidden until the guest/customer has set a cylinder size — never an orphan 12.5.
 */
export function draftCapacityChipLabel(
  capacityKg: number | null | undefined,
): string | null {
  if (capacityKg == null || !Number.isFinite(capacityKg) || capacityKg <= 0) {
    return null;
  }
  return `${formatKg(capacityKg)} kg`;
}
