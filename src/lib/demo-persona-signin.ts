import { getDemoPersona, type DemoPersonaId } from "@/data/demo-personas";
import { postAuthHref } from "@/lib/post-auth-href";
import { useSession, type SessionUser } from "@/stores/session";

export type DemoPersonaSignInResult = {
  user: SessionUser;
  redirectTo: string;
};

/**
 * Signs into the local session store as a chosen persona.
 * Must never touch the order draft (gasgo-order-draft).
 */
export function signInDemoPersona(
  personaId: DemoPersonaId,
  nextHref?: string | null,
): DemoPersonaSignInResult {
  const persona = getDemoPersona(personaId);
  useSession.getState().signIn(persona.user);
  return {
    user: persona.user,
    redirectTo: postAuthHref(nextHref),
  };
}
