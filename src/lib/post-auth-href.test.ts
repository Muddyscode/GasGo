import { beforeEach, describe, expect, it } from "vitest";
import { SAVED_ADDRESSES } from "@/config/delivery";
import { postAuthHref } from "@/lib/post-auth-href";
import { useOrderDraft } from "@/stores/order-draft";
import { useSession } from "@/stores/session";

describe("postAuthHref", () => {
  beforeEach(() => {
    localStorage.clear();
    useOrderDraft.getState().clear();
    useSession.setState({ user: null });
  });

  it("prefers nextHref, then a ready draft checkout, else home", () => {
    expect(postAuthHref(undefined)).toBe("/");
    expect(postAuthHref("/profile")).toBe("/profile");

    useOrderDraft.getState().setCapacityKg(12.5);
    useOrderDraft.getState().setFillMode("full");
    useOrderDraft.getState().setAddress(SAVED_ADDRESSES[0]);
    useOrderDraft.getState().setPresence("someone-home");
    expect(useOrderDraft.getState().isReadyForCheckout()).toBe(true);

    expect(postAuthHref(null)).toBe("/order/checkout");
    expect(postAuthHref("/order/checkout")).toBe("/order/checkout");
    expect(postAuthHref("/profile")).toBe("/profile");
  });
});
