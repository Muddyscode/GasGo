export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function nairaToKobo(amountNgn: number): number {
  return Math.round(amountNgn * 100);
}

export function koboToNaira(amountKobo: number): number {
  return amountKobo / 100;
}
