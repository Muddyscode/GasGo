/**
 * Fulfillment choice, calendar dates, and the 8:00pm WAT cutoff.
 * Pricing still lives in pricing.ts — this only zeros hub delivery after quoteFill.
 */

import type { FillQuote } from "@/config/pricing";

export const FULFILLMENT_MODES = ["door_to_door", "hub"] as const;
export type FulfillmentMode = (typeof FULFILLMENT_MODES)[number];

export const DEFAULT_FULFILLMENT_MODE: FulfillmentMode = "door_to_door";

/** Africa/Lagos calendar days (WAT, no DST). Used for pickupDate / returnDate. */
export const GASGO_TZ = "Africa/Lagos";

/**
 * Same-day pickup/return cutoff: 8:00pm WAT.
 * From 20:00 Africa/Lagos onward, “today” is not selectable — buses are prepped
 * for the next day’s fill cycle. Documented constant; do not invent hard hub slots.
 */
export const SAME_DAY_CUTOFF_HOUR_WAT = 20;

/** Number of selectable calendar days from the earliest allowed date (inclusive). */
export const SELECTABLE_DATE_HORIZON_DAYS = 7;

export const HUB_CONFIGURED_STUB_LABEL = "hub-configured (stub)";

export const SAME_DAY_CUSTOMER_REMINDER =
  "Same-day loop: you’ll get the filled cylinder back the same day as the fill cycle / return date you chose.";

export const SAME_DAY_OPS_REMINDER =
  "Same-day return: pickup and fill cycle are the same calendar day — the filled cylinder goes back today.";

export const CUTOFF_EXPLANATION =
  "Same-day orders close at 8:00pm WAT so we can prep the buses. After cutoff, pickup and return move to the next day.";

export const FULFILLMENT_COPY = {
  door_to_door: {
    title: "Door-to-door",
    detail: "Rider picks up the empty and returns it filled.",
  },
  hub: {
    title: "Hub self-serve",
    detail:
      "Bring the empty, collect the filled. Gas fee only — ₦0 delivery. App pre-order required, no walk-ins. Limited yard space.",
  },
} as const;

export function isFulfillmentMode(
  value: string | null | undefined,
): value is FulfillmentMode {
  return FULFILLMENT_MODES.includes(value as FulfillmentMode);
}

export function fulfillmentLabel(mode: FulfillmentMode): string {
  return FULFILLMENT_COPY[mode].title;
}

/** YYYY-MM-DD calendar day in Africa/Lagos. */
export function formatLagosDate(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: GASGO_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const year = parts.find((part) => part.type === "year")?.value ?? "1970";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";
  return `${year}-${month}-${day}`;
}

export function lagosHour(now = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: GASGO_TZ,
    hour: "2-digit",
    hour12: false,
    hourCycle: "h23",
  }).formatToParts(now);
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  return Number.isFinite(hour) ? hour : 0;
}

export function isAfterSameDayCutoff(now = new Date()): boolean {
  return lagosHour(now) >= SAME_DAY_CUTOFF_HOUR_WAT;
}

export function isValidIsoDate(value: string | null | undefined): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return false;
  const utc = new Date(Date.UTC(year, month - 1, day));
  return (
    utc.getUTCFullYear() === year &&
    utc.getUTCMonth() === month - 1 &&
    utc.getUTCDate() === day
  );
}

export function addIsoDays(isoDate: string, days: number): string {
  if (!isValidIsoDate(isoDate)) return isoDate;
  const [year, month, day] = isoDate.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day + days));
  return utc.toISOString().slice(0, 10);
}

export function earliestSelectableDate(now = new Date()): string {
  const today = formatLagosDate(now);
  return isAfterSameDayCutoff(now) ? addIsoDays(today, 1) : today;
}

export function listSelectableDates(now = new Date()): string[] {
  const start = earliestSelectableDate(now);
  return Array.from({ length: SELECTABLE_DATE_HORIZON_DAYS }, (_, index) =>
    addIsoDays(start, index),
  );
}

export function isSelectableDate(isoDate: string, now = new Date()): boolean {
  return listSelectableDates(now).includes(isoDate);
}

export function defaultOrderDates(now = new Date()): {
  pickupDate: string;
  returnDate: string;
} {
  const date = earliestSelectableDate(now);
  return { pickupDate: date, returnDate: date };
}

export type OrderDateNormalization = {
  ok: boolean;
  pickupDate: string;
  returnDate: string;
  rolledFromToday: boolean;
  error: string | null;
};

/**
 * Clamp pickup/return to selectable Africa/Lagos days.
 * After 20:00 WAT, today rolls to tomorrow (prep buses).
 * returnDate is always >= pickupDate.
 */
export function normalizeOrderDates(
  pickupDate: string | null | undefined,
  returnDate: string | null | undefined,
  now = new Date(),
): OrderDateNormalization {
  const defaults = defaultOrderDates(now);
  const selectable = listSelectableDates(now);
  const allowed = new Set(selectable);
  const earliest = selectable[0] ?? defaults.pickupDate;
  const latest = selectable[selectable.length - 1] ?? earliest;

  let rolledFromToday = false;

  function clamp(value: string | null | undefined): string {
    if (!isValidIsoDate(value)) return earliest;
    if (value === formatLagosDate(now) && isAfterSameDayCutoff(now)) {
      rolledFromToday = true;
      return earliest;
    }
    if (value < earliest) {
      if (value === formatLagosDate(now) || value < formatLagosDate(now)) {
        rolledFromToday = rolledFromToday || isAfterSameDayCutoff(now);
      }
      return earliest;
    }
    if (value > latest) return latest;
    if (!allowed.has(value)) return earliest;
    return value;
  }

  let pickup = clamp(pickupDate);
  let returning = clamp(returnDate);

  if (returning < pickup) returning = pickup;

  const ok =
    isSelectableDate(pickup, now) &&
    isSelectableDate(returning, now) &&
    returning >= pickup;

  return {
    ok,
    pickupDate: pickup,
    returnDate: returning,
    rolledFromToday,
    error: ok ? null : "Choose a valid pickup date and a return date on or after it.",
  };
}

export function isSameDayLoop(pickupDate: string, returnDate: string): boolean {
  return pickupDate === returnDate;
}

export function formatCalendarDate(isoDate: string): string {
  if (!isValidIsoDate(isoDate)) return isoDate;
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function dateChipLabel(isoDate: string, now = new Date()): string {
  const today = formatLagosDate(now);
  if (isoDate === today) return "Today";
  if (isoDate === addIsoDays(today, 1)) return "Tomorrow";
  return formatCalendarDate(isoDate);
}

/**
 * Hub is gas only (delivery ₦0). Does not change quoteFill / LIVE_RATE / PH_ZONES.
 */
export function applyFulfillmentToQuote(
  quote: FillQuote,
  mode: FulfillmentMode,
): FillQuote {
  if (mode !== "hub") return quote;
  return {
    ...quote,
    deliveryNgn: 0,
    totalNgn: quote.gasFillNgn,
    lines: quote.lines.map((line) =>
      line.id === "delivery"
        ? { ...line, label: "Hub self-serve · gas only", amountNgn: 0 }
        : line,
    ),
  };
}
