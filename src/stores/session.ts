"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const SESSION_STORAGE_KEY = "gasgo-session";

export type SessionUser = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

type SessionStore = {
  user: SessionUser | null;
  signIn: (user: SessionUser) => void;
  signOut: () => void;
};

/**
 * Mock customer session. Real Supabase auth is out of scope.
 * signIn / signOut must never touch the order draft (gasgo-order-draft).
 */
export const useSession = create<SessionStore>()(
  persist(
    (set) => ({
      user: null,
      signIn: (user) => set({ user }),
      signOut: () => set({ user: null }),
    }),
    {
      name: SESSION_STORAGE_KEY,
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
