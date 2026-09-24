import type { DeliveryStageId } from "@/config/delivery-stages";

export type TrackingRider = {
  name: string;
  phone: string;
  phoneHref: string;
  rating: string;
  vehicle: string;
};

const RIDERS: ReadonlyArray<Omit<TrackingRider, "phoneHref">> = [
  { name: "Chidi Amadi", phone: "0803 555 0148", rating: "4.9", vehicle: "GasGo pickup · RSA 214 GG" },
  { name: "Tamuno West", phone: "0806 441 2207", rating: "4.8", vehicle: "GasGo pickup · RSA 188 GG" },
  { name: "Ebele Okoro", phone: "0813 902 7756", rating: "5.0", vehicle: "GasGo pickup · RSA 302 GG" },
  { name: "Sopuru Wobo", phone: "0809 774 5510", rating: "4.9", vehicle: "GasGo pickup · RSA 145 GG" },
  { name: "Ibrahim Musa", phone: "0705 118 6094", rating: "4.8", vehicle: "GasGo pickup · RSA 271 GG" },
];

function hashId(orderId: string): number {
  let hash = 0;
  for (let i = 0; i < orderId.length; i += 1) {
    hash = (hash * 31 + orderId.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Deterministic rider for an order id — same order always shows the same rider. */
export function resolveRider(orderId: string): TrackingRider {
  const pick = RIDERS[hashId(orderId) % RIDERS.length] ?? RIDERS[0];
  return { ...pick, phoneHref: `tel:${pick.phone.replace(/\s+/g, "")}` };
}

/** Honest, stage-tied ETA line — no fake countdown, just where the loop is. */
export function riderEtaLabel(stageId: DeliveryStageId, late: boolean): string {
  if (late) return "Held up — we’re on it";
  switch (stageId) {
    case "queued":
      return "Assigning your rider";
    case "rider_assigned":
      return "Collecting your empty · ~20 min";
    case "picked_up":
      return "Refilling at the plant";
    case "en_route":
      return "Returning your fill · ~18 min";
    case "nearby":
      return "Almost at your door · ~5 min";
    case "delivered":
      return "Filled cylinder delivered";
    default:
      return "On the plant refill loop";
  }
}
