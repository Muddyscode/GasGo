export const THEME_STORAGE_KEY = "gasgo-theme";

export const THEME_PREFERENCES = ["system", "light", "dark"] as const;

export type ThemePreference = (typeof THEME_PREFERENCES)[number];
export type ResolvedTheme = "light" | "dark";

export function isThemePreference(value: unknown): value is ThemePreference {
  return (
    value === "system" ||
    value === "light" ||
    value === "dark"
  );
}

export function readThemePreference(raw: string | null | undefined): ThemePreference {
  return isThemePreference(raw) ? raw : "system";
}

export function resolveTheme(
  preference: ThemePreference,
  systemDark: boolean,
): ResolvedTheme {
  if (preference === "system") return systemDark ? "dark" : "light";
  return preference;
}

/** Clicking the nav toggle flips the resolved appearance and persists that choice. */
export function toggleThemePreference(
  preference: ThemePreference,
  systemDark: boolean,
): Exclude<ThemePreference, "system"> {
  return resolveTheme(preference, systemDark) === "dark" ? "light" : "dark";
}

export const THEME_BOOTSTRAP = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var t=localStorage.getItem(k);var d=window.matchMedia("(prefers-color-scheme: dark)").matches;var dark=t==="dark"||(t!=="light"&&d);var r=document.documentElement;r.classList.toggle("dark",dark);r.style.colorScheme=dark?"dark":"light";}catch(e){}})();`;
