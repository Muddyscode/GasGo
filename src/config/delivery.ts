export type DeliveryAddress = {
  id: string;
  label: string;
  line: string;
  area: string;
};

export const SAVED_ADDRESSES: readonly DeliveryAddress[] = [
  {
    id: "home",
    label: "Home",
    line: "14 Admiralty Way, Lekki Phase 1",
    area: "Lekki",
  },
  {
    id: "work",
    label: "Work",
    line: "8A Isaac John Street, GRA",
    area: "Ikeja",
  },
  {
    id: "mum",
    label: "Mum’s place",
    line: "27 Hughes Avenue, Alagomeji",
    area: "Yaba",
  },
  {
    id: "bisi",
    label: "Aunty Bisi",
    line: "45 Bode Thomas Street",
    area: "Surulere",
  },
] as const;

export const PRESENCE_IDS = [
  "someone-home",
  "call-on-arrival",
  "leave-at-gate",
  "security",
] as const;

export type PresenceId = (typeof PRESENCE_IDS)[number];

export type PresenceOption = {
  id: PresenceId;
  title: string;
  detail: string;
};

export const PRESENCE_OPTIONS: readonly PresenceOption[] = [
  {
    id: "someone-home",
    title: "Someone will be home",
    detail: "We’ll hand the cylinder to you at the door.",
  },
  {
    id: "call-on-arrival",
    title: "Call me on arrival",
    detail: "The rider will call before coming up.",
  },
  {
    id: "leave-at-gate",
    title: "Leave at the gate / with security",
    detail: "No need to come downstairs.",
  },
  {
    id: "security",
    title: "Security will receive it",
    detail: "Estate or office security can sign for it.",
  },
] as const;

export const WINDOW_IDS = ["asap", "morning", "afternoon", "evening"] as const;

export type DeliveryWindowId = (typeof WINDOW_IDS)[number];

export type DeliveryWindow = {
  id: DeliveryWindowId;
  title: string;
  detail: string;
};

export const DEFAULT_DELIVERY_WINDOW: DeliveryWindowId = "asap";

export const DELIVERY_WINDOWS: readonly DeliveryWindow[] = [
  {
    id: "asap",
    title: "As soon as possible",
    detail: "Usually under 90 minutes",
  },
  {
    id: "morning",
    title: "Morning",
    detail: "8am – 12pm",
  },
  {
    id: "afternoon",
    title: "Afternoon",
    detail: "12pm – 4pm",
  },
  {
    id: "evening",
    title: "Evening",
    detail: "4pm – 7pm",
  },
] as const;

export function isPresenceId(value: string | null | undefined): value is PresenceId {
  return PRESENCE_IDS.includes(value as PresenceId);
}

export function isDeliveryWindowId(
  value: string | null | undefined,
): value is DeliveryWindowId {
  return WINDOW_IDS.includes(value as DeliveryWindowId);
}

export function getSavedAddressById(
  id: string | null | undefined,
): DeliveryAddress | undefined {
  if (!id) return undefined;
  return SAVED_ADDRESSES.find((address) => address.id === id);
}

export function getPresenceById(
  id: string | null | undefined,
): PresenceOption | undefined {
  if (!isPresenceId(id)) return undefined;
  return PRESENCE_OPTIONS.find((option) => option.id === id);
}

export function getWindowById(
  id: string | null | undefined,
): DeliveryWindow | undefined {
  if (!isDeliveryWindowId(id)) return undefined;
  return DELIVERY_WINDOWS.find((option) => option.id === id);
}

export function createCustomAddress(
  input: Omit<DeliveryAddress, "id">,
): DeliveryAddress {
  const slug = input.label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24);
  return {
    id: `custom-${slug || "address"}-${Date.now().toString(36)}`,
    label: input.label.trim(),
    line: input.line.trim(),
    area: input.area.trim(),
  };
}
