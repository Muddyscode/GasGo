import { formatDistanceToNow } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

const LAGOS = "Africa/Lagos";

export function formatPlacedAt(iso: string): string {
  const date = new Date(iso);
  const ageMs = Date.now() - date.getTime();
  if (Number.isFinite(ageMs) && ageMs >= 0 && ageMs < 24 * 60 * 60 * 1000) {
    return formatDistanceToNow(date, { addSuffix: true });
  }
  return formatInTimeZone(date, LAGOS, "d MMM, h:mma");
}

export function formatPlacedAtExact(iso: string): string {
  return formatInTimeZone(new Date(iso), LAGOS, "d MMM yyyy, h:mm a");
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  return phone;
}
