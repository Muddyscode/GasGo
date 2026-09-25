import { useRef, useState } from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { CheckoutReceiptSheet } from "@/components/order/CheckoutReceiptSheet";
import { PaystackPayButton } from "@/components/order/PaystackPayButton";
import { quoteFill, toOrderQuote } from "@/config/pricing";

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

const quote = toOrderQuote(
  quoteFill({ fillMode: "full", capacityKg: 15, zoneId: "old-gra" }),
);

function CheckoutReceiptHarness() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  return (
    <>
      <PaystackPayButton
        quote={quote}
        placement="bar"
        breakdownOpen={open}
        onViewBreakdown={(trigger) => {
          triggerRef.current = trigger;
          setOpen(true);
        }}
      />
      <CheckoutReceiptSheet
        open={open}
        onClose={() => setOpen(false)}
        quote={quote}
        fulfillmentMode="door_to_door"
        returnFocusTo={triggerRef}
      />
    </>
  );
}

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
});

describe("checkout receipt sheet (rendered)", () => {
  it("opens the breakdown from the bar, traps focus, and returns it on Esc", async () => {
    const user = userEvent.setup();
    render(<CheckoutReceiptHarness />);

    const bar = document.querySelector("[data-checkout-mobile-cta]");
    expect(bar).toBeTruthy();
    expect(bar?.textContent ?? "").toMatch(/Total/);
    expect(bar?.textContent ?? "").toMatch(/Pay now|Sign up to pay/);
    expect(bar?.textContent ?? "").not.toMatch(/To pay before pickup/);
    expect(bar?.textContent ?? "").not.toMatch(/Gas fill/);
    expect(bar?.textContent ?? "").not.toMatch(/Transport \(assumed/);
    expect(screen.queryByRole("dialog")).toBeNull();

    const trigger = screen.getByRole("button", { name: /View breakdown/i });
    await user.click(trigger);

    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(dialog.getAttribute("aria-labelledby")).toBeTruthy();
    expect(dialog.textContent ?? "").toMatch(/To pay before pickup/);
    expect(dialog.textContent ?? "").toMatch(/Gas fill/);
    expect(dialog.textContent ?? "").toMatch(/Transport \(assumed Old GRA zone fee\)/);
    expect(within(dialog).getByText("Total")).toBeTruthy();

    const close = within(dialog).getByRole("button", { name: "Close" });
    const done = within(dialog).getByRole("button", { name: "Done" });
    expect(close).toBe(document.activeElement);

    await user.tab();
    expect(done).toBe(document.activeElement);
    await user.tab();
    expect(close).toBe(document.activeElement);
    await user.tab({ shift: true });
    expect(done).toBe(document.activeElement);

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(trigger).toBe(document.activeElement);
  });

  it("opens from the compact total and closes on a scrim tap", async () => {
    const user = userEvent.setup();
    render(<CheckoutReceiptHarness />);

    await user.click(screen.getByRole("button", { name: /Total/i }));
    expect(screen.getByRole("dialog")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Close receipt" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("button", { name: /Total/i })).toBe(document.activeElement);
  });
});
