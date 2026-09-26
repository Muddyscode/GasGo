import type { SessionUser } from "@/stores/session";

export type DemoPersonaId = "amaka" | "chef-tolu" | "egbekwu";

export type DemoPersona = {
  id: DemoPersonaId;
  name: string;
  role: string;
  icon: "home" | "chefHat" | "building2";
  user: SessionUser;
};

/**
 * Founder-meeting demo accounts. Each is a normal individual SessionUser —
 * estate and institute personas check out the same way as a household.
 */
export const DEMO_PERSONAS: readonly DemoPersona[] = [
  {
    id: "amaka",
    name: "Amaka",
    role: "Family account",
    icon: "home",
    user: {
      id: "usr_amaka",
      firstName: "Amaka",
      lastName: "Umeh",
      phone: "+2348072219904",
      email: "amaka@example.com",
    },
  },
  {
    id: "chef-tolu",
    name: "Chef Tolu",
    role: "Culinary Institute",
    icon: "chefHat",
    user: {
      id: "usr_chef_tolu",
      firstName: "Tolu",
      lastName: "Adeyemi",
      phone: "+2348093312208",
      email: "tolu@example.com",
    },
  },
  {
    id: "egbekwu",
    name: "Egbekwu Corp",
    role: "Estate account",
    icon: "building2",
    user: {
      id: "usr_egbekwu",
      firstName: "Egbekwu",
      lastName: "Corp",
      phone: "+2348088444645",
      email: "estate@example.com",
    },
  },
] as const;

export const DEFAULT_DEMO_PERSONA_ID: DemoPersonaId = "amaka";

export function getDemoPersona(id: DemoPersonaId): DemoPersona {
  const persona = DEMO_PERSONAS.find((entry) => entry.id === id);
  if (!persona) {
    throw new Error(`Unknown demo persona: ${id}`);
  }
  return persona;
}
