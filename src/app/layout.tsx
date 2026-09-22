import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import { AppToaster } from "@/components/providers/AppToaster";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { THEME_BOOTSTRAP } from "@/lib/theme";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GasGo",
  description:
    "Port Harcourt cooking gas. Collect → plant refill → return. Pay before pickup.",
  icons: {
    icon: [{ url: "/brand/gasgo-mark.svg", type: "image/svg+xml" }],
    shortcut: "/brand/gasgo-mark.svg",
    apple: "/brand/gasgo-mark.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body className={`${display.variable} min-h-dvh antialiased`}>
        <ThemeProvider>
          {children}
          <AppToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
