import type { Metadata, Viewport } from "next";
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

const SITE_URL = "https://gas-go-nine.vercel.app";
const SITE_DESCRIPTION =
  "Port Harcourt cooking gas. Collect empty, plant refill offsite, return full. Nothing is filled at your door.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "GasGo",
  description: SITE_DESCRIPTION,
  applicationName: "GasGo",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "GasGo",
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "GasGo",
    title: "GasGo",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: "/og.webp", width: 1200, height: 630, alt: "GasGo plant refill" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GasGo",
    description: SITE_DESCRIPTION,
    images: ["/og.webp"],
  },
  icons: {
    icon: [
      { url: "/brand/gasgo-mark.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/brand/gasgo-mark.svg",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#16231C" },
  ],
  width: "device-width",
  initialScale: 1,
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
