/**
 * Lagos metro delivery — flat fee until zone pricing exists.
 * Swap `LAGOS_DELIVERY_FEE_NGN` or `quoteOrder` when we add island / mainland rates.
 */
export const LAGOS_DELIVERY_FEE_NGN = 1500;

export type OrderQuote = {
  gasFillNgn: number;
  deliveryNgn: number;
  totalNgn: number;
};

export function quoteOrder(gasFillNgn: number): OrderQuote {
  const deliveryNgn = LAGOS_DELIVERY_FEE_NGN;
  return {
    gasFillNgn,
    deliveryNgn,
    totalNgn: gasFillNgn + deliveryNgn,
  };
}