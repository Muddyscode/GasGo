import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckoutBreakdownRow } from "@/components/order/CheckoutReceiptSheet";
import { CheckoutTotalProvider } from "@/components/order/CheckoutTotalProvider";
import { PaystackPayButton } from "@/components/order/PaystackPayButton";
import { PriceBreakdown } from "@/components/order/PriceBreakdown";
import { quoteFill, toOrderQuote } from "@/config/pricing";
import { formatNaira } from "@/lib/money";
import { COUNT_UP_DURATION_MS } from "@/lib/use-count-up-naira";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

vi.mock("@/components/auth/AuthProvider", () => ({
  useAuthModal: () => ({
    requestAuth: () => true,
    open: false,
    intent: null,
    openAuth: () => {},
    closeAuth: () => {},
  }),
}));

const SURFACES = ["bar", "row", "sheet", "rail"] as const;

const firstQuote = toOrderQuote(
  quoteFill({ fillMode: "full", capacityKg: 15, zoneId: "old-gra" }),
);
const nextQuote = toOrderQuote(
  quoteFill({ fillMode: "kg", capacityKg: 12.5, fillKg: 12.5, zoneId: "woji" }),
);

function FourCheckoutTotals({
  quote,
}: {
  quote: ReturnType<typeof toOrderQuote>;
}) {
  return (
    <CheckoutTotalProvider totalNgn={quote.totalNgn}>
      <div data-surface="bar">
        <PaystackPayButton quote={quote} placement="bar" />
      </div>
      <div data-surface="row">
        <CheckoutBreakdownRow
          totalNgn={quote.totalNgn}
          expanded={false}
          onOpen={() => {}}
        />
      </div>
      <div data-surface="sheet">
        <PriceBreakdown quote={quote} fulfillmentMode="door_to_door" />
      </div>
      <div data-surface="rail">
        <PriceBreakdown quote={quote} fulfillmentMode="door_to_door" />
      </div>
    </CheckoutTotalProvider>
  );
}

function setReducedMotion(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: query.includes("prefers-reduced-motion") ? matches : false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

function installTweenClock() {
  let now = 0;
  vi.spyOn(performance, "now").mockImplementation(() => now);
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
    now += COUNT_UP_DURATION_MS;
    return window.setTimeout(() => cb(now), 0) as unknown as number;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => {
    window.clearTimeout(id);
  });
}

function surfaceTotals() {
  return SURFACES.map((surface) => {
    const root = document.querySelector(`[data-surface="${surface}"]`);
    const tween = root?.querySelector("[data-checkout-total]");
    const finals = root?.querySelectorAll("[data-naira-final]");
    const final = finals?.[finals.length - 1];
    return {
      surface,
      tween: tween?.textContent ?? "",
      final: final?.textContent ?? "",
    };
  });
}

describe("checkout totals share one quote tween", () => {
  beforeEach(() => {
    setReducedMotion(false);
    installTweenClock();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("settles every surface on the exact quote after kg and zone change", async () => {
    expect(firstQuote.totalNgn).not.toBe(nextQuote.totalNgn);

    const view = render(<FourCheckoutTotals quote={firstQuote} />);
    const first = formatNaira(firstQuote.totalNgn);
    for (const row of surfaceTotals()) {
      expect(row.tween, row.surface).toBe(first);
      expect(row.final, row.surface).toBe(first);
    }

    view.rerender(<FourCheckoutTotals quote={nextQuote} />);
    const expected = formatNaira(nextQuote.totalNgn);

    for (const row of surfaceTotals()) {
      expect(row.final, `${row.surface} sr-only`).toBe(expected);
    }

    await waitFor(() => {
      const rows = surfaceTotals();
      for (const row of rows) {
        expect(row.tween, row.surface).toBe(expected);
      }
    });

    const settled = surfaceTotals().map((row) => row.tween);
    expect(new Set(settled).size).toBe(1);
    expect(settled[0]).toBe(expected);
  });

  it("shows the final quote instantly when motion is reduced", () => {
    setReducedMotion(true);
    const view = render(<FourCheckoutTotals quote={firstQuote} />);

    view.rerender(<FourCheckoutTotals quote={nextQuote} />);
    const expected = formatNaira(nextQuote.totalNgn);
    for (const row of surfaceTotals()) {
      expect(row.tween, row.surface).toBe(expected);
      expect(row.final, row.surface).toBe(expected);
    }
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  });
});
