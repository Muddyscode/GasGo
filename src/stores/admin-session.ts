"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ADMIN_SESSION_STORAGE_KEY,
  pinMatches,
} from "@/lib/admin/auth";

type AdminSessionStore = {
  unlocked: boolean;
  unlock: (pin: string) => boolean;
  lock: () => void;
};

/**
 * Minimal admin gate. The unlocked flag is localStorage-only (demo).
 * Random visitors cannot stage-bump orders without the demo PIN.
 */
export const useAdminSession = create<AdminSessionStore>()(
  persist(
    (set) => ({
      unlocked: false,
      unlock: (pin) => {
        if (!pinMatches(pin)) return false;
        set({ unlocked: true });
        return true;
      },
      lock: () => set({ unlocked: false }),
    }),
    {
      name: ADMIN_SESSION_STORAGE_KEY,
      partialize: (state) => ({ unlocked: state.unlocked }),
    },
  ),
);
