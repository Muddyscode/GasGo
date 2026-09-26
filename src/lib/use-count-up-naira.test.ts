import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatNaira } from "@/lib/money";
import {
  COUNT_UP_DURATION_MS,
  useCountUpNaira,
} from "@/lib/use-count-up-naira";

function setReducedMotion(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: query.includes("prefers-reduced-motion") ? matches : false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

function installTweenClock() {
  let now = 0;
  vi.spyOn(performance, "now").mockImplementation(() => now);
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
    now += COUNT_UP_DURATION_MS;
    return window.setTimeout(() => cb(now), 0) as unknown as number;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => {
    window.clearTimeout(id);
  });
}

describe("useCountUpNaira", () => {
  beforeEach(() => {
    setReducedMotion(false);
    installTweenClock();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("keeps the tween under 300ms and settles on the exact target", async () => {
    expect(COUNT_UP_DURATION_MS).toBeLessThanOrEqual(300);

    const { result, rerender } = renderHook(
      ({ value }: { value: number }) => useCountUpNaira(value),
      { initialProps: { value: 22450 } },
    );

    expect(result.current.display).toBe(22450);
    expect(result.current.formatted).toBe(formatNaira(22450));

    rerender({ value: 19125 });
    expect(result.current.formattedTarget).toBe(formatNaira(19125));

    await waitFor(() => {
      expect(result.current.display).toBe(19125);
    });
    expect(result.current.formatted).toBe(formatNaira(19125));
    expect(result.current.formatted).toBe(result.current.formattedTarget);
  });

  it("snaps to the final value instantly when motion is reduced", () => {
    setReducedMotion(true);

    const { result, rerender } = renderHook(
      ({ value }: { value: number }) => useCountUpNaira(value),
      { initialProps: { value: 22450 } },
    );

    rerender({ value: 19125 });
    expect(result.current.display).toBe(19125);
    expect(result.current.formatted).toBe(formatNaira(19125));
    expect(result.current.reduced).toBe(true);
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  });
});
