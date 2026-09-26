import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { PaystackPayButton } from "@/components/order/PaystackPayButton";
import { TrackingTimeline } from "@/components/order/TrackingTimeline";
import { SAVED_ADDRESSES } from "@/config/delivery";
import { defaultOrderDates } from "@/config/fulfillment";
import { quoteFill, toOrderQuote } from "@/config/pricing";
import { useOrderDraft } from "@/stores/order-draft";
import { useSession } from "@/stores/session";

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

vi.mock("@/lib/paystack", () => ({
  createOrderReference: () => "GG-hold-pay",
  initiatePaystackPayment: () => new Promise(() => {}),
}));

const quote = toOrderQuote(
  quoteFill({ fillMode: "full", capacityKg: 15, zoneId: "old-gra" }),
);

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

afterEach(() => {
  cleanup();
  useOrderDraft.getState().clear();
  useSession.setState({ user: null });
});

describe("checkout micro-interactions", () => {
  it("draws a step tick on completed order stages", () => {
    const { container } = render(
      <TrackingTimeline currentStageId="picked_up" />,
    );
    const ticks = container.querySelectorAll("[data-step-tick]");
    expect(ticks.length).toBeGreaterThan(0);
    expect(ticks[0]?.getAttribute("class") ?? "").toMatch(/animate-step-tick/);
    expect(ticks[0]?.getAttribute("aria-hidden")).toBe("true");
  });

  it("shows a Lucide flame loader on the pay button while processing", async () => {
    const dates = defaultOrderDates();
    useOrderDraft.getState().setCapacityKg(15);
    useOrderDraft.getState().setFillMode("full");
    useOrderDraft.getState().setAddress(SAVED_ADDRESSES[0]);
    useOrderDraft.getState().setPresence("someone-home");
    useOrderDraft.getState().setWindow("asap");
    useOrderDraft.getState().setOrderDates(dates.pickupDate, dates.returnDate);
    useSession.getState().signIn({
      id: "usr_pay",
      firstName: "Ada",
      lastName: "Okoro",
      phone: "+2348020000000",
      email: "ada@guest.gasgo.app",
    });

    const user = userEvent.setup();
    render(<PaystackPayButton quote={quote} placement="bar" />);

    const pay = screen.getByRole("button", { name: "Pay now" });
    await user.click(pay);

    const pending = screen.getByRole("button", { name: "Starting Paystack…" });
    expect(pending.getAttribute("aria-busy")).toBe("true");
    expect(pending.hasAttribute("data-pay-pending")).toBe(true);
    expect(pending.querySelector("svg")).toBeTruthy();
    expect(pending.textContent ?? "").toMatch(/Starting Paystack/);
  });
});
