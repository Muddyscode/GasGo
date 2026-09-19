import { nairaToKobo } from "@/lib/money";

const PAYSTACK_INLINE_SRC = "https://js.paystack.co/v1/inline.js";
const TEST_PAYER_EMAIL = "customer@pay.gasgo.app";

type PaystackPopup = {
  setup: (options: {
    key: string;
    email: string;
    amount: number;
    currency: string;
    ref: string;
    metadata?: Record<string, string>;
    callback: (response: { reference: string }) => void;
    onClose: () => void;
  }) => { openIframe: () => void };
};

declare global {
  interface Window {
    PaystackPop?: PaystackPopup;
  }
}

export type PaystackCheckoutInput = {
  amountNgn: number;
  reference: string;
  email?: string;
  metadata?: Record<string, string>;
};

export type PaystackCheckoutResult =
  | { kind: "paystack"; reference: string }
  | { kind: "mock"; reference: string };

export function createOrderReference(cylinderId: string): string {
  return `GG-${cylinderId}-${Date.now().toString(36)}`;
}

/**
 * Opens Paystack Inline when NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is set.
 * Without a public key the app stays secret-free and resolves a mock success.
 */
export async function initiatePaystackPayment(
  input: PaystackCheckoutInput,
): Promise<PaystackCheckoutResult> {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY?.trim();
  if (!publicKey) {
    return { kind: "mock", reference: input.reference };
  }

  const paystack = await loadPaystackInline();
  return new Promise((resolve, reject) => {
    paystack
      .setup({
        key: publicKey,
        email: input.email ?? TEST_PAYER_EMAIL,
        amount: nairaToKobo(input.amountNgn),
        currency: "NGN",
        ref: input.reference,
        metadata: input.metadata,
        callback: (response) => {
          resolve({ kind: "paystack", reference: response.reference });
        },
        onClose: () => {
          reject(new DOMException("Checkout closed", "AbortError"));
        },
      })
      .openIframe();
  });
}

function loadPaystackInline(): Promise<PaystackPopup> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Paystack is browser-only"));
  }
  if (window.PaystackPop) return Promise.resolve(window.PaystackPop);

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${PAYSTACK_INLINE_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => {
        if (window.PaystackPop) resolve(window.PaystackPop);
        else reject(new Error("Paystack failed to load"));
      });
      existing.addEventListener("error", () => reject(new Error("Paystack failed to load")));
      return;
    }

    const script = document.createElement("script");
    script.src = PAYSTACK_INLINE_SRC;
    script.async = true;
    script.onload = () => {
      if (window.PaystackPop) resolve(window.PaystackPop);
      else reject(new Error("Paystack failed to load"));
    };
    script.onerror = () => reject(new Error("Paystack failed to load"));
    document.head.appendChild(script);
  });
}