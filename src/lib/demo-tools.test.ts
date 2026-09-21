import { describe, expect, it } from "vitest";
import { isDemoToolsEnabled } from "@/lib/demo-tools";

describe("demo tool gate", () => {
  it("stays off in production unless the public demo flag is set", () => {
    expect(isDemoToolsEnabled({ NODE_ENV: "production" })).toBe(false);
    expect(
      isDemoToolsEnabled({ NODE_ENV: "production", NEXT_PUBLIC_GASGO_DEMO: "1" }),
    ).toBe(true);
  });

  it("is on for local/dev/test so Wednesday pitch can walk the plant loop", () => {
    expect(isDemoToolsEnabled({ NODE_ENV: "development" })).toBe(true);
    expect(isDemoToolsEnabled({ NODE_ENV: "test" })).toBe(true);
  });
});
