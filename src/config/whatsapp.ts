/** GasGo support line in E.164 without a leading +. */
export const GASGO_WHATSAPP_E164 = "2348012345678";

export function whatsappHref(text: string): string {
  return `https://wa.me/${GASGO_WHATSAPP_E164}?text=${encodeURIComponent(text)}`;
}

export function whatsappSupportUrl(orderId: string): string {
  return whatsappHref(`Hi GasGo, I need help with order ${orderId}`);
}

export function whatsappAccountUrl(): string {
  return whatsappHref("Hi GasGo, I need help with my account");
}
