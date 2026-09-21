import { describe, expect, it } from "vitest";
import {
  MARKETING_GREETING_SR,
  MARKETING_GREETINGS,
} from "@/lib/marketing-greetings";

describe("marketing greetings", () => {
  it("cycles Pidgin, Yoruba, Igbo, Hausa, and English kitchen/gas lines", () => {
    const langs = MARKETING_GREETINGS.map((g) => g.lang);
    expect(langs).toEqual(["Pidgin", "Yoruba", "Igbo", "Hausa", "English"]);
    expect(MARKETING_GREETINGS.map((g) => g.text).join(" ")).toMatch(/gas|kitchen/i);
  });

  it("never mentions Lagos — GasGo is Port Harcourt only", () => {
    const blob = `${MARKETING_GREETING_SR} ${MARKETING_GREETINGS.map((g) => `${g.lang} ${g.text}`).join(" ")}`;
    expect(blob).not.toMatch(/Lagos|Lekki|Yaba|Ikeja|Surulere|Gbagada/i);
    expect(blob).toMatch(/Port Harcourt/i);
  });
});
