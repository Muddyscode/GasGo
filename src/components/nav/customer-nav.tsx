"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export type CustomerNavConfig = {
  title?: string;
  backHref?: string;
  backLabel?: string;
};

type CustomerNavContextValue = {
  config: CustomerNavConfig;
  setConfig: Dispatch<SetStateAction<CustomerNavConfig>>;
};

const CustomerNavContext = createContext<CustomerNavContextValue | null>(null);

export function CustomerNavProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<CustomerNavConfig>({});
  const value = useMemo(() => ({ config, setConfig }), [config]);

  return (
    <CustomerNavContext.Provider value={value}>
      {children}
    </CustomerNavContext.Provider>
  );
}

export function useCustomerNavState() {
  const ctx = useContext(CustomerNavContext);
  if (!ctx) {
    throw new Error("useCustomerNavState must be used within CustomerNavProvider");
  }
  return ctx;
}

export function useCustomerNav(config: CustomerNavConfig) {
  const ctx = useContext(CustomerNavContext);
  const setConfig = ctx?.setConfig;

  useEffect(() => {
    if (!setConfig) return;
    setConfig({
      title: config.title,
      backHref: config.backHref,
      backLabel: config.backLabel,
    });
    return () => setConfig({});
  }, [setConfig, config.title, config.backHref, config.backLabel]);
}
