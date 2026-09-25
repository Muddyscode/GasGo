/**
 * Same-origin in-app path only. Blocks protocol-relative and external URLs
 * so login `?next=` cannot bounce a guest off GasGo.
 */
export function safeAppPath(value: string | null | undefined): string | null {
  if (!value) return null;
  const next = value.trim();
  if (!next.startsWith("/")) return null;
  if (next.startsWith("//") || next.includes("://") || next.includes("\\")) {
    return null;
  }
  return next;
}
