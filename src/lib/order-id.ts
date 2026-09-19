/** Local demo order id. Prefix is `gg_`. */
export function createLocalOrderId(): string {
  const entropy = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  return `gg_${entropy}`;
}
