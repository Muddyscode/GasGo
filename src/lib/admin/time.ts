import { formatDistanceToNow } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { GASGO_TZ } from "@/config/fulfillment";

export function formatPlacedAt(iso: string): string {
  const date = new Date(iso);
  const ageMs = Date.now() - date.getTime();
  if (Number.isFinite(ageMs) && ageMs >= 0 && ageMs < 24 * 60 * 60 * 1000) {
    return formatDistanceToNow(date, { addSuffix: true });
  }
  return formatInTimeZone(date, GASGO_TZ, "d MMM, h:mma");
}

export function formatPlacedAtExact(iso: string): string {
  return formatInTimeZone(new Date(iso), GASGO_TZ, "d MMM yyyy, h:mm a");
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  return phone;
}
