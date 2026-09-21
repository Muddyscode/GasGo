"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { AuthModal } from "@/components/auth/AuthModal";
import { useSession } from "@/stores/session";

type AuthModalContextValue = {
  open: boolean;
  intent: string | null;
  requestAuth: (intent?: string | null) => boolean;
  openAuth: (intent?: string | null) => void;
  closeAuth: () => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState<string | null>(null);

  const closeAuth = useCallback(() => {
    setOpen(false);
  }, []);

  const openAuth = useCallback((nextIntent?: string | null) => {
    setIntent(nextIntent ?? null);
    setOpen(true);
  }, []);

  const requestAuth = useCallback(
    (nextIntent?: string | null) => {
      if (useSession.getState().user) return true;
      openAuth(nextIntent ?? "/order/checkout");
      return false;
    },
    [openAuth],
  );

  const handleSuccess = useCallback(() => {
    const next = intent ?? "/";
    setOpen(false);
    setIntent(null);
    router.push(next);
  }, [intent, router]);

  const value = useMemo(
    () => ({ open, intent, requestAuth, openAuth, closeAuth }),
    [open, intent, requestAuth, openAuth, closeAuth],
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <AuthModal
        open={open}
        intent={intent}
        onClose={closeAuth}
        onSuccess={handleSuccess}
      />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error("useAuthModal must be used within AuthProvider");
  }
  return ctx;
}
