/** Demo admin PIN — not RBAC. Production must use Supabase auth. */
export const ADMIN_SESSION_STORAGE_KEY = "gasgo-admin-session";

/** Documented fallback when NEXT_PUBLIC_ADMIN_DEMO_PIN is unset. */
export const ADMIN_DEMO_PIN_FALLBACK = "2468";

export function getAdminDemoPin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_ADMIN_DEMO_PIN?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : ADMIN_DEMO_PIN_FALLBACK;
}

export function pinMatches(input: string): boolean {
  return input.trim() === getAdminDemoPin();
}
