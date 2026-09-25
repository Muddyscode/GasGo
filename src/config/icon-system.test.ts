import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const SRC = path.resolve(__dirname, "..");

/**
 * Coop is rebuilding checkout in a parallel PR. These paths may still contain
 * emoji or non-Lucide icons; skip them so this guard stays strict everywhere
 * else. Do not add other files here.
 */
const CHECKOUT_EMOJI_ALLOWLIST = new Set([
  "components/order/CheckoutView.tsx",
  "components/order/CheckoutSummary.tsx",
  "components/order/PaystackPayButton.tsx",
  "components/order/PriceBreakdown.tsx",
  "components/ui/page.tsx",
]);

const SOURCE_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".css", ".json", ".md"]);

/** Unicode Extended_Pictographic — emoji and symbols such as left-right arrows. */
const EXTENDED_PICTOGRAPHIC = /\p{Extended_Pictographic}/u;

type EmojiHit = {
  file: string;
  line: number;
  char: string;
};

function walkFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, acc);
    else acc.push(full);
  }
  return acc;
}

function toSrcRel(abs: string): string {
  return path.relative(SRC, abs).split(path.sep).join("/");
}

function scanSrcForEmoji(): EmojiHit[] {
  const hits: EmojiHit[] = [];
  for (const abs of walkFiles(SRC)) {
    if (!SOURCE_EXT.has(path.extname(abs))) continue;
    const rel = toSrcRel(abs);
    if (CHECKOUT_EMOJI_ALLOWLIST.has(rel)) continue;
    const lines = readFileSync(abs, "utf8").split(/\n/);
    lines.forEach((line, index) => {
      for (const match of line.matchAll(/\p{Extended_Pictographic}/gu)) {
        hits.push({
          file: rel,
          line: index + 1,
          char: match[0],
        });
      }
    });
  }
  return hits;
}

function formatHits(hits: EmojiHit[]): string {
  return hits
    .map((hit) => {
      const code = hit.char.codePointAt(0)?.toString(16).toUpperCase().padStart(4, "0");
      return `${hit.file}:${hit.line} U+${code}`;
    })
    .join("\n");
}

describe("icon system: Lucide or inline SVG only", () => {
  it("does not treat the naira sign as an emoji", () => {
    expect(EXTENDED_PICTOGRAPHIC.test("₦")).toBe(false);
    expect("Live ₦1,450/kg".match(/\p{Extended_Pictographic}/gu)).toBeNull();
  });

  it("flags Extended_Pictographic code points used as icons", () => {
    expect(EXTENDED_PICTOGRAPHIC.test(String.fromCodePoint(0x2194))).toBe(true);
    expect(EXTENDED_PICTOGRAPHIC.test(String.fromCodePoint(0x00a9))).toBe(true);
    expect(EXTENDED_PICTOGRAPHIC.test(String.fromCodePoint(0x00ae))).toBe(true);
    expect(EXTENDED_PICTOGRAPHIC.test(String.fromCodePoint(0x2122))).toBe(true);
  });

  it("fails with file:line when src/ contains emoji", () => {
    const hits = scanSrcForEmoji();
    expect(hits, formatHits(hits)).toEqual([]);
  });
});
