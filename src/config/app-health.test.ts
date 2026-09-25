import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = path.resolve(__dirname, "../..");
const SRC = path.resolve(__dirname, "..");

function readSrc(rel: string) {
  return readFileSync(path.resolve(SRC, rel), "utf8");
}

describe("app-wide metadata, manifest, and icons", () => {
  it("ships a PWA manifest, apple icon, and Open Graph image", () => {
    expect(existsSync(path.resolve(ROOT, "public/manifest.webmanifest"))).toBe(true);
    expect(existsSync(path.resolve(ROOT, "public/apple-touch-icon.png"))).toBe(true);
    expect(existsSync(path.resolve(ROOT, "public/icons/icon-192.png"))).toBe(true);
    expect(existsSync(path.resolve(ROOT, "public/icons/icon-512.png"))).toBe(true);
    expect(existsSync(path.resolve(ROOT, "public/og.webp"))).toBe(true);

    const manifest = JSON.parse(
      readFileSync(path.resolve(ROOT, "public/manifest.webmanifest"), "utf8"),
    ) as { name?: string; icons?: { src: string }[] };
    expect(manifest.name).toBe("GasGo");
    expect(manifest.icons?.some((icon) => icon.src.includes("icon-192"))).toBe(true);

    const layout = readSrc("app/layout.tsx");
    expect(layout).toMatch(/metadataBase/);
    expect(layout).toMatch(/openGraph/);
    expect(layout).toMatch(/manifest\.webmanifest/);
    expect(layout).toMatch(/apple-touch-icon/);
    expect(existsSync(path.resolve(SRC, "app/robots.ts"))).toBe(true);
  });
});
