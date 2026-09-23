/** GasGo support line in E.164 without a leading +. */
export const GASGO_WHATSAPP_E164 = "2348088444645";
export const GASGO_WHATSAPP_DISPLAY = "+234 808 844 4645";

export function whatsappHref(text: string): string {
  return `https://wa.me/${GASGO_WHATSAPP_E164}?text=${encodeURIComponent(text)}`;
}

export function whatsappSupportUrl(orderId: string): string {
  return whatsappHref(`Hi GasGo, I need help with order ${orderId}`);
}

export function whatsappLateUrl(orderId: string): string {
  return whatsappHref(
    `Hi GasGo, order ${orderId} is running late. What's the status on the collect → plant → return loop?`,
  );
}

export function whatsappAccountUrl(): string {
  return whatsappHref("Hi GasGo, I need help with my account");
}
