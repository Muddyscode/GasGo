import { readFileSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { SAVED_ADDRESSES } from "@/config/delivery";
import { LIVE_RATE_NGN_PER_KG, getZone } from "@/config/pricing";
import { DEMO_PERSONAS } from "@/data/demo-personas";
import { signInDemoPersona } from "@/lib/demo-persona-signin";
import { postAuthHref } from "@/lib/post-auth-href";
import { ORDER_DRAFT_STORAGE_KEY, useOrderDraft } from "@/stores/order-draft";
import { useSession } from "@/stores/session";

const SRC = path.resolve(__dirname, "..");

function readSrc(rel: string) {
  return readFileSync(path.resolve(SRC, rel), "utf8");
}

function seedReadyDraft() {
  const home = SAVED_ADDRESSES[0];
  useOrderDraft.getState().setCapacityKg(12.5);
  useOrderDraft.getState().setFillMode("full");
  useOrderDraft.getState().setAddress(home);
  useOrderDraft.getState().setPresence("someone-home");
}

describe("demo persona sign-in", () => {
  beforeEach(() => {
    localStorage.clear();
    useOrderDraft.getState().clear();
    useSession.setState({ user: null });
  });

  it("keeps gasgo-order-draft and redirects to /order/checkout when that is next", () => {
    seedReadyDraft();
    const before = useOrderDraft.getState().quote();
    const rawBefore = localStorage.getItem(ORDER_DRAFT_STORAGE_KEY);

    const result = signInDemoPersona("amaka", "/order/checkout");

    expect(result.redirectTo).toBe("/order/checkout");
    expect(result.user.firstName).toBe("Amaka");
    expect(useSession.getState().user?.id).toBe("usr_amaka");
    expect(useOrderDraft.getState().capacityKg).toBe(12.5);
    expect(useOrderDraft.getState().fillMode).toBe("full");
    expect(useOrderDraft.getState().address?.zoneId).toBe("old-gra");
    expect(useOrderDraft.getState().presenceId).toBe("someone-home");
    expect(useOrderDraft.getState().quote().totalNgn).toBe(before.totalNgn);
    expect(useOrderDraft.getState().quote().gasFillNgn).toBe(
      Math.round(12.5 * LIVE_RATE_NGN_PER_KG),
    );
    expect(useOrderDraft.getState().quote().deliveryNgn).toBe(getZone("old-gra")?.feeNgn);
    expect(localStorage.getItem(ORDER_DRAFT_STORAGE_KEY)).toBe(rawBefore);
    expect(ORDER_DRAFT_STORAGE_KEY).toBe("gasgo-order-draft");
  });

  it("sends a ready draft to /order/checkout when there is no next param", () => {
    seedReadyDraft();
    expect(useOrderDraft.getState().isReadyForCheckout()).toBe(true);
    const rawBefore = localStorage.getItem(ORDER_DRAFT_STORAGE_KEY);

    const result = signInDemoPersona("amaka");

    expect(result.redirectTo).toBe("/order/checkout");
    expect(postAuthHref(null)).toBe("/order/checkout");
    expect(postAuthHref(undefined)).toBe("/order/checkout");
    expect(localStorage.getItem(ORDER_DRAFT_STORAGE_KEY)).toBe(rawBefore);
    expect(useSession.getState().user?.firstName).toBe("Amaka");
  });

  it("signs estate and institute personas in as ordinary individual accounts", () => {
    seedReadyDraft();
    const chef = signInDemoPersona("chef-tolu", "/order/checkout");
    expect(chef.redirectTo).toBe("/order/checkout");
    expect(chef.user).toEqual({
      id: "usr_chef_tolu",
      firstName: "Tolu",
      lastName: "Adeyemi",
      phone: "+2348093312208",
      email: "tolu@example.com",
    });
    expect(useOrderDraft.getState().capacityKg).toBe(12.5);

    const estate = signInDemoPersona("egbekwu", "/order/checkout");
    expect(estate.user).toEqual({
      id: "usr_egbekwu",
      firstName: "Egbekwu",
      lastName: "Corp",
      phone: "+2348088444645",
      email: "estate@example.com",
    });
    expect(useSession.getState().user).toMatchObject({
      firstName: "Egbekwu",
      lastName: "Corp",
    });
    expect(useOrderDraft.getState().address?.line).toBe(SAVED_ADDRESSES[0]?.line);
  });

  it("never wipes the draft from the persona sign-in path", () => {
    const files = [
      "lib/demo-persona-signin.ts",
      "lib/post-auth-href.ts",
      "data/demo-personas.ts",
      "components/auth/DemoPersonaPicker.tsx",
      "components/auth/AuthEntryView.tsx",
      "stores/session.ts",
    ];
    for (const file of files) {
      expect(readSrc(file), file).not.toMatch(/\.clear\(/);
    }
    expect(readSrc("components/auth/AuthEntryView.tsx")).toMatch(/postAuthHref/);
    expect(readSrc("lib/demo-persona-signin.ts")).toMatch(/postAuthHref/);
    expect(DEMO_PERSONAS.map((persona) => persona.name)).toEqual([
      "Amaka",
      "Chef Tolu",
      "Egbekwu Corp",
    ]);
    expect(DEMO_PERSONAS.every((persona) => !("accountType" in persona.user))).toBe(true);
  });
});
