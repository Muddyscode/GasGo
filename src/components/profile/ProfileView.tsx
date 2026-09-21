"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/components/auth/AuthProvider";
import { OrderHeader } from "@/components/order/OrderHeader";
import { EditProfileSheet } from "@/components/profile/EditProfileSheet";
import { ProfileAddresses } from "@/components/profile/ProfileAddresses";
import { ProfileAutoRefill } from "@/components/profile/ProfileAutoRefill";
import { ProfileGaugeCard } from "@/components/profile/ProfileGaugeCard";
import { ProfileOrderHistory } from "@/components/profile/ProfileOrderHistory";
import { ProfileSupport } from "@/components/profile/ProfileSupport";
import { ProfileUserCard } from "@/components/profile/ProfileUserCard";
import { buttonClassName } from "@/components/ui/button";
import { PageBody, PageFrame } from "@/components/ui/page";
import {
  getMockAddresses,
  getMockGauge,
  ordersForUser,
  profileDisplayName,
  profileFromSession,
  profileHeaderTitle,
} from "@/data/profile";
import { usePersistHydrated } from "@/lib/use-persist-hydrated";
import { useCustomerOrders } from "@/stores/customer-orders";
import { useSession } from "@/stores/session";

export function ProfileView() {
  const router = useRouter();
  const hydrated = usePersistHydrated();
  const user = useSession((state) => state.user);
  const signIn = useSession((state) => state.signIn);
  const signOut = useSession((state) => state.signOut);
  const { openAuth } = useAuthModal();
  const profile = profileFromSession(user);
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(profileDisplayName(profile));
  const [draftPhone, setDraftPhone] = useState(profile.phone);

  const gauge = useMemo(() => getMockGauge(), []);
  const placed = useCustomerOrders((state) => state.orders);
  const orders = useMemo(
    () => ordersForUser(user?.id, placed),
    [user?.id, placed],
  );
  const addresses = useMemo(() => getMockAddresses(), []);

  if (!hydrated) {
    return (
      <PageFrame>
        <OrderHeader title="Profile" backHref="/" backLabel="Back home" />
        <PageBody className="pt-10">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-surface-muted" />
          <div className="mt-3 h-4 w-56 animate-pulse rounded-lg bg-surface-muted" />
        </PageBody>
      </PageFrame>
    );
  }

  function openEdit() {
    setDraftName(profileDisplayName(profile));
    setDraftPhone(profile.phone);
    setEditing(true);
  }

  function saveEdit() {
    if (!user) return;
    const parts = draftName.trim().split(/\s+/).filter(Boolean);
    signIn({
      ...user,
      firstName: parts[0] ?? user.firstName,
      lastName: parts.slice(1).join(" "),
      phone: draftPhone.trim(),
    });
    setEditing(false);
  }

  function handleLogout() {
    signOut();
    router.push("/");
  }

  if (!user) {
    return (
      <PageFrame>
        <OrderHeader title="Profile" backHref="/" backLabel="Back home" />
        <PageBody className="pt-10">
          <h2 className="text-[28px] font-semibold leading-[1.15] tracking-tight text-ink md:text-[32px]">
            You’re signed out
          </h2>
          <p className="mt-2 max-w-[36ch] text-[15px] leading-relaxed text-ink-muted">
            Mock accounts only for now. Signing in never clears a fill you already
            drafted.
          </p>
          <button
            type="button"
            onClick={() => openAuth("/profile")}
            className={buttonClassName({ variant: "primary", size: "lg" }, "mt-8")}
          >
            Sign in
          </button>
        </PageBody>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <OrderHeader
        title={profileHeaderTitle(profile)}
        backHref="/"
        backLabel="Back home"
      />

      <PageBody className="gap-6 pb-[max(2rem,env(safe-area-inset-bottom))] lg:gap-8">
        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-8">
          <div className="flex flex-col gap-6 lg:col-span-5">
            <ProfileUserCard
              name={profileDisplayName(profile) || "Your name"}
              phone={profile.phone}
              onEdit={openEdit}
            />
            <ProfileGaugeCard gauge={gauge} />
            <ProfileAutoRefill />
          </div>
          <div className="mt-6 flex flex-col gap-6 lg:col-span-7 lg:mt-0">
            <ProfileOrderHistory orders={orders} />
            <ProfileAddresses addresses={addresses} />
            <ProfileSupport onLogout={handleLogout} />
          </div>
        </div>
      </PageBody>

      <EditProfileSheet
        open={editing}
        name={draftName}
        phone={draftPhone}
        onNameChange={setDraftName}
        onPhoneChange={setDraftPhone}
        onClose={() => setEditing(false)}
        onSave={saveEdit}
      />
    </PageFrame>
  );
}
