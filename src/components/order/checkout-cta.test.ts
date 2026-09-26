import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ORDER_DIR = __dirname;

function readOrder(rel: string) {
  return readFileSync(path.join(ORDER_DIR, rel), "utf8");
}

describe("checkout mobile CTA keeps the full receipt out of the bar", () => {
  it("does not mount PriceBreakdown inside the mobile CTA container", () => {
    const pay = readOrder("PaystackPayButton.tsx");
    const view = readOrder("CheckoutView.tsx");
    const page = readOrder("../ui/page.tsx");

    expect(pay).toMatch(/CHECKOUT_MOBILE_CTA_ATTR = "data-checkout-mobile-cta"/);
    expect(pay).toMatch(/data-checkout-mobile-cta/);
    expect(pay).toMatch(/placement === "bar"/);
    expect(pay).toMatch(/placement === "rail"/);
    expect(pay).toMatch(/className="lg:hidden"/);
    expect(pay).toMatch(/CountUpNaira/);
    expect(pay).toMatch(/shared data-checkout-total/);
    expect(pay).toMatch(/Flame/);
    expect(pay).toMatch(/animate-pay-flame/);
    expect(pay).toMatch(/aria-busy=\{pending\}/);
    expect(pay).not.toMatch(/DeliveryTruck/);
    expect(pay).toMatch(/View breakdown/);
    expect(pay).toMatch(/onViewBreakdown/);
    expect(pay).toMatch(/aria-controls=\{CHECKOUT_RECEIPT_SHEET_ID\}/);

    const sheet = readOrder("CheckoutReceiptSheet.tsx");
    expect(sheet).toMatch(/createPortal/);
    expect(sheet).toMatch(/OVERLAY_SCRIM_45_CLASS/);
    expect(sheet).toMatch(/CHECKOUT_RECEIPT_SHEET_ID/);
    expect(sheet).toMatch(/aria-haspopup="dialog"/);
    expect(sheet).toMatch(/aria-expanded=\{expanded\}/);
    expect(sheet).toMatch(/mx-auto/);
    expect(sheet).toMatch(/rounded-t-3xl/);
    expect(sheet).toMatch(/border-t border-border/);
    expect(sheet).not.toMatch(/bg-ink\/45/);

    const address = readOrder("AddAddressSheet.tsx");
    expect(address).toMatch(/createPortal/);
    expect(address).toMatch(/OVERLAY_SCRIM_40_CLASS/);
    expect(address).toMatch(/mx-auto/);
    expect(address).not.toMatch(/bg-ink\/40/);

    const profile = readFileSync(
      path.resolve(ORDER_DIR, "../profile/EditProfileSheet.tsx"),
      "utf8",
    );
    expect(profile).toMatch(/createPortal/);
    expect(profile).toMatch(/OVERLAY_SCRIM_40_CLASS/);
    expect(profile).toMatch(/useBodyScrollLock/);
    expect(profile).toMatch(/mx-auto/);
    expect(profile).not.toMatch(/bg-ink\/40/);

    const overlay = readFileSync(path.resolve(ORDER_DIR, "../../lib/overlay.ts"), "utf8");
    expect(overlay).toMatch(/color-mix\(in_srgb,var\(--gasgo-ink\)_45%,transparent\)/);
    expect(overlay).toMatch(/color-mix\(in_srgb,var\(--gasgo-ink\)_40%,transparent\)/);
    expect(overlay).toMatch(/OVERLAY_SCRIM_DARK_CLASS/);
    expect(overlay).toMatch(
      /dark:bg-\[color-mix\(in_srgb,var\(--gasgo-surface\)_70%,transparent\)\]/,
    );
    expect(overlay).toMatch(/OVERLAY_SCRIM_45_CLASS[\s\S]*OVERLAY_SCRIM_DARK_CLASS/);
    expect(overlay).toMatch(/OVERLAY_SCRIM_40_CLASS[\s\S]*OVERLAY_SCRIM_DARK_CLASS/);
    expect(pay).not.toMatch(/PriceBreakdown/);
    expect(pay).not.toMatch(/To pay before pickup/);
    expect(pay).not.toMatch(/prepayQuoteLines/);
    expect(pay).not.toMatch(/PAYMENT_VARIANCE_COPY/);

    expect(view).toMatch(/PriceBreakdown/);
    expect(view).toMatch(/CheckoutReceiptSheet/);
    expect(view).toMatch(/CheckoutBreakdownRow/);
    expect(view).toMatch(/className="mt-8 lg:hidden"/);
    expect(view).toMatch(/className="pb-6 lg:pb-0"/);
    expect(view).toMatch(/placement="rail"/);
    expect(view).toMatch(/placement="bar"/);
    expect(view).not.toMatch(/pb-4/);

    expect(page).toMatch(/pb-\[max\(1rem,env\(safe-area-inset-bottom\)\)\]/);
    expect(page).not.toMatch(/sticky bottom-0/);
    expect(page).toMatch(/overflow-hidden/);
  });

  it("keeps the receipt as thin dividers with a quieter under-fill line", () => {
    const receipt = readOrder("PriceBreakdown.tsx");
    expect(receipt).toMatch(/To pay before pickup/);
    expect(receipt).toMatch(/To pay before pickup[\s\S]*?<\/p>/);
    expect(receipt).not.toMatch(/<span[^>]*>To<\/span>|<span[^>]*>pay<\/span>/);
    expect(receipt).toMatch(/border-t border-border\/60/);
    expect(receipt).toMatch(/CountUpNaira/);
    expect(receipt).toMatch(/shared data-checkout-total/);
    expect(receipt).toMatch(/tabular-nums/);
    expect(receipt).toMatch(/text-\[28px\]/);
    expect(receipt).toMatch(/PAYMENT_VARIANCE_COPY/);
    expect(receipt).toMatch(/text-\[12px\].*text-ink-muted\/80/);
    expect(receipt).not.toMatch(/cardClassName|shadow-gasgo|rounded-2xl border/);
  });
});
