export const ZONE_PIN_LAYOUT: Record<
  string,
  { x: number; y: number; tone: "green" | "yellow" | "ink"; label: string }
> = {
  rumuokoro: { x: 8, y: 16, tone: "green", label: "Rumuokoro" },
  eliozu: { x: 54, y: 12, tone: "yellow", label: "Eliozu" },
  woji: { x: 76, y: 22, tone: "ink", label: "Woji" },
  "old-gra": { x: 8, y: 30, tone: "green", label: "Old GRA" },
  rumuola: { x: 42, y: 36, tone: "yellow", label: "Rumuola" },
  "trans-amadi": { x: 64, y: 48, tone: "yellow", label: "Trans-Amadi" },
  "ada-george": { x: 8, y: 50, tone: "ink", label: "Ada George" },
  diobu: { x: 10, y: 66, tone: "green", label: "Diobu" },
};
