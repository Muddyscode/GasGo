import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppToaster } from "@/components/providers/AppToaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "GasGo",
  description:
    "Port Harcourt cooking gas. Collect → plant refill → return. Pay before pickup.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
