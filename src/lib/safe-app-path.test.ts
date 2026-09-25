import { describe, expect, it } from "vitest";
import { safeAppPath } from "@/lib/safe-app-path";

describe("safeAppPath", () => {
  it("keeps in-app routes and rejects off-site next values", () => {
    expect(safeAppPath("/order/checkout")).toBe("/order/checkout");
    expect(safeAppPath("/profile")).toBe("/profile");
    expect(safeAppPath("https://evil.example/phish")).toBeNull();
    expect(safeAppPath("//evil.example")).toBeNull();
    expect(safeAppPath("order/checkout")).toBeNull();
    expect(safeAppPath("")).toBeNull();
    expect(safeAppPath(undefined)).toBeNull();
  });
});
