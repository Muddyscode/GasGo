import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { draftCapacityChipLabel } from "@/lib/draft-capacity-chip";

const SRC = path.resolve(__dirname, "..");

function readSrc(rel: string) {
  return readFileSync(path.resolve(SRC, rel), "utf8");
}

describe("draft capacity kg chip", () => {
  it("hides until the live draft has a capacity — no orphan 12.5 default", () => {
    expect(draftCapacityChipLabel(null)).toBeNull();
    expect(draftCapacityChipLabel(undefined)).toBeNull();
    expect(draftCapacityChipLabel(0)).toBeNull();
    expect(draftCapacityChipLabel(-6)).toBeNull();
    expect(draftCapacityChipLabel(Number.NaN)).toBeNull();
  });

  it("follows live draft capacity, not fill kg or a leftover 12.5", () => {
    expect(draftCapacityChipLabel(25)).toBe("25 kg");
    expect(draftCapacityChipLabel(12.5)).toBe("12.5 kg");
    expect(draftCapacityChipLabel(6)).toBe("6 kg");
    expect(draftCapacityChipLabel(50)).toBe("50 kg");
  });

  it("top-right chip reads draft.capacityKg and stays hidden on marketing island", () => {
    const actions = readSrc("components/nav/NavActions.tsx");
    expect(actions).toMatch(/draftCapacityChipLabel/);
    expect(actions).toMatch(/state\.capacityKg/);
    expect(actions).toMatch(/!island/);
    expect(actions).not.toMatch(/formatKg\(live\.fillKg\)/);
    expect(actions).not.toMatch(/island && live\.fillKg/);
  });
});
