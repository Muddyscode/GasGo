import { describe, expect, it } from "vitest";
import { MARKETING_FAQ_SR, MARKETING_FAQS } from "@/lib/marketing-faq";

describe("marketing FAQ", () => {
  it("answers Port Harcourt plant-refill questions without Lagos", () => {
    expect(MARKETING_FAQS.length).toBeGreaterThanOrEqual(6);
    const blob = `${MARKETING_FAQ_SR} ${MARKETING_FAQS.map((item) => `${item.question} ${item.answer}`).join(" ")}`;
    expect(blob).toMatch(/Port Harcourt/i);
    expect(blob).toMatch(/plant/i);
    expect(blob).toMatch(/Coming soon/i);
    expect(blob).toMatch(/₦1,200|1200/);
    expect(blob).not.toMatch(/Lagos|Lekki|Yaba|Ikeja|Surulere|Gbagada/i);
  });

  it("keeps auto-refill as coming soon only", () => {
    const auto = MARKETING_FAQS.find((item) => item.id === "auto-refill");
    expect(auto?.answer).toMatch(/Coming soon/i);
    expect(auto?.answer).not.toMatch(/available now|turned on|enabled/i);
  });
});
