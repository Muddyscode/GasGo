"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      offset={72}
      toastOptions={{
        className:
          "!border-border !bg-surface !text-ink !shadow-[0_8px_32px_rgba(11,31,20,0.08)]",
      }}
    />
  );
}
