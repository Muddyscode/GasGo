/** GasGo support line in E.164 without a leading +. */
export const GASGO_WHATSAPP_E164 = "2348012345678";

export function whatsappSupportUrl(orderId: string): string {
  const text = `Hi GasGo, I need help with order ${orderId}`;
  return `https://wa.me/${GASGO_WHATSAPP_E164}?text=${encodeURIComponent(text)}`;
}
