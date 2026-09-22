"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LEGACY_HASHES: Record<string, string> = {
  "#how-it-works": "/how-it-works",
  "#zones": "/zones",
  "#why-gasgo": "/why",
};

export function LegacyMarketingHashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const next = LEGACY_HASHES[window.location.hash];
    if (next) router.replace(next);
  }, [router]);

  return null;
}
