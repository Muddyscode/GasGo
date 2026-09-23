export type MarketingFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const MARKETING_FAQS: readonly MarketingFaqItem[] = [
  {
    id: "street-fill",
    question: "Do you fill cooking gas on my street?",
    answer:
      "No. A rider collects your empty cylinder in Port Harcourt, we refill it offsite at the plant, and we return it full. Nothing is filled at the door.",
  },
  {
    id: "where",
    question: "Where do you ride?",
    answer:
      "Port Harcourt only — Old GRA, Trans-Amadi, Diobu, Rumuola, Ada George, Woji, Rumuokoro, and Eliozu. We do not ride other cities.",
  },
  {
    id: "cost",
    question: "What does a refill cost?",
    answer:
      "Live gas is ₦1,450/kg times the kilos you choose. The zone pickup-and-return fee is a separate line, always shown before you pay, and never above ₦1,200.",
  },
  {
    id: "pay",
    question: "When do I pay?",
    answer:
      "In full on Paystack before we pick up the empty. We do not start the collect → plant → return loop on credit.",
  },
  {
    id: "cylinder",
    question: "Do I keep my own cylinder?",
    answer:
      "Yes. We fill the bottle you already own. Sealed, weighed, and checked at the plant before it comes back to your gate.",
  },
  {
    id: "auto-refill",
    question: "Can GasGo just refill me automatically?",
    answer:
      "Coming soon. Auto-refill and Never run out are teasers today — we do not place plant refills in the background. You build the fill yourself.",
  },
  {
    id: "account",
    question: "Do I need an account to start?",
    answer:
      "Guests can build a fill and add a Port Harcourt address. Account only at checkout. Signing in never clears a draft you already started.",
  },
  {
    id: "late",
    question: "What if the rider is late?",
    answer:
      "Open the order timeline and ping WhatsApp. A real person will pick up the thread — locked gates, late buses, and all.",
  },
] as const;

export const MARKETING_FAQ_SR =
  "Port Harcourt plant-refill questions: we collect the empty, refill at the plant, and return it full. Auto-refill is coming soon.";
