import type { SessionUser } from "@/stores/session";

/**
 * Builds a customer session from the sign-up fields. Mirrors the future
 * Supabase `profiles` shape so the accessor can be swapped without UI changes.
 */
export function guestSessionUser({
  firstName,
  phone,
  email,
}: {
  firstName: string;
  phone: string;
  email: string;
}): SessionUser {
  const name = firstName.trim();
  const digits = phone.replace(/\D/g, "");
  const normalizedPhone = digits.startsWith("234")
    ? `+${digits}`
    : `+234${digits.replace(/^0/, "")}`;

  return {
    id: `usr_${Date.now().toString(36)}`,
    firstName: name.split(/\s+/)[0] ?? name,
    lastName: name.split(/\s+/).slice(1).join(" "),
    phone: normalizedPhone,
    email: email.trim() || `${digits}@guest.gasgo.app`,
  };
}
