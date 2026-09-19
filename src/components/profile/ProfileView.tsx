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
      <div className="flex min-h-dvh flex-col bg-surface">
        <OrderHeader title="Profile" backHref="/" backLabel="Back home" />
        <main className="flex flex-1 flex-col px-5 pt-10">
          <h2 className="text-[28px] font-semibold leading-[1.15] tracking-tight text-ink">
            You’re signed out
          </h2>
          <p className="mt-2 max-w-[32ch] text-[15px] leading-relaxed text-ink-muted">
            Demo only — real accounts will land with Supabase auth.
          </p>
          <button
            type="button"
            onClick={() => setSignedOut(false)}
            className="mt-8 flex h-14 items-center justify-center rounded-2xl bg-brand-green text-base font-semibold text-white shadow-gasgo-md transition-transform duration-150 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
          >
            Continue as {profile.firstName || "guest"}
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <OrderHeader
        title={profileHeaderTitle(profile)}
        backHref="/"
        backLabel="Back home"
      />

      <main className="flex flex-1 flex-col gap-6 px-5 pt-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <ProfileUserCard
          name={profileDisplayName(profile) || "Your name"}
          phone={profile.phone}
          onEdit={openEdit}
        />
        <ProfileGaugeCard gauge={gauge} />
        <ProfileOrderHistory orders={orders} />
        <ProfileAddresses addresses={addresses} />
        <ProfileAutoRefill enabled={autoRefill} onToggle={setAutoRefill} />
        <ProfileSupport onLogout={() => setSignedOut(true)} />
      </main>

      <EditProfileSheet
        open={editing}
        name={draftName}
        phone={draftPhone}
        onNameChange={setDraftName}
        onPhoneChange={setDraftPhone}
        onClose={() => setEditing(false)}
        onSave={saveEdit}
      />
    </div>
  );
}
