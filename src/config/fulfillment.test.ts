import { describe, expect, it } from "vitest";
import { quoteFill } from "./pricing";
import {
  CUTOFF_EXPLANATION,
  SAME_DAY_CUTOFF_HOUR_WAT,
  SAME_DAY_CUSTOMER_REMINDER,
  applyFulfillmentToQuote,
  defaultOrderDates,
  earliestSelectableDate,
  formatLagosDate,
  isAfterSameDayCutoff,
  isSelectableDate,
  isSameDayLoop,
  isValidIsoDate,
  listSelectableDates,
  normalizeOrderDates,
} from "./fulfillment";

/** 21 Sep 2026 19:00 WAT (18:00 UTC) — before 8:00pm cutoff. */
const BEFORE_CUTOFF = new Date("2026-09-21T18:00:00.000Z");
/** 21 Sep 2026 20:00 WAT (19:00 UTC) — cutoff inclusive. */
const AT_CUTOFF = new Date("2026-09-21T19:00:00.000Z");
/** 21 Sep 2026 21:30 WAT (20:30 UTC) — after cutoff. */
const AFTER_CUTOFF = new Date("2026-09-21T20:30:00.000Z");

describe("8:00pm WAT cutoff + calendar dates", () => {
  it("documents the 20:00 Africa/Lagos cutoff", () => {
    expect(SAME_DAY_CUTOFF_HOUR_WAT).toBe(20);
    expect(CUTOFF_EXPLANATION).toMatch(/8:00pm WAT/i);
    expect(CUTOFF_EXPLANATION).toMatch(/bus/i);
  });

  it("defaults both dates to today before cutoff", () => {
    expect(formatLagosDate(BEFORE_CUTOFF)).toBe("2026-09-21");
    expect(isAfterSameDayCutoff(BEFORE_CUTOFF)).toBe(false);
    expect(defaultOrderDates(BEFORE_CUTOFF)).toEqual({
      pickupDate: "2026-09-21",
      returnDate: "2026-09-21",
    });
    expect(isSameDayLoop("2026-09-21", "2026-09-21")).toBe(true);
    expect(SAME_DAY_CUSTOMER_REMINDER).toMatch(/same day/i);
  });

  it("blocks today and rolls both dates to tomorrow at/after 20:00 WAT", () => {
    expect(isAfterSameDayCutoff(AT_CUTOFF)).toBe(true);
    expect(isAfterSameDayCutoff(AFTER_CUTOFF)).toBe(true);
    expect(earliestSelectableDate(AFTER_CUTOFF)).toBe("2026-09-22");
    expect(isSelectableDate("2026-09-21", AFTER_CUTOFF)).toBe(false);
    expect(defaultOrderDates(AFTER_CUTOFF)).toEqual({
      pickupDate: "2026-09-22",
      returnDate: "2026-09-22",
    });

    const rolled = normalizeOrderDates("2026-09-21", "2026-09-21", AFTER_CUTOFF);
    expect(rolled.ok).toBe(true);
    expect(rolled.rolledFromToday).toBe(true);
    expect(rolled.pickupDate).toBe("2026-09-22");
    expect(rolled.returnDate).toBe("2026-09-22");
  });

  it("requires returnDate >= pickupDate and only selectable days", () => {
    const invalidCalendar = normalizeOrderDates("2026-02-31", "2026-02-31", BEFORE_CUTOFF);
    expect(isValidIsoDate("2026-02-31")).toBe(false);
    expect(invalidCalendar.pickupDate).toBe("2026-09-21");

    const swapped = normalizeOrderDates("2026-09-23", "2026-09-22", BEFORE_CUTOFF);
    expect(swapped.ok).toBe(true);
    expect(swapped.pickupDate).toBe("2026-09-23");
    expect(swapped.returnDate).toBe("2026-09-23");

    const horizon = listSelectableDates(BEFORE_CUTOFF);
    expect(horizon[0]).toBe("2026-09-21");
    expect(horizon).toHaveLength(7);
    const tooFar = normalizeOrderDates("2026-12-01", "2026-12-02", BEFORE_CUTOFF);
    expect(tooFar.pickupDate).toBe(horizon[horizon.length - 1]);
    expect(isSelectableDate(tooFar.pickupDate, BEFORE_CUTOFF)).toBe(true);
  });

  it("does not rewrite quoteFill — hub only zeros delivery after the engine runs", () => {
    const engine = quoteFill({
      fillMode: "full",
      capacityKg: 12.5,
      zoneId: "old-gra",
    });
    expect(engine.deliveryNgn).toBe(1500);

    const hub = applyFulfillmentToQuote(engine, "hub");
    expect(hub.deliveryNgn).toBe(0);
    expect(hub.totalNgn).toBe(engine.gasFillNgn);
    expect(hub.lines[1]?.label).toMatch(/hub self-serve/i);
    expect(engine.deliveryNgn).toBe(1500);

    const door = applyFulfillmentToQuote(engine, "door_to_door");
    expect(door.deliveryNgn).toBe(1500);
  });
});
