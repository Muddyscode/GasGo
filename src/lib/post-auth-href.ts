import { useOrderDraft } from "@/stores/order-draft";

/**
 * Shared by the usual-way form enter() and persona Continue.
 * Honors a safe `nextHref`, else a ready fill draft goes to checkout, else home.
 */
export function postAuthHref(nextHref?: string | null): string {
  if (nextHref) return nextHref;
  if (useOrderDraft.getState().isReadyForCheckout()) return "/order/checkout";
  return "/";
}
