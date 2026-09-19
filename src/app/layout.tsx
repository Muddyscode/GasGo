import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "GasGo",
  description: "Know your gas. Order with confidence.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-surface antialiased md:bg-surface-muted">
        {children}
      </body>
    </html>
  );
}
