import { describe, expect, it } from "vitest";
import {
  MARKETING_GREETING_SR,
  MARKETING_GREETINGS,
} from "@/lib/marketing-greetings";

describe("marketing greetings", () => {
  it("cycles about ten kitchen/gas check-ins across English, Pidgin, and a mix", () => {
    const langs = MARKETING_GREETINGS.map((g) => g.lang);
    const english = langs.filter((lang) => lang === "English");
    const pidgin = langs.filter((lang) => lang === "Pidgin");
    const mix = langs.filter((lang) => lang !== "English" && lang !== "Pidgin");

    expect(MARKETING_GREETINGS).toHaveLength(10);
    expect(english).toHaveLength(5);
    expect(pidgin.length).toBeGreaterThanOrEqual(1);
    expect(pidgin.length).toBeLessThanOrEqual(2);
    expect(mix.length).toBeGreaterThanOrEqual(3);
    expect(new Set(mix)).toEqual(new Set(["Yoruba", "Igbo", "Hausa"]));
    expect(MARKETING_GREETINGS.map((g) => g.text).join(" ")).toMatch(
      /gas|kitchen|cylinder|cook|pot/i,
    );
  });

  it("never mentions Lagos — GasGo is Port Harcourt only", () => {
    const blob = `${MARKETING_GREETING_SR} ${MARKETING_GREETINGS.map((g) => `${g.lang} ${g.text}`).join(" ")}`;
    expect(blob).not.toMatch(/Lagos|Lekki|Yaba|Ikeja|Surulere|Gbagada/i);
    expect(blob).toMatch(/Port Harcourt/i);
  });
});
