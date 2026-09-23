import type { FulfillmentMode } from "@/config/fulfillment";
import { formatKg, type FillQuote } from "@/config/pricing";
import { formatNaira } from "@/lib/money";

export const PLANT_REFILL_LINE =
  "We collect your empty, refill it at the plant, and return it filled. Nothing is filled at your door.";

export const PAID_RELIEF_TITLE = "You're paid";

export const PAID_RELIEF_BODY =
  "We'll collect the empty, refill it at the plant, and return it filled. Nothing is filled at your door.";

export function fillStickyHint(quote: Pick<FillQuote, "fillKg" | "rateNgnPerKg" | "gasFillNgn">): string {
  return `${formatKg(quote.fillKg)} kg at ${formatNaira(quote.rateNgnPerKg)}/kg — ${formatNaira(quote.gasFillNgn)}`;
}

export function addressStickyHint(input: {
  quote: Pick<FillQuote, "gasFillNgn" | "deliveryNgn" | "totalNgn">;
  fulfillmentMode: FulfillmentMode;
  hasAddress: boolean;
  fallback: string;
}): string {
  const { quote, fulfillmentMode, hasAddress, fallback } = input;
  if (fulfillmentMode === "hub") {
    return `Gas only ${formatNaira(quote.gasFillNgn)} — no transport`;
  }
  if (!hasAddress) {
    return "Select an address to see your zone transport";
  }
  if (quote.deliveryNgn > 0) {
    return `Gas ${formatNaira(quote.gasFillNgn)} + transport ${formatNaira(quote.deliveryNgn)} — ${formatNaira(quote.totalNgn)}`;
  }
  return fallback;
}
