/**
 * Port Harcourt live fill quote — Architect lock.
 * Gas is ₦/kg × kg. Zone delivery is a separate line. No Lagos flat fee.
 * LIVE_RATE_NGN_PER_KG and PH_ZONES are hub-configured (stub) — no admin CRUD.
 */

/** Hub-configured (stub). Live ₦/kg until plant ops CRUD exists. */
export const LIVE_RATE_NGN_PER_KG = 1400;

export const FILL_MODES = ["full", "kg", "naira"] as const;
export type FillMode = (typeof FILL_MODES)[number];

export const DEFAULT_FILL_MODE: FillMode = "full";

/** Hub-configured (stub). Port Harcourt zone fees until plant ops CRUD exists. */
export const PH_ZONES = [
  { id: "old-gra", name: "Old GRA", feeNgn: 1500 },
  { id: "trans-amadi", name: "Trans-Amadi", feeNgn: 1800 },
  { id: "woji", name: "Woji", feeNgn: 2000 },
  { id: "rumuokoro", name: "Rumuokoro", feeNgn: 2200 },
  { id: "eliozu", name: "Eliozu", feeNgn: 2500 },
  { id: "ada-george", name: "Ada George", feeNgn: 2000 },
  { id: "diobu", name: "Diobu / Township", feeNgn: 1500 },
  { id: "rumuola", name: "Rumuola", feeNgn: 1800 },
] as const;

export type ZoneId = (typeof PH_ZONES)[number]["id"];

export type FillQuoteInput = {
  fillMode: FillMode;
  capacityKg: number;
  fillKg?: number | null;
  spendNaira?: number | null;
  zoneId?: ZoneId | null;
  rateNgnPerKg?: number;
};

export type QuoteLine = {
  id: "gas" | "delivery";
  label: string;
  amountNgn: number;
};

export type FillQuote = {
  fillMode: FillMode;
  capacityKg: number;
  fillKg: number;
  rateNgnPerKg: number;
  gasFillNgn: number;
  deliveryNgn: number;
  zoneId: ZoneId | null;
  zoneName: string | null;
  totalNgn: number;
  lines: QuoteLine[];
};

export type OrderQuote = {
  gasFillNgn: number;
  deliveryNgn: number;
  totalNgn: number;
  fillKg?: number;
  rateNgnPerKg?: number;
  zoneName?: string | null;
  lines?: QuoteLine[];
};

export function isFillMode(value: string | null | undefined): value is FillMode {
  return FILL_MODES.includes(value as FillMode);
}

export function isZoneId(value: string | null | undefined): value is ZoneId {
  return PH_ZONES.some((zone) => zone.id === value);
}

export function getZone(id: string | null | undefined) {
  if (!isZoneId(id)) return undefined;
  return PH_ZONES.find((zone) => zone.id === id);
}

export function zoneDeliveryFeeNgn(zoneId: string | null | undefined): number {
  return getZone(zoneId)?.feeNgn ?? 0;
}

export function resolveFillKg(input: {
  fillMode: FillMode;
  capacityKg: number;
  fillKg?: number | null;
  spendNaira?: number | null;
  rateNgnPerKg?: number;
}): number {
  const capacity = sanitizeKg(input.capacityKg);
  if (capacity <= 0) return 0;

  const rate = input.rateNgnPerKg ?? LIVE_RATE_NGN_PER_KG;
  if (input.fillMode === "full") return roundKg(capacity);
  if (input.fillMode === "kg") {
    return roundKg(Math.min(capacity, Math.max(0, sanitizeKg(input.fillKg ?? 0))));
  }
  const spend = Math.max(0, input.spendNaira ?? 0);
  if (rate <= 0) return 0;
  return roundKg(Math.min(capacity, spend / rate));
}

export function quoteFill(input: FillQuoteInput): FillQuote {
  const rateNgnPerKg = input.rateNgnPerKg ?? LIVE_RATE_NGN_PER_KG;
  const capacityKg = roundKg(sanitizeKg(input.capacityKg));
  const fillKg = resolveFillKg({ ...input, capacityKg, rateNgnPerKg });
  const gasFillNgn = Math.round(fillKg * rateNgnPerKg);
  const zone = getZone(input.zoneId ?? null);
  const deliveryNgn = zone?.feeNgn ?? 0;
  const gasLabel =
    fillKg > 0
      ? `Gas fill · ₦${rateNgnPerKg.toLocaleString("en-NG")}/kg × ${formatKg(fillKg)} kg`
      : "Gas fill";
  const deliveryLabel = zone
    ? `${zone.name} pickup & return`
    : "Zone delivery (set with address)";

  const lines: QuoteLine[] = [
    { id: "gas", label: gasLabel, amountNgn: gasFillNgn },
    { id: "delivery", label: deliveryLabel, amountNgn: deliveryNgn },
  ];

  return {
    fillMode: input.fillMode,
    capacityKg,
    fillKg,
    rateNgnPerKg,
    gasFillNgn,
    deliveryNgn,
    zoneId: zone?.id ?? null,
    zoneName: zone?.name ?? null,
    totalNgn: gasFillNgn + deliveryNgn,
    lines,
  };
}

/** Checkout helper: gas fill plus the selected PH zone fee. */
export function quoteOrder(
  gasFillNgn: number,
  zoneId?: ZoneId | null,
): OrderQuote {
  const deliveryNgn = zoneDeliveryFeeNgn(zoneId);
  return {
    gasFillNgn,
    deliveryNgn,
    totalNgn: gasFillNgn + deliveryNgn,
    zoneName: getZone(zoneId)?.name ?? null,
  };
}

export function toOrderQuote(quote: FillQuote): OrderQuote {
  return {
    gasFillNgn: quote.gasFillNgn,
    deliveryNgn: quote.deliveryNgn,
    totalNgn: quote.totalNgn,
    fillKg: quote.fillKg,
    rateNgnPerKg: quote.rateNgnPerKg,
    zoneName: quote.zoneName,
    lines: quote.lines,
  };
}

export function formatKg(kg: number): string {
  return Number.isInteger(kg) ? String(kg) : kg.toFixed(1).replace(/\.0$/, "");
}

function sanitizeKg(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function roundKg(value: number): number {
  return Math.round(value * 10) / 10;
}
