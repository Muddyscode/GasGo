import { describe, expect, it } from "vitest";
import {
  COMING_SOON_LINE,
  MARKETING_GREETING_SR,
  MARKETING_HEADLINE,
  MARKETING_LEDE,
  MARKETING_SAFETY,
} from "@/lib/marketing-greetings";

describe("marketing greetings", () => {
  it("uses one calm English headline, never Pidgin or cycling language tags", () => {
    const blob = `${MARKETING_HEADLINE} ${MARKETING_LEDE} ${MARKETING_GREETING_SR}`;
    expect(MARKETING_HEADLINE).toMatch(/cylinder|door|pot/i);
    expect(blob).not.toMatch(/Pidgin|Yoruba|Igbo|Hausa|English/i);
    expect(blob).not.toMatch(/dey\b|boil\b|Ṣé|agwụbeghị|ɗinka/i);
    expect(blob).toMatch(/Port Harcourt/i);
    expect(MARKETING_SAFETY).toBe("Nothing is filled at your door.");
    expect(COMING_SOON_LINE).toMatch(/smart gauge/i);
  });

  it("never mentions Lagos — GasGo is Port Harcourt only", () => {
    const blob = `${MARKETING_GREETING_SR} ${MARKETING_HEADLINE} ${MARKETING_LEDE}`;
    expect(blob).not.toMatch(/Lagos|Lekki|Yaba|Ikeja|Surulere|Gbagada/i);
    expect(blob).toMatch(/Port Harcourt/i);
  });
});
