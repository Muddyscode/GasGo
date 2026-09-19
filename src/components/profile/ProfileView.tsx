"use client";

import { useMemo, useState } from "react";
import { AppNavbar } from "@/components/nav/AppNavbar";
import { EditProfileSheet } from "@/components/profile/EditProfileSheet";
import { AppCanvas, WideShell } from "@/components/ui/PageShell";
import { Pressable } from "@/components/ui/Pressable";
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
      <AppCanvas>
        <AppNavbar />
        <WideShell className="max-w-md pt-10 md:max-w-lg">
          <h2 className="text-[28px] font-semibold leading-[1.15] tracking-tight text-ink">
            You’re signed out
          </h2>
          <p className="mt-2 max-w-[32ch] text-[15px] leading-relaxed text-ink-muted">
            Demo only — real accounts will land with Supabase auth.
          </p>
          <Pressable
            className="mt-8 w-full"
            onClick={() => setSignedOut(false)}
          >
            Continue as {profile.firstName || "guest"}
          </Pressable>
        </WideShell>
      </AppCanvas>
    );
  }

  return (
    <AppCanvas>
      <AppNavbar />

      <WideShell className="flex flex-1 flex-col gap-6 pt-6 pb-[max(2rem,env(safe-area-inset-bottom))] md:max-w-3xl lg:max-w-3xl">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-green">
          {profileHeaderTitle(profile)}
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <ProfileUserCard
            name={profileDisplayName(profile) || "Your name"}
            phone={profile.phone}
            onEdit={openEdit}
          />
          <ProfileGaugeCard gauge={gauge} />
        </div>
        <ProfileOrderHistory orders={orders} />
        <ProfileAddresses addresses={addresses} />
        <ProfileAutoRefill enabled={autoRefill} onToggle={setAutoRefill} />
        <ProfileSupport onLogout={() => setSignedOut(true)} />
      </WideShell>

      <EditProfileSheet
        open={editing}
        name={draftName}
        phone={draftPhone}
        onNameChange={setDraftName}
        onPhoneChange={setDraftPhone}
        onClose={() => setEditing(false)}
        onSave={saveEdit}
      />
    </AppCanvas>
  );
}
