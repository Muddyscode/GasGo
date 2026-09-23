import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Inter_Tight } from "next/font/google";
import { AppToaster } from "@/components/providers/AppToaster";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { THEME_BOOTSTRAP } from "@/lib/theme";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GasGo",
  description:
    "Port Harcourt cooking gas. Collect empty, plant refill offsite, return full. Nothing is filled at your door.",
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
      <body className={`${sans.variable} ${display.variable} min-h-dvh font-sans antialiased`}>
        <ThemeProvider>
          {children}
          <AppToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
