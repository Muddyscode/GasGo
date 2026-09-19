"use client";

import { useMemo, useState } from "react";
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
  getMockOrders,
  getMockProfile,
  profileDisplayName,
  profileHeaderTitle,
  type CustomerProfile,
} from "@/data/profile";

function applyDisplayName(profile: CustomerProfile, name: string): CustomerProfile {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    ...profile,
    firstName: parts[0] ?? null,
    lastName: parts.slice(1).join(" ") || null,
  };
}

export function ProfileView() {
  const [profile, setProfile] = useState(getMockProfile);
  const [autoRefill, setAutoRefill] = useState(profile.autoRefillEnabled);
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(profileDisplayName(profile));
  const [draftPhone, setDraftPhone] = useState(profile.phone);
  const [signedOut, setSignedOut] = useState(false);

  const gauge = useMemo(() => getMockGauge(), []);
  const orders = useMemo(() => getMockOrders(), []);
  const addresses = useMemo(() => getMockAddresses(), []);

  function openEdit() {
    setDraftName(profileDisplayName(profile));
    setDraftPhone(profile.phone);
    setEditing(true);
  }

  function saveEdit() {
    setProfile((current) => ({
      ...applyDisplayName(current, draftName),
      phone: draftPhone.trim(),
    }));
    setEditing(false);
  }

  if (signedOut) {
    return (
      <PageFrame>
        <OrderHeader title="Profile" backHref="/" backLabel="Back home" />
        <PageBody className="pt-10">
          <h2 className="text-[28px] font-semibold leading-[1.15] tracking-tight text-ink md:text-[32px]">
            You’re signed out
          </h2>
          <p className="mt-2 max-w-[32ch] text-[15px] leading-relaxed text-ink-muted">
            Demo only — real accounts will land with Supabase auth.
          </p>
          <button
            type="button"
            onClick={() => setSignedOut(false)}
            className={buttonClassName({ variant: "primary", size: "lg" }, "mt-8")}
          >
            Continue as {profile.firstName || "guest"}
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
            <ProfileAutoRefill enabled={autoRefill} onToggle={setAutoRefill} />
          </div>
          <div className="mt-6 flex flex-col gap-6 lg:col-span-7 lg:mt-0">
            <ProfileOrderHistory orders={orders} />
            <ProfileAddresses addresses={addresses} />
            <ProfileSupport onLogout={() => setSignedOut(true)} />
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
