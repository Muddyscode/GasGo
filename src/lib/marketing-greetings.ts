export const MARKETING_GREETINGS = [
  { lang: "Pidgin", text: "Gas still dey?", locale: "pcm" },
  { lang: "Yoruba", text: "Ṣé gáàsì ṣì wà?", locale: "yo" },
  { lang: "Igbo", text: "Gas gị agwụbeghị?", locale: "ig" },
  { lang: "Hausa", text: "Gas ɗinka yana nan?", locale: "ha" },
  { lang: "English", text: "Kitchen still lit?", locale: "en" },
] as const;

export type MarketingGreeting = (typeof MARKETING_GREETINGS)[number];

export const MARKETING_GREETING_SR =
  "Kitchen still lit? Cooking gas in Port Harcourt — we collect your empty cylinder, refill it at the plant, and return it full.";

export const GREETING_CYCLE_MS = 4200;
export const GREETING_FADE_MS = 280;
