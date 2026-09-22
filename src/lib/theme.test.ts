import { describe, expect, it } from "vitest";
import {
  THEME_STORAGE_KEY,
  readThemePreference,
  resolveTheme,
  toggleThemePreference,
} from "@/lib/theme";

describe("theme preference", () => {
  it("defaults to system and follows the device", () => {
    expect(readThemePreference(null)).toBe("system");
    expect(readThemePreference("nope")).toBe("system");
    expect(resolveTheme("system", false)).toBe("light");
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("toggle overrides system with the opposite resolved theme", () => {
    expect(toggleThemePreference("system", true)).toBe("light");
    expect(toggleThemePreference("system", false)).toBe("dark");
    expect(toggleThemePreference("dark", false)).toBe("light");
    expect(toggleThemePreference("light", true)).toBe("dark");
  });

  it("persists under a GasGo-scoped key", () => {
    expect(THEME_STORAGE_KEY).toBe("gasgo-theme");
  });
});
