import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { navForPathname } from "@/lib/customer-routes";

const SRC = path.resolve(__dirname, "..");

function readSrc(rel: string) {
  return readFileSync(path.resolve(SRC, rel), "utf8");
}

describe("Wednesday demo path contracts", () => {
  it("lets a guest reach checkout; AuthModal is requested only there", () => {
    expect(readSrc("components/order/AddressDeliveryForm.tsx")).not.toMatch(
      /requestAuth/,
    );
    expect(readSrc("components/nav/NavActions.tsx")).not.toMatch(/requestAuth/);
    expect(readSrc("components/order/CheckoutView.tsx")).toMatch(
      /requestAuth\("\/order\/checkout"\)/,
    );
    expect(readSrc("components/order/PaystackPayButton.tsx")).toMatch(
      /requestAuth\("\/order\/checkout"\)/,
    );
    expect(readSrc("components/auth/AuthProvider.tsx")).not.toMatch(
      /router\.push\("\/order\/address"\)/,
    );
  });

  it("does not ship Lagos SKU CylinderSelection / CylinderCard leftovers", () => {
    expect(
      existsSync(path.resolve(SRC, "components/order/CylinderCard.tsx")),
    ).toBe(false);
    expect(
      existsSync(path.resolve(SRC, "components/order/CylinderSelection.tsx")),
    ).toBe(false);
    expect(readSrc("components/order/FillComposer.tsx")).not.toMatch(
      /CylinderCard|CylinderSelection|priceNgn/,
    );
  });

  it("address back copy is fill, not cylinder-selection SKU language", () => {
    const nav = navForPathname("/order/address");
    expect(nav?.backLabel).toMatch(/fill/i);
    expect(nav?.backLabel).not.toMatch(/cylinder selection|sku/i);
  });
});
